# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

ARG VITE_GRAPHQL_URI
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

