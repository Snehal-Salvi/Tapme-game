import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import CoinCounter from "./components/CoinCounter";

// Main App component
const App: React.FC = () => {
  // Extract query parameters from the URL
  const query = new URLSearchParams(window.location.search);
  // Get the Telegram ID from the query parameters
  const telegramId = query.get("telegramId");

  // Check if the Telegram ID is provided in the URL
  if (!telegramId) {
    // If not, display an error message
    return <div>Error: No Telegram ID provided</div>;
  }

  // Render the ApolloProvider and CoinCounter component
  return (
    <ApolloProvider client={client}>
      <div>
        {/* Pass the Telegram ID as a prop to the CoinCounter component */}
        <CoinCounter telegramId={telegramId} />
      </div>
    </ApolloProvider>
  );
};

export default App;
