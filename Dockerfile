# Step 1: Build Angular app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Step 2: Run browser build output using nginx
FROM nginx:alpine

# Remove nginx default page and copy Angular browser output.
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/keycloak_client_frontend/browser/ /usr/share/nginx/html/

# Angular SSR browser output uses index.csr.html; nginx expects index.html.
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; fi

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]