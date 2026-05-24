# SIGAP UB — Dockerfile backend (Express API)
FROM node:20-alpine

WORKDIR /app

# Layer cache untuk dependency
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Salin sumber aplikasi
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "src/app.js"]
