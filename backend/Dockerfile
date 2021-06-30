# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only-prod

# Rebuild the source code only when needed
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S server -u 1001

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER server

EXPOSE 4000

COPY *.ts *.json ./
CMD ["npm", "start"]
