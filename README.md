# NEON MOON 

A personal full-stack website for writing, photography, media collections, and slowly growing ideas.

**Live site:**: https://neon-moonzeta.com

## Features
- Blog with categories, tags and archives
- Media collection
- Photo gallery and uploads
- Search
- English / 中文
- Private admin CMS
- Responsive desktop and mobile UI

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- MySQL
- Docker
- Cloudflare

## Deployment
Self-hosted on a Raspberry Pi using Docker and Cloudflare Tunnel.

Browser
  ↓
Cloudflare
  ↓
Cloudflare Tunnel
  ↓
Raspberry Pi
  ↓
Next.js + MySQL

## Local Development
npm install
docker compose up -d
npx prisma migrate deploy
npm run dev

See `.env.example` for required environment variables.

## Roadmap
- Music player
- Analytics
- Off-site backups
- Monitoring

## About
NEON MOON started as a personal project for practising full-stack
development beyond coursework. I plan to keep developing it as a
website that I actually use.

## Development Status

NEON-MOON is currently under active development.

Current focus:

- Improving the admin CMS
- Refining mobile responsiveness
- Expanding the media collection
- Improving deployment reliability
