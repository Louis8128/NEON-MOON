# Oracle VPS Deployment Rehearsal

This guide is a rehearsal runbook for deploying NEON MOON on an Oracle Cloud Ubuntu VPS with Docker Compose.

## 1. Scope

This phase covers:

- Oracle Ubuntu VPS preparation.
- Docker / Docker Compose installation.
- Git clone.
- Production `.env` creation.
- `docker-compose.prod.yml` build and startup.
- Prisma migration deploy.
- Temporary `http://server-ip:3000` testing.
- Backup script smoke tests.

This phase does not cover:

- Domain setup.
- Cloudflare DNS.
- Nginx reverse proxy.
- HTTPS / Certbot.
- Raspberry Pi backup automation.

Those belong to later phases: `41F` for domain/HTTPS and `42A` for Raspberry Pi backup automation.

## 2. Oracle Cloud prerequisites

Confirm these before starting:

- Oracle Cloud VM is provisioned with Ubuntu 24.04.
- SSH key login works.
- The VM has a public IPv4 address.
- Oracle Security List / NSG allows SSH on port `22`.
- During rehearsal only, Oracle Security List / NSG may temporarily allow app testing on port `3000`.
- In `41F`, open ports `80` and `443` for Nginx and HTTPS.

Do not open MySQL port `3306` to the public internet.

## 3. Server bootstrap

The server needs:

- Docker.
- Docker Compose plugin.
- Git.
- `curl`.
- Optional `ufw` for host-level firewall management.

Optional bootstrap script:

```bash
bash scripts/bootstrap-oracle-ubuntu.sh
```

The script installs base packages, adds Docker's official Ubuntu apt repository, installs Docker Engine and the Compose plugin, and adds the current user to the `docker` group. Log out and log back in after running it.

Manual install outline:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Verify after logging back in:

```bash
docker --version
docker compose version
git --version
```

Docker install reference: https://docs.docker.com/engine/install/ubuntu/

## 4. Clone project

Clone the repository:

```bash
git clone https://github.com/Louis8128/NEON-MOON.git
cd NEON-MOON
```

If using a fork or private remote, replace the URL:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

## 5. Create production .env

Create the production environment file:

```bash
cp .env.example .env
nano .env
```

Production requirements:

- `ADMIN_PASSWORD` must be a strong production-only password.
- `ADMIN_SESSION_SECRET` must be generated fresh for production.
- `DATABASE_HOST` must be `mysql`.
- `DATABASE_URL` must also use the Docker Compose host `mysql`.
- `MYSQL_ROOT_PASSWORD` must be a strong production-only password.
- Do not reuse local development values.
- Do not commit `.env`.

Generate `ADMIN_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Docker Compose database example:

```env
DATABASE_URL="mysql://<db_user>:<db_password>@mysql:3306/<db_name>"
DATABASE_HOST="mysql"
DATABASE_PORT=3306
DATABASE_USER="<db_user>"
DATABASE_PASSWORD="<db_password>"
DATABASE_NAME="<db_name>"
MYSQL_ROOT_PASSWORD="<replace-with-strong-root-password>"
```

## 6. Build and start containers

Build and start:

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Check logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml logs -f mysql
```

The production compose file starts `app` and `mysql`. It does not include Nginx or HTTPS yet.

## 7. Run Prisma migration

Run migrations from the app container:

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

If the app container is not ready because the database has not been migrated, run:

```bash
docker compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
```

Do not use `prisma db push` on production.

## 8. Test by IP

During the rehearsal, temporarily test:

```text
http://<oracle-public-ip>:3000
```

Check:

- Public home page.
- `/blog`.
- `/media`.
- `/photos`.
- `/search`.
- `/admin/login`.
- Admin login.
- Admin pages.
- Photo upload.

In `41F`, Nginx and HTTPS will replace direct public access to port `3000`.

## 9. Check persistence

Confirm Docker volumes exist:

```bash
docker volume ls
```

Expected production volumes:

- `mysql_data`, or the Compose-prefixed equivalent.
- `uploads_data`, or the Compose-prefixed equivalent.

Persistence rehearsal:

1. Upload a photo through the admin UI.
2. Restart containers:

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

3. Visit `/photos` and confirm the uploaded photo still exists.

Do not run:

```bash
docker compose -f docker-compose.prod.yml down -v
```

The `-v` flag deletes volumes and can remove MySQL data and uploaded images.

## 10. Backup smoke test

Check script syntax:

```bash
bash -n scripts/backup-mysql.sh
bash -n scripts/backup-uploads.sh
bash -n scripts/restore-mysql.sh
bash -n scripts/restore-uploads.sh
```

Run real backups on the server:

```bash
./scripts/backup-mysql.sh
./scripts/backup-uploads.sh
```

Do not casually run restore scripts on production. Restore scripts require explicit confirmation, but they can still overwrite production data.

For full backup and restore procedures, see [Backup and Restore](backup.md).

## 11. Basic firewall notes

There are two firewall layers to think about:

- Oracle Security List / NSG.
- Ubuntu host firewall such as `ufw`.

Rehearsal:

- Keep SSH `22` open for your IP.
- Temporarily open app port `3000` only if needed for testing.
- Never open MySQL `3306` to the public internet.

Production after `41F`:

- Use Nginx reverse proxy on ports `80` and `443`.
- Close public access to port `3000`.
- Keep MySQL reachable only inside Docker's internal network.

Optional `ufw` examples:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 3000/tcp
sudo ufw status
```

Do not enable or change `ufw` rules unless you have confirmed SSH access will remain available.

## 12. Rollback notes

Simple update flow:

```bash
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

If a new version is broken:

```bash
git log --oneline
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Database migrations need extra care. Do not automate database rollback casually. Back up MySQL before deploying a revision with schema changes.

## 13. Next step

`41F` will handle:

- Domain.
- Cloudflare DNS.
- Nginx reverse proxy.
- HTTPS / Certbot.
- Closing public port `3000`.

`42A` will handle:

- Raspberry Pi remote backup automation.
