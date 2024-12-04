FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "serve"]

ARG VITE_GRAPHQL_URI
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI