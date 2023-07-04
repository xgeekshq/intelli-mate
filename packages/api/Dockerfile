ARG TAG=18-alpine

FROM node:$TAG AS deps

RUN apk --update add \
  openssl

# Create app directory
WORKDIR /app

COPY ./api/package.json ./api/package.json

RUN cd api && npm install

# 2. Rebuild the source code only when needed
FROM node:$TAG AS builder
WORKDIR /app
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY ./contract ./contract
COPY ./api ./api

# 3. Install only production dependencies
RUN cd api && npm run build

FROM builder as prod-builder

RUN --mount=type=cache,id=npm,sharing=locked,target=/usr/local/share/.cache/npm \
  cd api && npm install --only=production

RUN --mount=type=cache,id=npm,sharing=locked,target=/usr/local/share/.cache/npm \
  cd contract && npm install --only=production


FROM node:$TAG AS production

# Set NODE_ENV environment variable
ENV NODE_ENV production
# Create app directory
WORKDIR /app
# Create a non-root user with an explicit UID and add permission to access the /app folder
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN chown -R nestjs:nodejs /app
RUN chmod 755 /app

COPY --chown=nestjs:nodejs --from=builder /app/api/dist/api ./api
COPY --chown=nestjs:nodejs --from=builder /app/api/dist/contract ./contract
COPY --chown=nestjs:nodejs --from=builder /app/api/dist/tsconfig.build.tsbuildinfo ./tsconfig.build.tsbuildinfo

COPY --chown=nestjs:nodejs --from=builder /app/api/package.json ./api/package.json
COPY --chown=nestjs:nodejs --from=builder /app/contract/package.json ./contract/package.json
COPY --chown=nestjs:nodejs --from=prod-builder /app/api/node_modules ./api/node_modules
COPY --chown=nestjs:nodejs --from=prod-builder /app/contract/node_modules ./contract/node_modules

# Run as User
USER nestjs

# Start the server using the production build
CMD ["node", "api/src/main" ]
