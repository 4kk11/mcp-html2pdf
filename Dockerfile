FROM node:22.12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN --mount=type=cache,target=/root/.npm \
    npm ci && \
    npm run build

FROM node:22-alpine AS release

WORKDIR /app
USER root

RUN apk update && \
    apk add --no-cache \
    chromium \
    font-noto-cjk \
    font-noto-emoji \ 
    fontconfig

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

ENV NODE_ENV=production

RUN npm ci --ignore-scripts --omit=dev

ENTRYPOINT ["node", "build/index.js"]