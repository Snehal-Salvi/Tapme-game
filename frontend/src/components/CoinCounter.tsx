import React, { useState, useEffect, useRef } from "react";
import styles from "./CoinCounter.module.css";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { GiTwoCoins } from "react-icons/gi";
import { BsCoin } from "react-icons/bs";
import { SlEnergy } from "react-icons/sl";
import coinImage from "../assets/3dCoin.png";

// GraphQL query to fetch the user's coin balance
const GET_USER = gql`
  query GetUser($telegramId: ID!) {
    getUser(telegramId: $telegramId) {
      id
      coins
    }
  }
`;

// GraphQL mutation to update the user's coin balance
const UPDATE_COINS = gql`
  mutation UpdateCoins($telegramId: ID!, $coins: Int!) {
    updateCoins(telegramId: $telegramId, coins: $coins) {
      id
      coins
    }
  }
`;

// TypeScript interface for the component props
interface CoinCounterProps {
  telegramId: string;
}

// Main CoinCounter component
const CoinCounter: React.FC<CoinCounterProps> = ({ telegramId }) => {
  // State to hold the user's current coin balance
  const [coins, setCoins] = useState<number>(0);
  // State to hold the user's available balance (for clicks)
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // GraphQL query to fetch user data based on the telegramId prop
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { telegramId },
  });

  // GraphQL mutation to update user coin balance
  const [updateCoins] = useMutation(UPDATE_COINS);

  // Ref to manage click timer for replenishing balance
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Effect to initialize the available balance and user coins when the component mounts or data changes
  useEffect(() => {
    // Retrieve stored balance from local storage
    const storedBalance = localStorage.getItem("availableBalance");
    if (storedBalance) {
      setAvailableBalance(parseInt(storedBalance, 10));
    } else {
      // Default balance if none is stored
      setAvailableBalance(500);
    }

    // Update state with user coins fetched from the server
    if (data && data.getUser) {
      setCoins(data.getUser.coins);
    }
  }, [data]);

  // Effect to save available balance to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("availableBalance", availableBalance.toString());
  }, [availableBalance]);

  // Function to handle updating the coin balance
  const handleCoinUpdate = async (newCoins: number) => {
    // Check if there is sufficient available balance to perform the update
    if (availableBalance <= 0) {
      console.log("No available balance left to use.");
      return;
    }

    console.log("Attempting to update coins:", { telegramId, newCoins });

    try {
      // Perform the mutation to update the user's coin balance
      const { data } = await updateCoins({
        variables: { telegramId, coins: newCoins },
      });
      console.log("Coins updated successfully:", data);

      // Update state with the new coin balance and decrement available balance
      setCoins(newCoins);
      setAvailableBalance((prevBalance) => prevBalance - 1);

      // Clear any existing click timer and set a new one to replenish balance
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }

      clickTimer.current = setTimeout(() => {
        replenishBalance();
      }, 1000);
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  // Function to gradually replenish the available balance
  const replenishBalance = () => {
    // Do nothing if the available balance is already at the maximum value
    if (availableBalance >= 500) return;

    // Increment available balance every second until it reaches the maximum
    const replenishInterval = setInterval(() => {
      setAvailableBalance((prevBalance) => {
        if (prevBalance >= 500) {
          clearInterval(replenishInterval);
          return 500;
        }
        return prevBalance + 1;
      });
    }, 1000);
  };

  // Display loading or error messages if applicable
  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

  // Render the component
  return (
    <div className={styles.container}>
      <h1>
        <GiTwoCoins className={styles.coinIcon} /> TapMe !!{" "}
        <GiTwoCoins className={styles.coinIcon} />
      </h1>
      <h2>
        <BsCoin className={styles.coinIcon} /> {coins}
      </h2>
      <button
        onClick={() => handleCoinUpdate(coins + 1)}
        className={styles.buttonClick}
      >
        <img src={coinImage} alt="click-me" />
      </button>

      <h2>
        <SlEnergy className={styles.coinIcon} /> {availableBalance}/500
      </h2>
    </div>
  );
};

export default CoinCounter;
