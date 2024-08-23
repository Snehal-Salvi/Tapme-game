// src/App.tsx

import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import CoinCounter from "./components/CoinCounter";

const App: React.FC = () => {
  // Initialize Apollo Client
  const client = new ApolloClient({
    uri: "http://localhost:4000", // Your GraphQL server URL
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to the Coin Counter Game</h1>
        <CoinCounter />
      </div>
    </ApolloProvider>
  );
};

export default App;
