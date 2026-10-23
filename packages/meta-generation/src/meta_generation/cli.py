import argparse
import os
from pathlib import Path

from .config import DEFAULT_FOLGEN_URL, DEFAULT_MODEL
from .logger import logger


def create_parser(
    description: str, default_output_path: Path
) -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "--endpoint",
        default=os.getenv("FOLGEN_URL", DEFAULT_FOLGEN_URL),
        help=f"Archiv Folgen endpoint (default: {DEFAULT_FOLGEN_URL})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=default_output_path,
        help=f"JSON output file (default: {default_output_path})",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Ollama model to use (default: {DEFAULT_MODEL})",
    )
    return parser


def log_generation_configuration(
    endpoint: str, model: str, output_path: Path
) -> None:
    logger.info(
        "Configuration: Folgen endpoint=%s | model=%s | output=%s",
        endpoint,
        model,
        output_path,
    )
