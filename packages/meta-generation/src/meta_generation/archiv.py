import json
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import urlopen


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
