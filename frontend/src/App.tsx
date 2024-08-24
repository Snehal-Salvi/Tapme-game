import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import CoinCounter from "./components/CoinCounter";

const App: React.FC = () => {

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI, 
    cache: new InMemoryCache(),
  });


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
