import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
