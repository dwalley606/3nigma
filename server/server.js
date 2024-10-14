// server/server.js
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "./utils/auth.js";
import { typeDefs, resolvers } from "./schemas/index.js";
import connectDB from "./config/connection.js"; // Import the connectDB function

import dotenv from "dotenv";
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Ensure introspection is explicitly enabled
  playground: true, // Enable GraphQL Playground if needed
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB(); // Connect to the database
    console.log("MongoDB connection established.");

    await server.start();
    console.log("Apollo Server started successfully.");

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Serve up static assets
    app.use(
      "/images",
      express.static(path.join(__dirname, "../client/images"))
    );

    // Ensure the middleware is correctly set up
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: authMiddleware, // Comment out this line to disable authMiddleware
      })
    );

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Error starting Apollo Server:", error);
  }
};

// Call the async function to start the server
startApolloServer();
