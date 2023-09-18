# ---------- Base ----------
FROM node:18.17.1 as base
WORKDIR /app

# ---------- Builder ----------
FROM base AS builder
COPY package.json yarn.lock ./
RUN yarn --ignore-optional
COPY ./ ./
RUN yarn build

# ---------- Release ----------
FROM base AS release
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./src
COPY --from=builder /app/src/services/keys ./src/services/keys
USER node
CMD ["node", "./src/index.js"]
