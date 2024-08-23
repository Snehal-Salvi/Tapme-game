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

  // Error handling if no Telegram ID is found
  if (!telegramId) {
    return <div>Error: No Telegram ID provided. Please access the app through the Telegram bot.</div>;
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <CoinCounter telegramId={telegramId} />
      </div>
    </ApolloProvider>
  );
};

export default App;
