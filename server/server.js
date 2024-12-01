import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { authMiddleware } from "./utils/auth.js";
import { typeDefs, resolvers } from "./schemas/index.js";
import connectDB, { config } from './config/connection.js';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = config.server.port;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.get('/health', (_, res) => res.status(200).send('OK'));

const startApolloServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("MongoDB connection established.");

    await server.start();
    console.log("Apollo Server started successfully.");

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          process.env.CLIENT_URL
        ].filter(Boolean),
        credentials: true,
      })
    );

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: authMiddleware,
      })
    );

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Error starting Apollo Server:", error);
    process.exit(1);
  }
};

startApolloServer();
