"""Entry point for generating cover alt text."""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from meta_generation.alt_text import main  # noqa: E402


if __name__ == "__main__":
    raise SystemExit(main())
