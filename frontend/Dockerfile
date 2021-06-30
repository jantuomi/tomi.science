# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only-prod

# Rebuild the source code only when needed
FROM node:alpine AS builder

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ARG NEXT_PUBLIC_BACKEND_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN printenv > .env.local
RUN npm run build && npm run export

# Production image, copy all the files and run next
FROM sebp/lighttpd:latest AS runner

WORKDIR /var/www/localhost/htdocs

COPY --from=builder /app/out ./
