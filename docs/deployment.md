# NEON MOON Deployment Runbook

This runbook is a production deployment planning document. It does not contain real secrets and does not replace a dry-run deployment checklist.

## 1. Recommended deployment architecture

Recommended route for the current MVP:

```text
Oracle Cloud VPS + Docker Compose
```

Target architecture:

```text
Cloudflare DNS
-> Oracle Cloud VPS
-> Nginx / HTTPS
-> Next.js app
-> MySQL
-> persistent uploads volume
```

This keeps the app, database, and uploaded images close to the current local development model while still leaving room to move uploads or MySQL to managed services later.

Useful references:

- Next.js self-hosting: https://nextjs.org/docs/app/guides/self-hosting
- Prisma production migrations: https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate
- Certbot for Nginx: https://certbot.eff.org/instructions?ws=nginx&os=snap

## 2. Why not Vercel for current MVP

Vercel is not the preferred first deployment target for this project because the current app has:

- MySQL as the primary database.
- Photo uploads written to the local filesystem.
- Uploaded photo paths stored as `/uploads/photos/...`.

The current photos upload route saves files under:

```text
public/uploads/photos
```

Serverless/local runtime filesystems are not a good durable storage layer for user uploads. If the project moves to Vercel later, use:

- External MySQL or another managed relational database.
- Object storage such as Cloudflare R2, S3, or Oracle Object Storage.
- App changes so uploads write to object storage instead of `public/uploads/photos`.

Vercel file guidance: https://vercel.com/guides/how-can-i-use-files-in-serverless-functions

## 3. Production environment variables

Create the production `.env` from `.env.example`. Never commit `.env`, and never reuse local development secrets in production.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Set to `production` for production runtime behavior. |
| `DATABASE_URL` | Used by Prisma CLI and migrations. |
| `DATABASE_HOST` | MySQL host used by the app runtime Prisma adapter. |
| `DATABASE_PORT` | MySQL port used by the app runtime Prisma adapter. |
| `DATABASE_USER` | MySQL user used by the app runtime Prisma adapter. |
| `DATABASE_PASSWORD` | MySQL password used by the app runtime Prisma adapter. |
| `DATABASE_NAME` | MySQL database name used by the app runtime Prisma adapter. |
| `MYSQL_ROOT_PASSWORD` | Root password for the MySQL container in production Docker Compose. |
| `ADMIN_PASSWORD` | The single admin login password for the current MVP. |
| `ADMIN_SESSION_SECRET` | HMAC signing secret for HttpOnly admin session cookies. |

Important notes:

- `DATABASE_URL` is for Prisma CLI and migration commands.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME` are used by the app runtime Prisma adapter.
- For `docker-compose.prod.yml`, set `DATABASE_HOST` to `mysql`.
- For `docker-compose.prod.yml`, set `DATABASE_URL` to use the internal MySQL host, for example `mysql://<db_user>:<db_password>@mysql:3306/<db_name>`.
- `ADMIN_PASSWORD` is currently the only admin login password.
- `ADMIN_SESSION_SECRET` must be generated fresh for production.
- Do not reuse local development values.
- Do not include deprecated variables such as `ADMIN_UPLOAD_PASSWORD`.

Generate `ADMIN_SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 4. Database migration plan

Use Prisma migrations for production:

```powershell
npx prisma migrate deploy
```

Do not use this on production:

```text
prisma db push
```

When using Docker Compose, run migrations from the app container or a deployment environment that has:

- The checked-out repository.
- Installed Node dependencies.
- Access to the production MySQL host.
- The production `DATABASE_URL`.

Suggested deploy order:

1. Back up MySQL.
2. Pull the new application revision.
3. Install dependencies or build the app image.
4. Run `npx prisma migrate deploy`.
5. Start or restart the app container.
6. Verify public pages and admin login.

## 5. Uploads persistence plan

Current photo uploads are stored at:

```text
public/uploads/photos
```

Production must make this directory persistent with either:

- A Docker volume mounted to the app container.
- A host bind mount such as `/srv/neon-moon/uploads`.

If the container is rebuilt or replaced without a persistent mount, uploaded images can be lost. The database will still contain image URLs, but the files behind those URLs will be missing.

Initial MVP approach:

```text
Host directory or Docker volume
-> mounted into app container at public/uploads
-> backed up daily
```

Later improvement:

```text
Object storage
-> app uploads to bucket
-> database stores object key or public URL
-> CDN handles delivery
```

## 6. Backup strategy draft

Minimum MVP backup plan:

- MySQL backup: `mysqldump`.
- Uploads backup: `rsync` or `tar` for `public/uploads`.
- Initial backup target: a secondary directory on the same VPS.
- Later backup target: Raspberry Pi at home or another offsite host.
- Frequency: daily.
- Retention: at least 7 daily backups.

Example backup artifacts:

```text
backups/
  mysql/neon_moon-YYYY-MM-DD.sql.gz
  uploads/uploads-YYYY-MM-DD.tar.gz
