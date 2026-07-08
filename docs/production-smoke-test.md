# NEON MOON Production Smoke Test Runbook

This runbook verifies that NEON MOON can run in a production-like Docker Compose environment before it is deployed to an Oracle Cloud VPS.

It does not contain real secrets. Do not commit local production env files, database dumps, uploaded test files, or backups.

## 1. Scope

Use this runbook for:

- Local Docker production smoke testing.
- Oracle VPS post-deploy acceptance testing.
- Verifying public pages, admin auth, CMS workflows, uploads persistence, and backups.

Do not use this runbook to:

- Delete Docker volumes.
- Restore production backups.
- Run destructive database commands.
- Replace `prisma migrate deploy` with `prisma db push`.
- Store real secrets in Git.

## 2. Prepare a local production env file

Create a local-only env file from `.env.example`:

```powershell
Copy-Item .env.example .env.production.local
```

Edit `.env.production.local` for local smoke testing:

```env
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

DATABASE_HOST="mysql"
DATABASE_PORT=3306
DATABASE_NAME="neon_moon"
DATABASE_USER="neon_user"
DATABASE_PASSWORD="<local-test-password>"
DATABASE_URL="mysql://neon_user:<local-test-password>@mysql:3306/neon_moon"
MYSQL_ROOT_PASSWORD="<local-test-root-password>"

ADMIN_PASSWORD="<local-test-admin-password>"
ADMIN_SESSION_SECRET="<local-test-random-secret>"
```

Generate `ADMIN_SESSION_SECRET` with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Expected result:

- `.env.production.local` exists locally.
- It is not committed to Git.
- `DATABASE_HOST` is `mysql`.
- `DATABASE_URL` uses `@mysql:3306`.
- No local development or real production secrets are reused.

Important Compose note:

- `docker-compose.prod.yml` currently sets the app service `env_file` to `.env`.
- `--env-file .env.production.local` supplies variables for Compose interpolation, especially the MySQL service values, but it does not change the app service `env_file` path.
- For a local smoke test, make sure the app container also receives the same values. In a disposable local checkout, the simplest path is to copy `.env.production.local` to `.env` before starting the stack.
- Do not overwrite a real production `.env`. Do not commit either file.

## 3. Validate Docker Compose configuration

Run:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml config --quiet
```

Expected result:

- Command exits with status 0.
- No MySQL host port such as `3306:3306` is exposed.
- `uploads_data` is mounted to `/app/public/uploads`.
- `mysql_data` is mounted to `/var/lib/mysql`.

If it fails:

- Check that `.env.production.local` exists.
- Check that `.env` exists too if you are using the current `docker-compose.prod.yml` app `env_file`.
- Check that all variables referenced by `docker-compose.prod.yml` are set.
- Check YAML indentation in `docker-compose.prod.yml`.

## 4. Build and start the local production stack

Run:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml up -d --build
```

Check service state:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml ps
docker compose --env-file .env.production.local -f docker-compose.prod.yml logs app
docker compose --env-file .env.production.local -f docker-compose.prod.yml logs mysql
```

Expected result:

- `mysql` becomes healthy.
- `app` is running.
- App logs show Next.js listening on port 3000.
- MySQL logs do not show repeated authentication or crash loops.

If it fails:

- If the app cannot connect to MySQL, verify `DATABASE_HOST=mysql` and `DATABASE_URL` uses `@mysql:3306`.
- If the MySQL service starts but the app has missing admin or database variables, check whether `.env` matches `.env.production.local`.
- If MySQL is unhealthy, inspect `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_ROOT_PASSWORD`.
- If image build fails, check Docker network access and `npm ci` output.

## 5. Run Prisma production migrations

Use Prisma migrations in the app container:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

If the app container is not ready yet, run a one-off app container:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
```

Expected result:

- Prisma reports all migrations applied or already up to date.
- No schema drift or failed migration is reported.

Do not use:

```text
prisma db push
```

## 6. Public pages smoke test

Open or request these URLs:

```text
http://localhost:3000/
http://localhost:3000/about
http://localhost:3000/blog
http://localhost:3000/blog/archive
http://localhost:3000/blog/categories
http://localhost:3000/blog/tags
http://localhost:3000/media
http://localhost:3000/photos
http://localhost:3000/search
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/rss.xml
http://localhost:3000/manifest.webmanifest
```

Expected result:

- Pages return 200.
- Home background and intro render correctly.
- Public navigation has no admin link.
- Blog archive, categories, and tags render without dead links.
- Search page loads and empty state is natural.
- `robots.txt` blocks admin and api paths.
- `sitemap.xml` contains public URLs only.
- `rss.xml` contains published posts only.
- `manifest.webmanifest` returns valid JSON.

If it fails:

- Check `docker compose ... logs app`.
- Check `NEXT_PUBLIC_SITE_URL`.
- Check database migrations and seed/content state.

## 7. Admin auth smoke test

Open:

```text
http://localhost:3000/admin/login
```

Test:

