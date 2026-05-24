# SIGAP UB — Dockerfile multi-stage untuk frontend React + Vite
# Stage 1: build artefak statis dengan Node 20
# Stage 2: sajikan dist/ menggunakan nginx ringan

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Salin manifest dependency terlebih dulu agar layer cache tetap efisien
COPY package.json package-lock.json ./
RUN npm ci

# Salin sumber dan aset, kemudian bangun bundle produksi
COPY index.html ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src

RUN npm run build

# ---------- Stage 2: Server statis ----------
FROM nginx:alpine AS server

# Salin konfigurasi SPA agar refresh route React tidak mengembalikan 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin artefak hasil build ke direktori root nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
