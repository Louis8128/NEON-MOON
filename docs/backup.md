# NEON MOON Backup and Restore

This document covers the MVP backup and restore flow for the Oracle Cloud VPS + Docker Compose deployment.

The scripts in this document are intended to run from the project root on the production server. They do not contain real secrets. Database credentials come from Docker Compose and the production `.env` file.

## 1. What needs to be backed up

Back up these production assets:

- MySQL database data.
- `public/uploads`, especially `public/uploads/photos`.
- Production `.env` secrets.

The production `.env` file must not be committed to Git. Store a copy in a secure offline location, password manager, or encrypted backup. Without it, admin session signing and database credentials may be difficult to recover.

## 2. MySQL backup

Run:

```bash
./scripts/backup-mysql.sh
```

The script uses Docker Compose to run `mysqldump` inside the MySQL service. It uses the MySQL service environment variables `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE`, which are populated from the production `.env` by `docker-compose.prod.yml`.

Output directory:

```text
backups/mysql/
```

Example output:

```text
backups/mysql/neon_moon_2026-07-06_153000.sql.gz
```

Recommended frequency: daily.

Useful environment overrides:

```bash
COMPOSE_FILE=docker-compose.prod.yml
ENV_FILE=.env
BACKUP_DIR=./backups
MYSQL_SERVICE=mysql
DATABASE_NAME=neon_moon
```

## 3. Uploads backup

Run:

```bash
./scripts/backup-uploads.sh
```

The script uses the app container to archive:

```text
/app/public/uploads
```

Output directory:

```text
backups/uploads/
```

Example output:

```text
backups/uploads/uploads_2026-07-06_153000.tar.gz
```

The backup does not delete or modify existing uploaded files. Empty uploads directories are valid and should still produce an archive.

## 4. Restore MySQL

Run:

```bash
./scripts/restore-mysql.sh <backup-file>
```

Example:

```bash
./scripts/restore-mysql.sh backups/mysql/neon_moon_2026-07-06_153000.sql.gz
```

Supported formats:

```text
.sql
.sql.gz
```

This is a destructive operation. The script requires typing `RESTORE` before it sends the SQL into the MySQL container. Test restore procedures on a non-production copy before using them on production.

## 5. Restore uploads

Run:

```bash
./scripts/restore-uploads.sh <backup-file>
```

Example:

```bash
./scripts/restore-uploads.sh backups/uploads/uploads_2026-07-06_153000.tar.gz
```

Supported formats:

```text
.tar.gz
.tgz
```

The restore extracts the archive into `/app` inside the app container. Because uploads backups contain `public/uploads`, this restores files into:

```text
/app/public/uploads
```

The script does not delete existing uploads by default. If a restored file has the same path as an existing file, the restored file may overwrite it.

## 6. Retention policy

Suggested MVP retention:

- Keep the latest 7 daily backups.
- Keep the latest 4 weekly backups.
- Keep important release or migration backups manually for longer.

This phase does not automatically delete older backups. Add automated retention after the backup process has been tested.

## 7. Raspberry Pi backup target

A Raspberry Pi is a good future offsite backup target, but it should not be the primary production server.

Future sync example:

```bash
rsync -avz backups/ pi@raspberrypi.local:/path/to/neon-moon-backups/
```

Do not hard-code Raspberry Pi hostnames, usernames, or paths into production scripts yet. Keep them configurable when remote backup automation is added.

## 8. Cron example

Example daily cron entry:

```cron
0 3 * * * cd /path/to/my-life-site && ./scripts/backup-mysql.sh && ./scripts/backup-uploads.sh
```

Do not install cron automatically from the repository. Add it manually on the production server after confirming the scripts work.

## 9. Security notes

- Do not commit `backups/` to Git.
- Do not commit `.env` to Git.
- Restrict backup file permissions.
- Keep at least one backup copy away from the VPS.
- Test restore regularly on a non-production environment.
- Do not print database passwords in terminal logs.
- Treat `.sql`, `.sql.gz`, and uploads archives as sensitive production data.
