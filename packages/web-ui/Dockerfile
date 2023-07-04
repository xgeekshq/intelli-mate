# syntax=docker/dockerfile:1.5

# This Dockerfile was inspired by https://github.com/vercel/next.js/tree/canary/examples/with-docker
ARG TAG=18-alpine

# 1. Install dependencies only when needed
FROM node:$TAG AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY ./web-ui/package.json ./web-ui/package.json

RUN cd web-ui && npm install

COPY ./contract/package.json ./contract/package.json

RUN cd contract && npm install

# 2. Rebuild the source code only when needed
FROM node:$TAG AS builder
WORKDIR /app
COPY --from=deps /app/web-ui/node_modules ./web-ui/node_modules
COPY --from=deps /app/contract/node_modules ./contract/node_modules
COPY ./web-ui ./web-ui
COPY ./contract ./contract

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Comment the following line in case you want to enable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# 3. Install only production dependencies
RUN cd web-ui && npm run build

# CMD [ "sleep", "infinity" ]

FROM builder as prod-builder

RUN --mount=type=cache,id=npm,sharing=locked,target=/usr/local/share/.cache/npm \
  cd web-ui && npm install --only=production

RUN --mount=type=cache,id=npm,sharing=locked,target=/usr/local/share/.cache/npm \
  cd contract && npm install --only=production

# 4. Production image, copy all the files and run next
FROM node:$TAG AS production
WORKDIR /app

ENV NODE_ENV production

# Comment the following line in case you want to enable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user with an explicit UID and add permission to access the /app folder
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/contract ./contract
COPY --from=prod-builder --chown=nextjs:nodejs /app/contract/node_modules ./contract/node_modules

COPY --from=builder --chown=nextjs:nodejs /app/web-ui/next.config.mjs ./web-ui/
COPY --from=builder --chown=nextjs:nodejs /app/web-ui/public ./web-ui/public
COPY --from=builder --chown=nextjs:nodejs /app/web-ui/package.json ./web-ui/package.json
COPY --from=builder --chown=nextjs:nodejs /app/web-ui/.next ./web-ui/.next
COPY --from=prod-builder --chown=nextjs:nodejs /app/web-ui/node_modules ./web-ui/node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

WORKDIR /app/web-ui

CMD ["npm", "run", "start"]
