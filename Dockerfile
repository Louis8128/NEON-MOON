# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="mysql://docker_build:docker_build@localhost:3306/docker_build"
ENV DATABASE_HOST="localhost"
ENV DATABASE_PORT=3306
ENV DATABASE_USER="docker_build"
ENV DATABASE_PASSWORD="docker_build"
ENV DATABASE_NAME="docker_build"
ENV ADMIN_PASSWORD="docker_build"
ENV ADMIN_SESSION_SECRET="docker_build"

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma.config.ts ./prisma.config.ts
COPY prisma ./prisma
RUN npx prisma generate

FROM node:22-bookworm-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="mysql://docker_build:docker_build@localhost:3306/docker_build"
ENV DATABASE_HOST="localhost"
ENV DATABASE_PORT=3306
ENV DATABASE_USER="docker_build"
ENV DATABASE_PASSWORD="docker_build"
ENV DATABASE_NAME="docker_build"
ENV ADMIN_PASSWORD="docker_build"
ENV ADMIN_SESSION_SECRET="docker_build"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN mkdir -p /app/public/uploads \
  && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
