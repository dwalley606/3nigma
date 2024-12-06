import request from 'supertest';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from '../src/schemas/index.js';

describe('Server', () => {
  let app: express.Express;
  let server: ApolloServer;

  beforeAll(async () => {
    // Create test server
    app = express();
    server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();

    // Apply middleware
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
    
    // Add health check endpoint
    app.get('/health', (_, res) => res.status(200).send('OK'));
  });

  afterAll(async () => {
    await server.stop();
  });

  test('health check endpoint returns OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  test('GraphQL endpoint is accessible', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ __typename }'
      });
    
    expect(response.status).toBe(200);
  });
}); 