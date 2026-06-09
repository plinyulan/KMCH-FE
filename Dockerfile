# Stage 1 — build the Vite bundle
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — nginx with embedded certbot (auto-issues + renews Let's Encrypt)
FROM jonasal/nginx-certbot:5
# Put the config under templates/ so the image runs envsubst on it at startup,
# expanding ${FQDN} into the real hostname before certbot reads it.
# Output lands at /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
