import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USER_COINS = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      coins
    }
  }
`;

const UPDATE_USER_COINS = gql`
  mutation UpdateCoins($id: ID!, $coins: Int!) {
    updateCoins(id: $id, coins: $coins) {
      id
      coins
    }
  }
`;

const CoinCounter: React.FC = () => {
  const userId = 'your_user_id'; // Replace with actual user ID from your auth system
  const { data } = useQuery(GET_USER_COINS, {
    variables: { id: userId },
  });
  const [updateCoins] = useMutation(UPDATE_USER_COINS);

  const [coins, setCoins] = useState<number>(data?.getUser.coins || 0);
  const [balance, setBalance] = useState<number>(500);

  useEffect(() => {
    if (data) {
      setCoins(data.getUser.coins);
    }
  }, [data]);

  const handleIncreaseCoins = () => {
    setCoins((prev) => {
      const newCoins = prev + 1;
      setBalance((prevBalance) => prevBalance - 1);
      updateCoins({ variables: { id: userId, coins: newCoins } });
      return newCoins;
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (balance < 500) {
      interval = setInterval(() => {
        setBalance((prevBalance) => (prevBalance < 500 ? prevBalance + 1 : 500));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [balance]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Coins: {coins}</h1>
      <button onMouseDown={handleIncreaseCoins}>Increase Coins</button>
      <h2>Available Balance: {balance}/500</h2>
    </div>
  );
};

export default CoinCounter;
