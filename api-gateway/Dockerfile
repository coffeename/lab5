#build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY . .
RUN npm run build

#run
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/gateway.js"]
