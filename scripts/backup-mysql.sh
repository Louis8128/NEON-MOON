#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
MYSQL_SERVICE="${MYSQL_SERVICE:-mysql}"
DATABASE_NAME="${DATABASE_NAME:-neon_moon}"

TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
OUTPUT_DIR="${BACKUP_DIR}/mysql"
OUTPUT_FILE="${OUTPUT_DIR}/${DATABASE_NAME}_${TIMESTAMP}.sql.gz"
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

echo "Creating MySQL backup for database '${DATABASE_NAME}'..."

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${MYSQL_SERVICE}" sh -c '
  set -eu
  MYSQL_PWD="${MYSQL_PASSWORD}" exec mysqldump \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    --events \
    --no-tablespaces \
    -u"${MYSQL_USER}" \
    "${MYSQL_DATABASE}"
' | gzip -c > "${TEMP_FILE}"

mv "${TEMP_FILE}" "${OUTPUT_FILE}"
trap - EXIT

echo "MySQL backup written to: ${OUTPUT_FILE}"
