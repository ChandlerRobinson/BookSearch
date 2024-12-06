import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Apply Apollo middleware with context
async function startApolloServer() {
  await server.start();

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { req };
      },
    })
  );

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // RESTful routes
  app.use(routes);

  // Connect to DB and start the server
  db.once('open', () => {
    app.listen(PORT, () =>
      console.log(
        `🌍 Now listening on localhost:${PORT}\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql`
      )
    );
  });
}

startApolloServer();


