import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import express, { Express, Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware, ExpressContextFunctionArgument } from "@apollo/server/express4";
import { authMiddleware } from "./utils/auth.js";
import { typeDefs, resolvers } from "./schemas/index.js";
import connectDB, { config } from './config/connection.js';
import cors from "cors";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const PORT: number = config.server.port;
const app: Express = express();
const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a context function type
interface ApolloContext {
  token?: string;
  user?: any; // We'll define a proper User type later
}

const startApolloServer = async (): Promise<void> => {
  await server.start();

  // Apply middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());

  // Apply Apollo middleware with context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: ExpressContextFunctionArgument): Promise<ApolloContext> => {
        // Get the token from the auth middleware
        const contextValue = await authMiddleware({ req });
        return contextValue;
      },
    })
  );

  // Connect to database
  await connectDB();

  // Health check endpoint
  app.get('/health', (_: Request, res: Response) => res.status(200).send('OK'));

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;