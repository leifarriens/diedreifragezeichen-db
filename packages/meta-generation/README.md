# Cover Desciptions

The `scripts/generate_cover_alt_text.py` entry point fetches Folgen from the Archiv API, downloads each available `artwork` image, and generates alt text. It saves results as a JSON array of `{ "id": ..., "alt": "..." }` objects.

Start the Archiv service and make sure the selected model is available to Ollama, then run:

```sh
cd packages/meta-generation
uv run scripts/generate_cover_alt_text.py
```

By default, it uses the `gemma4:12b` model, requests `http://localhost:8080/folgen`, and writes results to `generated/alt-text.json`. The file is updated atomically after each generated alt text. On reruns, entries with an existing non-empty alt text are skipped, so their artwork is not downloaded again.

Options:

```sh
uv run scripts/generate_cover_alt_text.py --endpoint http://localhost:8080/folgen --output ./generated/alt-text.json --model gemma4:12b
```

`--model` selects the Ollama model and defaults to `gemma4:12b`. `FOLGEN_URL` can be used instead of `--endpoint`. Set `OLLAMA_URL` to override the Ollama server URL. The startup logs the endpoint, model, output path, and skip counts. Console logs use Python's standard logging with timestamps and subtle terminal colors; colors are omitted when output is redirected. Each processed Folge gets a separate elapsed-time line after its alt text, and total runtime is printed at the end.

## Folgen tags

Run `scripts/generate_folgen_tags.py` to categorize each Folge using only its title and description:

```sh
uv run scripts/generate_folgen_tags.py
```

The script selects 1 to 3 tags in each of the five categories, saves results
incrementally to `generated/tags.json`, and skips Folgen that already have a saved tag set.
The title and description are the only episode data included in the model context.
Pass `--show-thinking` to stream the model's thinking to stderr during generation,
when supported by the selected Ollama model. Printing thinking is off by default.
It accepts the same `--endpoint`, `--output`, and `--model` options as `scripts/generate_cover_alt_text.py`.
