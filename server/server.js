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

// app.get('/health', (_, res) => res.status(200).send('OK'));

const startApolloServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("MongoDB connection established.");

    await server.start();
    console.log("Apollo Server started successfully.");

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // First, define allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'https://threenigma-frontend.onrender.com'
    ];

    // Pre-flight CORS handler
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        // Handle preflight
        if (req.method === 'OPTIONS') {
          return res.status(204).send();
        }
      }
      next();
    });

    // Main CORS middleware
    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }));

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
