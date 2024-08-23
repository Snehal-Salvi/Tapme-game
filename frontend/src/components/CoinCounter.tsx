// src/components/CoinCounter.tsx

import React, { useState, useEffect, useRef } from "react";
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
  const [availableBalance, setAvailableBalance] = useState<number>(500);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { telegramId },
  });

  const [updateCoins] = useMutation(UPDATE_COINS);

  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data && data.getUser) {
      setCoins(data.getUser.coins);
    }
  }, [data]);

  const handleCoinUpdate = async (newCoins: number) => {
    if (availableBalance <= 0) {
      console.log("No available balance left to use.");
      return;
    }

    console.log("Attempting to update coins:", { telegramId, newCoins });

    try {
      const { data } = await updateCoins({ variables: { telegramId, coins: newCoins } });
      console.log("Coins updated successfully:", data);
      setCoins(newCoins);
      setAvailableBalance((prevBalance) => prevBalance - 1);
      setIsUpdating(true);

      // Reset click timer
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }

      clickTimer.current = setTimeout(() => {
        setIsUpdating(false);
        replenishBalance();
      }, 1000); // Delay to replenish after clicking stops

    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  const replenishBalance = () => {
    if (availableBalance >= 500) return;

    // Increase available balance gradually
    const replenishInterval = setInterval(() => {
      setAvailableBalance((prevBalance) => {
        if (prevBalance >= 500) {
          clearInterval(replenishInterval);
          return 500;
        }
        return prevBalance + 1;
      });
    }, 100); // Adjust interval and increment as needed
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
      <h2>Available Balance: {availableBalance}/500</h2>
    </div>
  );
};

export default CoinCounter;
