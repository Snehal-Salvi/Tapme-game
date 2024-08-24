import React, { useState, useEffect, useRef } from "react";
import styles from "./CoinCounter.module.css";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { GiTwoCoins } from "react-icons/gi";
import { BsCoin } from "react-icons/bs";
import { SlEnergy } from "react-icons/sl";
import coinImage from "../assets/3dCoin.png";

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
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { telegramId },
  });

  const [updateCoins] = useMutation(UPDATE_COINS);

  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedBalance = localStorage.getItem("availableBalance");
    if (storedBalance) {
      setAvailableBalance(parseInt(storedBalance, 10));
    } else {
      setAvailableBalance(500);
    }

    if (data && data.getUser) {
      setCoins(data.getUser.coins);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("availableBalance", availableBalance.toString());
  }, [availableBalance]);

  const handleCoinUpdate = async (newCoins: number) => {
    if (availableBalance <= 0) {
      console.log("No available balance left to use.");
      return;
    }

    console.log("Attempting to update coins:", { telegramId, newCoins });

    try {
      const { data } = await updateCoins({
        variables: { telegramId, coins: newCoins },
      });
      console.log("Coins updated successfully:", data);
      setCoins(newCoins);
      setAvailableBalance((prevBalance) => prevBalance - 1);

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

  const replenishBalance = () => {
    if (availableBalance >= 500) return;

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

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

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
