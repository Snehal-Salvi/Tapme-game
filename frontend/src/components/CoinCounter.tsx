import React, { useState, useEffect } from "react";

const CoinCounter: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [balance, setBalance] = useState<number>(500);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const [decrementInterval, setDecrementInterval] =
    useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    if (balance > 0 && !decrementInterval) {
      const intervalId = setInterval(() => {
        setCoins((prevCoins) => prevCoins + 1);
        setBalance((prevBalance) => prevBalance - 1);
      }, 50); // Adjust the interval speed as needed
      setDecrementInterval(intervalId);
    }

    // Clear any existing reset timer
    if (resetTimer) {
      clearTimeout(resetTimer);
      setResetTimer(null);
    }
  };

  const handleMouseUp = () => {
    if (decrementInterval) {
      clearInterval(decrementInterval);
      setDecrementInterval(null);
    }

    // Start reset timer
    const timerId = setTimeout(() => {
      setIsResetting(true);
    }, 1000); // 1 second delay before starting to reset balance

    setResetTimer(timerId);
  };

  useEffect(() => {
    let incrementInterval: NodeJS.Timeout;

    if (isResetting) {
      incrementInterval = setInterval(() => {
        setBalance((prevBalance) => {
          if (prevBalance < 500) {
            return prevBalance + 1;
          } else {
            clearInterval(incrementInterval);
            setIsResetting(false);
            return 500;
          }
        });
      }, 1000); // Adjust the interval speed to make the effect visible (e.g., every 50ms)
    }

    return () => {
      if (incrementInterval) clearInterval(incrementInterval);
    };
  }, [isResetting]);

  useEffect(() => {
    return () => {
      if (resetTimer) clearTimeout(resetTimer);
      if (decrementInterval) clearInterval(decrementInterval);
    };
  }, [resetTimer, decrementInterval]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Coins: {coins}</h1>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Handle case when mouse leaves the button
      >
        Increase Coins
      </button>
      <h2>Available Balance: {balance}/500</h2>
    </div>
  );
};

export default CoinCounter;
