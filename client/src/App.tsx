import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Apollo Client setup
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // GraphQL server URL
  cache: new InMemoryCache(), // Cache to store fetched data
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;

