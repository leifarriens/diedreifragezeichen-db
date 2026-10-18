import argparse
import json
import logging
import os
import sys
import tempfile
import time
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import urlopen

import ollama

DEFAULT_FOLGEN_URL = "http://localhost:8080/folgen"
DEFAULT_MODEL = "gemma4:12b"
DEFAULT_OUTPUT_PATH = Path(__file__).with_name("alt-text.json")


class ColorFormatter(logging.Formatter):
    LEVEL_COLORS = {
        logging.DEBUG: "\033[90m",
        logging.INFO: "\033[36m",
        logging.WARNING: "\033[33m",
        logging.ERROR: "\033[31m",
        logging.CRITICAL: "\033[1;31m",
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        message = super().format(record)
        color = self.LEVEL_COLORS.get(record.levelno)
        if color is None or not sys.stderr.isatty():
            return message
        return f"{color}{message}{self.RESET}"


handler = logging.StreamHandler()
handler.setFormatter(
    ColorFormatter(
        "%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
)
logger = logging.getLogger("alt-generator")
logger.setLevel(logging.INFO)
logger.addHandler(handler)
logger.propagate = False

client = ollama.Client(
    host=os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")
)


def validate_http_url(url: str, argument_name: str) -> None:
    parsed_url = urlparse(url)
    if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
        raise ValueError(f"{argument_name} must be an absolute HTTP or HTTPS URL")


def fetch_folgen(endpoint_url: str) -> list[dict[str, object]]:
    validate_http_url(endpoint_url, "endpoint_url")

    try:
        with urlopen(endpoint_url, timeout=30) as response:
            payload = json.loads(response.read())
    except URLError as error:
        message = f"Could not fetch Folgen from {endpoint_url}: {error}"
        raise RuntimeError(message) from error
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise ValueError(f"Folgen endpoint returned invalid JSON: {error}") from error

    if not isinstance(payload, list) or not all(
        isinstance(folge, dict) for folge in payload
    ):
        raise ValueError("Folgen endpoint must return a JSON array of objects")

    return payload


def download_image(image_url: str) -> bytes:
    validate_http_url(image_url, "image_url")

    logger.info("Downloading image from %s", image_url)
    try:
        with urlopen(image_url, timeout=30) as response:
            image = response.read()
    except URLError as error:
        message = f"Could not download image from {image_url}: {error}"
        raise RuntimeError(message) from error

    if not image:
        raise ValueError(f"No image data received from {image_url}")

    return image


def generate_alt_text(image_url: str, model: str = DEFAULT_MODEL) -> str:
    image = download_image(build_image_proxy_url(image_url, 640))
    logger.info("Generating alt text")
    response = client.chat(
        model=model,
        messages=[
            {
                "role": "user",
                "content": (
                    "Schreibe einen kurzen, sachlichen Alternativtext auf Deutsch für "
                    "dieses Hörspiel-Cover aus der Reihe Die drei ???. Beschreibe nur, "
                    "was auf dem Cover tatsächlich zu sehen ist, zum Beispiel Figuren, "
                    "Gegenstände, Umgebung, Farben und Bildgestaltung. Erwähne nicht, "
                    "dass es eine Illustration oder Zeichnung ist, da alle Cover "
                    "gezeichnet sind. Erfinde keine Handlung oder Details und leite "
                    "nichts aus Reihenwissen ab. Nenne "
                    "den Titel nur, wenn er klar lesbar ist. Beginne nicht mit "
                    '"Bild von" oder "Cover von".'
                ),
                "images": [image],
            }
        ],
    )
    return response["message"]["content"]


def load_results(output_path: Path) -> list[dict[str, object]]:
    if not output_path.exists():
        return []

    try:
        results = json.loads(output_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise ValueError(f"Output file contains invalid JSON: {output_path}") from error

    if not isinstance(results, list) or not all(
        isinstance(result, dict)
        and isinstance(result.get("id"), int)
        and not isinstance(result.get("id"), bool)
        and isinstance(result.get("alt"), str)
        for result in results
    ):
        message = (
            "Output file must contain an array of {id, alt} objects: "
            f"{output_path}"
        )
        raise ValueError(message)

    return results


def save_results(output_path: Path, results: list[dict[str, object]]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=output_path.parent,
            prefix=f".{output_path.name}.",
            suffix=".tmp",
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            json.dump(results, temporary_file, ensure_ascii=False, indent=2)
            temporary_file.write("\n")
            temporary_file.flush()
            os.fsync(temporary_file.fileno())

        os.replace(temporary_path, output_path)
    finally:
        if temporary_path is not None and temporary_path.exists():
            temporary_path.unlink()


def generate_missing_alt_text(
    endpoint_url: str, output_path: Path, model: str = DEFAULT_MODEL
) -> tuple[int, int, int]:
    folgen = fetch_folgen(endpoint_url)
    results = load_results(output_path)
    completed_ids = {
        result["id"] for result in results if result["alt"].strip()
    }
    pending_folgen: list[tuple[int, object, str]] = []
    queued_ids: set[int] = set()
    completed_count = 0
    missing_artwork_count = 0
    invalid_id_count = 0
    duplicate_count = 0

    for folge in folgen:
        folge_id = folge.get("id")
        if not isinstance(folge_id, int) or isinstance(folge_id, bool):
            invalid_id_count += 1
            continue

        if folge_id in completed_ids:
            completed_count += 1
            continue

        if folge_id in queued_ids:
            duplicate_count += 1
            continue

        artwork_url = folge.get("artwork")
        if not isinstance(artwork_url, str) or not artwork_url.strip():
            missing_artwork_count += 1
            continue

        queued_ids.add(folge_id)
        pending_folgen.append((folge_id, folge.get("title"), artwork_url))

    skipped_count = (
        completed_count
        + missing_artwork_count
        + invalid_id_count
        + duplicate_count
    )
    logger.info(
        "Found %d Folgen. Skipping %d (%d already complete, %d without artwork, "
        "%d invalid IDs, %d duplicates); processing %d.",
        len(folgen),
        skipped_count,
        completed_count,
        missing_artwork_count,
        invalid_id_count,
        duplicate_count,
        len(pending_folgen),
    )
    save_results(output_path, results)

    failed_count = invalid_id_count
    for index, (folge_id, folge_title, artwork_url) in enumerate(
        pending_folgen, start=1
    ):
        logger.info(
            "Processing Folge ID: %s, Title: %s (%d/%d)",
            folge_id,
            folge_title,
            index,
            len(pending_folgen),
        )
        generation_started_at = time.perf_counter()
        try:
            alt_text = generate_alt_text(artwork_url, model).strip()
            if not alt_text:
                raise ValueError("The model returned empty alt text")
            logger.info("-> %s", alt_text)
        except Exception as error:
            logger.error(
                "Failed to generate alt text for Folge %s: %s", folge_id, error
            )
            failed_count += 1
            continue
        finally:
            logger.info(
                "Alt-text generation for Folge %s took %.2f seconds",
                folge_id,
                time.perf_counter() - generation_started_at,
            )

        results.append({"id": folge_id, "alt": alt_text})
        completed_ids.add(folge_id)
        save_results(output_path, results)

    return failed_count, missing_artwork_count, len(results)


def build_image_proxy_url(image_url: str, width: int) -> str:
    return f"http://localhost:3000/_next/image?url={image_url}&w={width}&q=85"

def main() -> int:
    started_at = time.perf_counter()
    parser = argparse.ArgumentParser(
        description="Generate and incrementally save alt text for Archiv artwork."
    )
    parser.add_argument(
        "--endpoint",
        default=os.getenv("FOLGEN_URL", DEFAULT_FOLGEN_URL),
        help=f"Archiv Folgen endpoint (default: {DEFAULT_FOLGEN_URL})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_PATH,
        help=f"JSON output file (default: {DEFAULT_OUTPUT_PATH})",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Ollama model to use (default: {DEFAULT_MODEL})",
    )
    args = parser.parse_args()
    logger.info(
        "Configuration: Folgen endpoint=%s | model=%s | output=%s",
        args.endpoint,
        args.model,
        args.output,
    )

    try:
        failed_count, missing_artwork_count, saved_count = generate_missing_alt_text(
            args.endpoint, args.output, args.model
        )
        logger.info(
            "Done. %d alt texts in output; %d entries had no artwork; "
            "%d entries failed. Output: %s",
            saved_count,
            missing_artwork_count,
            failed_count,
            args.output,
        )
        return 1 if failed_count else 0
    finally:
        logger.info(
            "Total runtime: %.2f seconds", time.perf_counter() - started_at
        )


if __name__ == "__main__":
    raise SystemExit(main())
