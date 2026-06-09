# Stage 1 — build the Vite bundle
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — nginx with embedded certbot (auto-issues + renews Let's Encrypt)
FROM jonasal/nginx-certbot:5
# user_conf.d files are picked up at startup; cert files are filled in by certbot
COPY nginx.conf /etc/nginx/user_conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
