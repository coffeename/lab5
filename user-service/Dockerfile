# Stage 1 — сборка
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Копируем весь код, включая src/scripts
COPY . .

# Компилируем TS
RUN npm run build

# Stage 2 — финальный
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

# Копируем собранный код
COPY --from=builder /usr/src/app/dist ./dist

# Копируем все исходники из src, чтобы seed-admin.ts мог найти data-source.ts и users/**
COPY --from=builder /usr/src/app/src ./src

EXPOSE 3000
CMD ["npm", "run", "start"]