- Log in with the local test `ADMIN_PASSWORD`.
- Open `/admin`.
- Open `/blog/admin`.
- Open `/media/admin`.
- Open `/photos/admin`.
- Log out.
- Reopen `/admin`, `/blog/admin`, `/media/admin`, and `/photos/admin` after logout.

Expected result:

- Login succeeds with the configured local test password.
- Admin dashboard loads.
- Protected admin pages are accessible only after login.
- Logout redirects to `/admin/login`.
- Protected pages redirect to login after logout.
- No public navigation link exposes admin pages.

Do not brute-force passwords.

If it fails:

- Check `ADMIN_PASSWORD`.
- Check `ADMIN_SESSION_SECRET`.
- Check that the browser accepts cookies for `localhost`.
- Check app logs for auth or session errors.

## 8. CMS content smoke test

Only run these tests against a local test database or a disposable staging database.

Blog:

- Create a draft.
- Add category and tags.
- Publish the post.
- Confirm it appears on `/blog`, archive, categories, tags, sitemap, and search.
- Unpublish it.
- Confirm it disappears from public pages and public search.
- Try a duplicate slug and confirm a clear conflict message.

Media:

- Create a media item.
- Leave `coverUrl` empty and confirm the category placeholder renders on list and detail pages.
- Edit the item.
- Delete the item.

Photos:

- Upload a small JPG, PNG, or WEBP under 8MB.
- Confirm it appears in `/photos`.
- Open the detail page.
- Delete it from admin.
- Confirm the public page no longer shows the record.
- Confirm the uploaded file is removed if the delete flow is expected to clean files.

Expected result:

- CRUD flows work in the local test database.
- Public pages only show intended public content.
- Admin APIs do not return 401 after valid login.

## 9. Persistence smoke test

After uploading a local test photo, run:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml restart app
```

Then verify:

- The uploaded photo URL still loads.
- The photo record still appears in `/photos`.

Restart MySQL:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml restart mysql
```

Then verify:

- Public pages still load.
- Database records still exist.
- Admin pages still work after logging in again if needed.

Expected result:

- App restart does not remove uploaded files.
- MySQL restart does not remove database data.
- Docker volumes preserve state.

Do not run `down -v` unless you intentionally want to delete local test data.

## 10. Backup smoke test

Only test backup creation. Do not run restore during normal smoke testing.

Run:

```powershell
bash scripts/backup-mysql.sh
bash scripts/backup-uploads.sh
```

Expected result:

- MySQL backup appears under `backups/mysql/`.
- Uploads backup appears under `backups/uploads/`.
- Backup files are not committed to Git.

If it fails:

- Confirm the Docker stack is running.
- Confirm the scripts can find `docker-compose.prod.yml`.
- Confirm the backup scripts use the correct env file. If needed, set:

```powershell
$env:ENV_FILE=".env.production.local"
$env:COMPOSE_FILE="docker-compose.prod.yml"
```

Do not run restore unless explicitly planned and confirmed.

## 11. Shutdown

Stop containers while keeping test volumes:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml down
```

Do not use:

```powershell
docker compose --env-file .env.production.local -f docker-compose.prod.yml down -v
```

The `-v` flag deletes volumes and can remove local test database data and uploaded images.

## 12. Oracle VPS repeat steps

On the Oracle VPS, repeat the same flow with the real production `.env`:

1. Clone or update the repository.
2. Create `.env` from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the final public origin.
4. Set `DATABASE_HOST=mysql`.
5. Set `DATABASE_URL` to use `@mysql:3306`.
6. Generate fresh production secrets.
7. Build and start the stack:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

8. Run migrations:

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

9. Run the public page, admin auth, CMS, persistence, and backup smoke tests.
10. Configure Nginx and HTTPS after the app passes smoke testing on port 3000.

Expected result:

- App works through the VPS public IP or domain.
- HTTPS is added before public domain launch.
- MySQL port 3306 remains closed to the public internet.
- Backups work before real content is added.

## 13. Final acceptance checklist

Public:

- [ ] `/`, `/about`, `/blog`, `/media`, `/photos`, and `/search` return 200.
- [ ] Blog archive, categories, and tags return 200.
- [ ] Dynamic blog, media, and photo detail pages work for existing records.
- [ ] `robots.txt`, `sitemap.xml`, `rss.xml`, and `manifest.webmanifest` work.

Admin:

- [ ] `/admin/login` loads.
- [ ] Login succeeds.
- [ ] Protected pages redirect when logged out.
- [ ] Logout clears the admin session.
- [ ] Admin APIs work after login and return 401 when logged out.

CMS:

- [ ] Blog draft, publish, unpublish, category, tags, and slug conflict are checked.
- [ ] Media create, edit, delete, and no-cover placeholder are checked.
- [ ] Photo upload, public display, detail page, and delete are checked.

Persistence:

- [ ] Uploaded files survive app restart.
- [ ] Database records survive MySQL restart.
- [ ] `mysql_data` and `uploads_data` volumes exist.

Backup:

- [ ] MySQL backup creates a `.sql.gz` file.
- [ ] Uploads backup creates a `.tar.gz` file.
- [ ] Backup files are not committed.
- [ ] Restore is documented but not run without explicit approval.
