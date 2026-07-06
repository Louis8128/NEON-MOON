#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env}"
MYSQL_SERVICE="${MYSQL_SERVICE:-mysql}"

usage() {
  echo "Usage: $0 <backup-file.sql|backup-file.sql.gz>" >&2
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
  *.sql | *.sql.gz)
    ;;
  *)
    echo "Error: backup file must end with .sql or .sql.gz" >&2
    exit 1
    ;;
esac

command -v docker >/dev/null 2>&1 || {
  echo "Error: docker is required." >&2
  exit 1
}

echo "This will restore MySQL from: ${BACKUP_FILE}"
echo "This is a destructive operation and may overwrite production data."
read -r -p "Type RESTORE to continue: " CONFIRMATION

if [[ "${CONFIRMATION}" != "RESTORE" ]]; then
  echo "Restore cancelled."
  exit 1
fi

echo "Restoring MySQL backup..."

if [[ "${BACKUP_FILE}" == *.sql.gz ]]; then
  gzip -dc "${BACKUP_FILE}" | docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${MYSQL_SERVICE}" sh -c '
    set -eu
    MYSQL_PWD="${MYSQL_PASSWORD}" exec mysql -u"${MYSQL_USER}" "${MYSQL_DATABASE}"
  '
else
  cat "${BACKUP_FILE}" | docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${MYSQL_SERVICE}" sh -c '
    set -eu
    MYSQL_PWD="${MYSQL_PASSWORD}" exec mysql -u"${MYSQL_USER}" "${MYSQL_DATABASE}"
  '
fi

echo "MySQL restore completed."
