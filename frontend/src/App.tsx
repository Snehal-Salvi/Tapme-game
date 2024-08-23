import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import CoinCounter from "./components/CoinCounter";

const App: React.FC = () => {
  // Initialize Apollo Client
  const client = new ApolloClient({
    uri: "http://localhost:4000", // Your GraphQL server URL
    cache: new InMemoryCache(),
  });

  // Extract the Telegram ID from the URL
  const query = new URLSearchParams(window.location.search);
  const telegramId = query.get("telegramId");

  if (!telegramId) {
    return <div>Error: No Telegram ID provided</div>;
  }

  return (
    <ApolloProvider client={client}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to the Coin Counter Game</h1>
        <CoinCounter telegramId={telegramId} />
      </div>
    </ApolloProvider>
  );
};

export default App;
