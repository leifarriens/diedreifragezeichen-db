from pathlib import Path

DEFAULT_FOLGEN_URL = "http://localhost:8080/folgen"
DEFAULT_MODEL = "gemma4:12b"
DEFAULT_OLLAMA_URL = "http://host.docker.internal:11434"
PACKAGE_ROOT = Path(__file__).resolve().parents[2]
GENERATED_DIR = PACKAGE_ROOT / "generated"
