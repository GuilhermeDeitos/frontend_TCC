# Estágio de Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio de Produção (Nginx)
FROM nginx:alpine
# Copiar o build do estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar configuração customizada do Nginx (criaremos abaixo)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]