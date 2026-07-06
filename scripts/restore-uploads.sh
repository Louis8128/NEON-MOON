#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env}"
APP_SERVICE="${APP_SERVICE:-app}"

usage() {
  echo "Usage: $0 <uploads-backup.tar.gz|uploads-backup.tgz>" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

BACKUP_FILE="$1"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "Error: backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

case "${BACKUP_FILE}" in
  *.tar.gz | *.tgz)
    ;;
  *)
    echo "Error: uploads backup file must end with .tar.gz or .tgz" >&2
    exit 1
    ;;
esac

command -v docker >/dev/null 2>&1 || {
  echo "Error: docker is required." >&2
  exit 1
}

echo "This will restore uploads from: ${BACKUP_FILE}"
echo "Existing files are not deleted, but matching paths may be overwritten."
read -r -p "Type RESTORE_UPLOADS to continue: " CONFIRMATION

if [[ "${CONFIRMATION}" != "RESTORE_UPLOADS" ]]; then
  echo "Uploads restore cancelled."
  exit 1
fi

echo "Restoring uploads backup..."

cat "${BACKUP_FILE}" | docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${APP_SERVICE}" sh -c '
  set -eu
  mkdir -p /app/public/uploads
  tar -xzf - -C /app
'

echo "Uploads restore completed."
