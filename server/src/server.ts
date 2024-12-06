import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';

// Define the context type to match Apollo Server expectations
type ApolloContext = {
  req: express.Request;
};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create Apollo Server
const server = new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  try {
    await server.start();

    app.use(
      '/graphql',
      cors(),
      expressMiddleware(server, {
        context: async ({ req }: { req: express.Request }): Promise<ApolloContext> => {
          return { req };
        },
      })
    );

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    app.use(routes);

    db.once('open', () => {
      app.listen(PORT, () =>
        console.log(
          `🌍 Now listening on localhost:${PORT}\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql`
        )
      );
    });

    db.on('error', (err) => {
      console.error('Database connection error:', err);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
}

startApolloServer();