```

The Raspberry Pi is a good future backup node, but it should not be the primary production server for this app. Keep production on the VPS and use the Pi for offsite redundancy.

For backup and restore procedures, see [Backup and Restore](backup.md).

## 7. Domain and HTTPS plan

Follow-up steps:

1. Buy a domain.
2. Move DNS hosting to Cloudflare.
3. Create an `A` record pointing to the Oracle Cloud public IP.
4. Open ports `80` and `443` in Oracle firewall / security list.
5. Run Nginx as a reverse proxy in front of the Next.js app.
6. Use Certbot / Let's Encrypt for HTTPS.
7. Test certificate renewal with:

```bash
sudo certbot renew --dry-run
```

Keep SSH on port `22` restricted where practical, and do not expose MySQL port `3306` publicly.

## 8. Oracle Cloud VPS checklist

Server preparation checklist:

- Provision Ubuntu 24.04.
- Open ports `22`, `80`, and `443`.
- Install Docker.
- Install Docker Compose.
- Install Git.
- Clone the repository.
- Create production `.env` from `.env.example`.
- Generate production `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Configure MySQL credentials.
- Run build/deploy.
- Run `npx prisma migrate deploy`.
- Configure persistent uploads volume.
- Configure Nginx reverse proxy.
- Configure HTTPS with Certbot / Let's Encrypt.
- Configure daily MySQL and uploads backups.
- Verify public pages, admin login, uploads, logout, and backup restore basics.

For Oracle VPS deployment rehearsal, see [Oracle VPS Deployment Rehearsal](oracle-vps-deployment.md).

## 9. Production Docker Compose deployment

Production Docker assets:

- `Dockerfile`: builds the Next.js app with `npm ci`, runs `npx prisma generate`, runs `npm run build`, and starts with `npm run start`.
- `.dockerignore`: keeps local dependencies, build output, Git metadata, `.env` files, compose files, and local `public/uploads` content out of the Docker build context.
- `docker-compose.prod.yml`: runs the `app` and `mysql` services on an internal Docker network.

The production compose file intentionally does not include Nginx or HTTPS yet. That belongs to the later `41F` phase.

Initial deployment flow:

1. Copy `.env.example` to `.env`.
2. Fill in production secrets.
3. For Docker Compose, set `DATABASE_HOST` to `mysql`.
4. For Docker Compose, set `DATABASE_URL` to use `@mysql:3306`.
5. Build the production image.
6. Start MySQL and the app.
7. Run Prisma migrations.
8. Verify the app at `http://server-ip:3000`.
9. Confirm `mysql_data` and `uploads_data` exist and are backed up.

Example commands:

```powershell
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

If the app container is not ready yet, run migrations after MySQL is healthy with:

```powershell
docker compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
```

Persistent storage:

- `mysql_data` is mounted to `/var/lib/mysql`.
- `uploads_data` is mounted to `/app/public/uploads`.

The photos upload API writes uploaded images below:

```text
public/uploads/photos
```

Inside the production app container, that resolves under:

```text
/app/public/uploads/photos
```

If `uploads_data` is not mounted, uploaded images can be lost when the app container is rebuilt or replaced. If `mysql_data` is not mounted, database data can be lost when the MySQL container is replaced.

During the initial test phase, the app service publishes:

```text
3000:3000
```

Do not expose MySQL to the public internet. The MySQL service has no host port mapping and is reachable by the app through the internal Docker network as `mysql`.

## 10. Next steps

Recommended follow-up phases:

- `41F`: Domain, Cloudflare DNS, Nginx, HTTPS.
- `42A`: Raspberry Pi backup automation.
