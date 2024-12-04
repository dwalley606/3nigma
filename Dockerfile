# Use a Node.js base image
FROM node:18-alpine

WORKDIR /app

# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy server and client package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server and client dependencies
RUN npm install --prefix server
RUN npm install --prefix client

# Copy the rest of the application code
COPY . .

# Build the client
RUN npm run build --prefix client

# Expose the port the app runs on
EXPOSE 3001

# Start the server
CMD ["node", "server/server.js"]