import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import { resolvers } from './graphql/resolvers';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
// This loads sensitive information like Supabase credentials from the environment variables.
dotenv.config();

// Read the GraphQL schema definition from the specified file
// The schema defines the structure of the GraphQL API, including queries and mutations.
const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf-8');

// Initialize Supabase client with URL and API key from environment variables
// Supabase is used as the backend database for the GraphQL server.
const supabase = createClient(
  process.env.SUPABASE_URL!, // Supabase URL
  process.env.SUPABASE_API_KEY! // Supabase API key
);

// Create an instance of ApolloServer with the specified type definitions and resolvers
// ApolloServer is used to create a GraphQL server that handles requests and returns responses.
const server = new ApolloServer({
  typeDefs, // GraphQL schema definitions
  resolvers: resolvers(supabase), // Function that returns resolvers, passing Supabase client
});

// Start the Apollo Server and listen for incoming requests
// The server starts and listens on a specific URL, logging the URL to the console.
server.listen().then(({ url }) => {
  // Log the URL where the server is running
  console.log(`Server ready at ${url}`);
});
