# === Stage 1: Build ===
FROM node:22.16-alpine AS builder

WORKDIR /app

# Install deps
COPY pnpm-lock.yaml package.json ./
COPY tsconfig.json tsup.config.ts ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build client (Vite) and server (tsup)
RUN pnpm build

# === Stage 2: Production runtime ===
FROM node:22.16-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm just to run if needed (optional)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only runtime files
COPY --from=builder /app/dist ./dist
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

# Optional: if you use any runtime `.env` files
# COPY .env.production .env

CMD ["node", "dist/server/main.js"]
