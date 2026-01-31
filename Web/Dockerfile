# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Build args vanuit docker-compose
ARG VITE_BACKEND_URL
ARG VITE_DEFAULT_IMAGE_URL

# Zet args om naar env vars (Vite leest ENV tijdens build)
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_DEFAULT_IMAGE_URL=${VITE_DEFAULT_IMAGE_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Verwijder default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Kopieer eigen nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopieer build output
COPY --from=build /app/dist /usr/share/nginx/html

# Expose poort 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]