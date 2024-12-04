FROM node:18-alpine

WORKDIR /app

ARG VITE_GRAPHQL_URI
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

