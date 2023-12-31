FROM node:20-alpine AS base

# --- Dependencies Image ---
FROM base AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Builder Image ---
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run db:push
RUN npm run db:generate
RUN npm run build

# --- Prod Runner ---
FROM base AS web
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --chown=nextjs:nodejs ./prisma ./prisma

RUN npm prune --production

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost

CMD ["npm", "start"]

# --- Worker Image ---
FROM builder as worker
WORKDIR /app
COPY . .

CMD ["npm", "run", "dev:worker"]