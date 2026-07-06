#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
APP_SERVICE="${APP_SERVICE:-app}"

TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
OUTPUT_DIR="${BACKUP_DIR}/uploads"
OUTPUT_FILE="${OUTPUT_DIR}/uploads_${TIMESTAMP}.tar.gz"
TEMP_FILE="${OUTPUT_FILE}.tmp"

cleanup() {
  rm -f "${TEMP_FILE}"
}

trap cleanup EXIT

command -v docker >/dev/null 2>&1 || {
  echo "Error: docker is required." >&2
  exit 1
}

mkdir -p "${OUTPUT_DIR}"

echo "Creating uploads backup..."

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${APP_SERVICE}" sh -c '
  set -eu
  mkdir -p /app/public/uploads
  tar -czf - -C /app public/uploads
' > "${TEMP_FILE}"

mv "${TEMP_FILE}" "${OUTPUT_FILE}"
trap - EXIT

echo "Uploads backup written to: ${OUTPUT_FILE}"
