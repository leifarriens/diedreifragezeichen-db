import time
from pathlib import Path
from typing import cast
from urllib.error import URLError
from urllib.request import urlopen

from .archiv import fetch_folgen, validate_http_url
from .cli import create_parser, log_generation_configuration
from .config import DEFAULT_MODEL, GENERATED_DIR
from .json_storage import load_json_file, save_json_file
from .logger import logger
from .ollama_client import client

DEFAULT_OUTPUT_PATH = GENERATED_DIR / "alt-text.json"


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
    results = load_json_file(output_path)

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

    return cast(list[dict[str, object]], results)


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
    save_json_file(output_path, results)

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
        save_json_file(output_path, results)

    return failed_count, missing_artwork_count, len(results)


def build_image_proxy_url(image_url: str, width: int) -> str:
    return f"http://localhost:3000/_next/image?url={image_url}&w={width}&q=85"


def main() -> int:
    started_at = time.perf_counter()
    parser = create_parser(
        "Generate and incrementally save alt text for Archiv artwork.",
        DEFAULT_OUTPUT_PATH,
    )
    args = parser.parse_args()
    log_generation_configuration(args.endpoint, args.model, args.output)

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
