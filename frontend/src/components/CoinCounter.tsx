import React, { useState, useEffect, useRef } from "react";
import styles from "./CoinCounter.module.css";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { GiTwoCoins } from "react-icons/gi";
import { BsCoin } from "react-icons/bs";
import { SlEnergy } from "react-icons/sl";
import coinImage from "../assets/3dCoin.png";

// GraphQL query to fetch the user's coin balance using their Telegram ID
// This query will retrieve the user data (ID and coin balance) from the backend.
const GET_USER = gql`
  query GetUser($telegramId: ID!) {
    getUser(telegramId: $telegramId) {
      id
      coins
    }
  }
`;

// GraphQL mutation to update the user's coin balance
// This mutation will be used to update the user's coin balance on the server.
const UPDATE_COINS = gql`
  mutation UpdateCoins($telegramId: ID!, $coins: Int!) {
    updateCoins(telegramId: $telegramId, coins: $coins) {
      id
      coins
    }
  }
`;

// TypeScript interface for the component props
// This interface defines the type of props the CoinCounter component expects, specifically a telegramId string.
interface CoinCounterProps {
  telegramId: string;
}

// Main CoinCounter component
// This component handles the user's coin balance, allowing them to increment their coins and manage their available balance.
const CoinCounter: React.FC<CoinCounterProps> = ({ telegramId }) => {
  // State to hold the user's current coin balance
  // The coins state is initialized to 0 and will be updated with the value fetched from the server.
  const [coins, setCoins] = useState<number>(0);

  // State to hold the user's available balance (for clicks)
  // The availableBalance state is also initialized to 0 and is used to track how many clicks the user has left.
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // GraphQL query to fetch user data based on the telegramId prop
  // The useQuery hook is used to fetch the user's data (coin balance) from the server.
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { telegramId },
  });

  // GraphQL mutation to update user coin balance
  // The useMutation hook is used to define the mutation that will update the user's coin balance.
  const [updateCoins] = useMutation(UPDATE_COINS);

  // Ref to manage click timer for replenishing balance
  // clickTimer is a ref that will hold a timeout ID, allowing us to clear and reset the timer as needed.
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Effect to initialize the available balance and user coins when the component mounts or data changes
  // This useEffect hook runs when the component mounts or when the data changes. It initializes the available balance from localStorage and sets the coin balance from the server.
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
  // This useEffect hook saves the available balance to localStorage every time it changes, ensuring it persists across page reloads.
  useEffect(() => {
    localStorage.setItem("availableBalance", availableBalance.toString());
  }, [availableBalance]);

  // Function to handle updating the coin balance
  // This function is called when the user clicks the button to increment their coin balance. It updates the balance on the server and manages the available balance.
  const handleCoinUpdate = async (newCoins: number) => {
    // Check if there is sufficient available balance to perform the update
    // If the available balance is 0 or less, the function exits early, preventing the update.
    if (availableBalance <= 0) {
      console.log("No available balance left to use.");
      return;
    }

    console.log("Attempting to update coins:", { telegramId, newCoins });

    try {
      // Perform the mutation to update the user's coin balance
      // The updateCoins mutation is called with the new coin value.
      const { data } = await updateCoins({
        variables: { telegramId, coins: newCoins },
      });
      console.log("Coins updated successfully:", data);

      // Update state with the new coin balance and decrement available balance
      // The state is updated with the new coin value, and the available balance is decreased by 1.
      setCoins(newCoins);
      setAvailableBalance((prevBalance) => prevBalance - 1);

      // Clear any existing click timer and set a new one to replenish balance
      // If a clickTimer already exists, it's cleared. A new timer is set to replenish the available balance after 1 second.
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }

      // Set a timer to replenish the available balance after 1 second
      clickTimer.current = setTimeout(() => {
        replenishBalance();
      }, 1000);
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  // Function to gradually replenish the available balance
  // This function replenishes the available balance over time, increasing it by 1 every second until it reaches the maximum value of 500.
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
  // If the data is still loading or there’s an error fetching the data, the component displays appropriate messages.
  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

  // Render the component
  // The component renders the user's coin balance, a button to increment it, and the available balance.
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
