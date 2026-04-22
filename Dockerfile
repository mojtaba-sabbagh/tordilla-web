
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

# Build Next.js
RUN npm run build


# -------- Runner --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy Next static files
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Prisma files (engines + schema)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "server.js"]
