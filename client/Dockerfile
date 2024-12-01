FROM node:18-alpine

WORKDIR /app

# Clear npm cache first
RUN npm cache clean --force

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_DOCKER_ENV=true

# Change to Vite's default port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]