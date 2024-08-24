import { ApolloClient, InMemoryCache } from "@apollo/client";

// Create an instance of ApolloClient
const client = new ApolloClient({
  // URI of the GraphQL server endpoint
  uri: process.env.REACT_APP_GRAPHQL_URI, 
  cache: new InMemoryCache(),
});

// Export the client instance for use in the application
export default client;
