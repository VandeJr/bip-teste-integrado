FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@latest-10 && pnpm install

COPY . .

RUN pnpm run build --configuration production

FROM nginx:1.27-alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
