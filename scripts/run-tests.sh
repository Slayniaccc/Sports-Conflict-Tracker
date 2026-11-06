#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

set -a
source "$ROOT/.env"
set +a

cd "$ROOT/sct-backend"
mvn test "$@"
