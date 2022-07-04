#stage 1
FROM node:latest AS EshopBuild
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build 
#stage 2
FROM nginx:alpine
COPY --from=EshopBuild /app/dist/APM /usr/share/nginx/html
EXPOSE 4444