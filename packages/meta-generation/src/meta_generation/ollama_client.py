import os

import ollama

from .config import DEFAULT_OLLAMA_URL

client = ollama.Client(host=os.getenv("OLLAMA_URL", DEFAULT_OLLAMA_URL))
