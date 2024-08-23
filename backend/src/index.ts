import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import { resolvers } from './graphql/resolvers';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf-8');

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers(supabase),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
