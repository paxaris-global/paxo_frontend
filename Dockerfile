# Step 1: Build Angular app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Step 2: Run browser build output using nginx
FROM nginx:alpine

COPY --from=build /app/dist/keycloak_client_frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]