#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
TESTS_DIR="$SCRIPT_DIR"
TEST_CONFIG="${1:-${TEST_CONFIG:-smoke}}"

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [smoke|average|stress|spike|breakpoint]"
  exit 2
fi

case "$TEST_CONFIG" in
  smoke|average|stress|spike|breakpoint) ;;
  *)
    echo "Error: invalid test config '$TEST_CONFIG'"
    echo "Expected one of: smoke, average, stress, spike, breakpoint"
    exit 2
    ;;
esac

if [[ -z "${ENDPOINT_URL:-}" ]]; then
  echo "Error: ENDPOINT_URL environment variable is not set"
  echo "Example: ENDPOINT_URL=http://localhost:8080/folgen $0 smoke"
  exit 1
fi

docker run -i --network=host --rm \
  -v "$TESTS_DIR:/src:ro" \
  -e ENDPOINT_URL="$ENDPOINT_URL" \
  -e TEST_CONFIG="$TEST_CONFIG" \
  grafana/k6 run /src/k6.script.ts
