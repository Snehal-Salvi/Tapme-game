// src/components/CoinCounter.tsx

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";

const GET_USER = gql`
  query GetUser($telegramId: ID!) {
    getUser(telegramId: $telegramId) {
      id
      coins
    }
  }
`;

const UPDATE_COINS = gql`
  mutation UpdateCoins($telegramId: ID!, $coins: Int!) {
    updateCoins(telegramId: $telegramId, coins: $coins) {
      id
      coins
    }
  }
`;

interface CoinCounterProps {
  telegramId: string;
}

const CoinCounter: React.FC<CoinCounterProps> = ({ telegramId }) => {
  const [coins, setCoins] = useState<number>(0);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { telegramId },
  });

  const [updateCoins] = useMutation(UPDATE_COINS);

  useEffect(() => {
    if (data && data.getUser) {
      setCoins(data.getUser.coins);
    }
  }, [data]);

  const handleCoinUpdate = async (newCoins: number) => {
    console.log("Attempting to update coins:", { telegramId, newCoins });

    try {
      const { data } = await updateCoins({ variables: { telegramId, coins: newCoins } });
      console.log("Coins updated successfully:", data);
      setCoins(newCoins);
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Coins: {coins}</h1>
      <button onClick={() => handleCoinUpdate(coins + 1)}>Increase Coins</button>
      <h2>Available Balance: 500</h2>
    </div>
  );
};

export default CoinCounter;
