#!/usr/bin/env bash
set -euo pipefail

set -a
source "$(dirname "$0")/.env"
set +a

cd "$(dirname "$0")/sct-backend"
mvn spring-boot:run
