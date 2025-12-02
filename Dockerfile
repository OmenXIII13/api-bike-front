FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx vite build

FROM nginx:alpine

# Копируем собранный фронтенд
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем nginx конфиг
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Даем права (по желанию)
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

