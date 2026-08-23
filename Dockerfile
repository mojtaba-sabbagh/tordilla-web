
# -------- Builder --------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies with retry + cached apt directories
RUN --mount=type=cache,target=/var/cache/apt \
     --mount=type=cache,target=/var/lib/apt \
     apt-get update -o Acquire::Retries=5 \
     && apt-get install -y --no-install-recommends \
         python3 \
         make \
         g++ \
         openssl \
         -o Acquire::Retries=5 \
     && rm -rf /var/lib/apt/lists/*


# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

RUN npm install lightningcss --save-exact
RUN npm install @next/swc-linux-x64-gnu

# Copy project
COPY . .
COPY .env.docker .env

# `npm ci` above ran before the schema existed, so Prisma's postinstall had
# nothing to generate from. Generate now that prisma/schema.prisma is here,
# otherwise @prisma/client exports no types and the build fails type checking.
RUN npx prisma generate

# Build Next.js
RUN npm run build


# -------- Runner --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Uploads are written here instead of public/, so a rebuild cannot wipe them.
# docker-compose.yml mounts a named volume over this path.
ENV MEDIA_UPLOAD_DIR=/app/data/media

# Prisma's query engine links against libssl.
RUN --mount=type=cache,target=/var/cache/apt \
     --mount=type=cache,target=/var/lib/apt \
     apt-get update -o Acquire::Retries=5 \
     && apt-get install -y --no-install-recommends openssl -o Acquire::Retries=5 \
     && rm -rf /var/lib/apt/lists/*

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy Next static files
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets (the blog images committed to the repo live here)
COPY --from=builder /app/public ./public

# Copy Prisma files (engines + schema)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# The runner needs the environment too, not just the build: Next reads .env
# from the working directory when the server starts, which is where
# DATABASE_URL and JWT_SECRET come from at runtime.
COPY --from=builder /app/.env.docker ./.env

# Created empty so the named volume mounted here inherits its ownership.
RUN mkdir -p /app/data/media

EXPOSE 3000

CMD ["node", "server.js"]
