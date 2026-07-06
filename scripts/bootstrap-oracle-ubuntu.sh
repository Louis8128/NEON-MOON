#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This script is intended for Ubuntu Linux servers." >&2
  exit 1
fi

if [[ -r /etc/os-release ]]; then
  # shellcheck source=/dev/null
  . /etc/os-release
else
  echo "Cannot read /etc/os-release. This script expects Ubuntu 24.04." >&2
  exit 1
fi

if [[ "${ID:-}" != "ubuntu" ]]; then
  echo "Warning: detected '${PRETTY_NAME:-unknown OS}', but this script is intended for Ubuntu 24.04." >&2
fi

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=""
  TARGET_USER="${SUDO_USER:-root}"
else
  command -v sudo >/dev/null 2>&1 || {
    echo "Error: sudo is required when not running as root." >&2
    exit 1
  }
  SUDO="sudo"
  TARGET_USER="$(id -un)"
fi

echo "Installing base packages..."
${SUDO} apt-get update
${SUDO} apt-get install -y ca-certificates curl gnupg git

echo "Adding Docker official apt repository..."
${SUDO} install -m 0755 -d /etc/apt/keyrings
${SUDO} curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
${SUDO} chmod a+r /etc/apt/keyrings/docker.asc

DOCKER_CODENAME="${UBUNTU_CODENAME:-${VERSION_CODENAME:-}}"

if [[ -z "${DOCKER_CODENAME}" ]]; then
  echo "Error: cannot determine Ubuntu codename for Docker apt repository." >&2
  exit 1
fi

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${DOCKER_CODENAME} stable" |
  ${SUDO} tee /etc/apt/sources.list.d/docker.list >/dev/null

echo "Installing Docker Engine and Docker Compose plugin..."
${SUDO} apt-get update
${SUDO} apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

if [[ "${TARGET_USER}" != "root" ]]; then
  echo "Adding ${TARGET_USER} to the docker group..."
  ${SUDO} usermod -aG docker "${TARGET_USER}"
fi

echo
echo "Bootstrap complete."
echo
echo "Next steps:"
echo "1. Log out and log back in for docker group membership to apply."
echo "2. Verify Docker with: docker --version && docker compose version"
echo "3. Clone the NEON MOON repository."
echo "4. Create production .env from .env.example."
echo "5. Build and start docker-compose.prod.yml."
echo
echo "This script did not clone the repo, write .env, open firewall ports, install Nginx/Certbot, or start Docker Compose."
