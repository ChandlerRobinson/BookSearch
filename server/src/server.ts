import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Apply Apollo middleware
async function startApolloServer() {
  await server.start();
  app.use('/graphql', cors(), json(), expressMiddleware(server));

  // Static files for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Existing RESTful routes
  app.use(routes);

  // Start the server once DB is connected
  db.once('open', () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql`)
    );
  });
}

startApolloServer();
