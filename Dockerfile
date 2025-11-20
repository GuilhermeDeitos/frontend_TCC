# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Remover config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar nossa config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]