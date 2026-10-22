# Cover Desciptions

The `main.py` script fetches Folgen from the Archiv API, downloads each available `artwork` image, and generates alt text with Ollama. It saves results as a JSON array of `{ "id": ..., "alt": "..." }` objects.

Start the Archiv service and make sure the selected model is available to Ollama, then run:

```sh
cd packages/cover-desciptions
uv run main.py
```

By default, it uses the `gemma4:12b` model, requests `http://localhost:8080/folgen`, and writes results to `alt-text.json` next to the script. The file is updated atomically after each generated alt text. On reruns, entries with an existing non-empty alt text are skipped, so their artwork is not downloaded again.

Options:

```sh
uv run main.py --endpoint http://localhost:8080/folgen --output ./alt-text.json --model gemma4:12b
```

`--model` selects the Ollama model and defaults to `gemma4:12b`. `FOLGEN_URL` can be used instead of `--endpoint`. Set `OLLAMA_URL` to override the Ollama server URL. The startup logs the endpoint, model, output path, and skip counts. Console logs use Python's standard logging with timestamps and subtle terminal colors; colors are omitted when output is redirected. Each processed Folge gets a separate elapsed-time line after its alt text, and total runtime is printed at the end.
