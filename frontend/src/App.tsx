import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient"; 
import CoinCounter from "./components/CoinCounter";

const App: React.FC = () => {
  const query = new URLSearchParams(window.location.search);
  const telegramId = query.get("telegramId");

  if (!telegramId) {
    return <div>Error: No Telegram ID provided</div>;
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
