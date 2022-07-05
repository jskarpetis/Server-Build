
# Stage 1 build
FROM node:14.15.5-alpine AS build

WORKDIR /usr/eshop
COPY package.json package-lock.json ./
RUN npm install 
COPY . . 
RUN npm run build


# Stage 2 run
FROM nginx:1.17.1-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/eshop/dist/APM /usr/share/nginx/html



