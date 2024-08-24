# 🧩 TapMe

A Telegram bot that integrates with a React app and a Supabase database to track user interactions and manage a coin balance. The bot sends users a welcome message with a button to start a game, and their coin balance can be updated via the React app.

## 📚 Backend Documentation

For more information on backend setup and usage, please refer to the [Backend README](/backend/README.md).

## 🖥️ Frontend Documentation

For more information on frontend setup and usage, please refer to the [Frontend README](/frontend/README.md).

## 🕹️ Usage

1. **Open the Telegram Bot:**

   - Visit [t.me/TapMeNow_bot](https://t.me/TapMeNow_bot) on Telegram.

2. **Send the `/start` Command:**

   - Start the bot by sending the `/start` command.

3. **Click on the Coin Image:**
   - Follow the link provided by the bot to open the game in your browser.
   - Enjoy the game by interacting with the coin image to update your coin balance.

## 🔧 Backend Approach

The backend is built using Node.js and TypeScript, leveraging the `node-telegram-bot-api` library to handle Telegram bot interactions and `@supabase/supabase-js` for database operations. The bot handles user registration, game initiation, and coin updates. GraphQL is used to provide a flexible API for frontend communication with the backend, using `graphql-yoga` to handle queries and mutations.

## 🔧 Frontend Approach

The frontend is developed using React and communicates with the backend via GraphQL. The React app is responsible for rendering the game interface and handling user interactions. It fetches and updates user coin balances by interacting with the backend API, ensuring a seamless and interactive user experience. The app is designed to be responsive and user-friendly, focusing on intuitive gameplay and real-time updates.

## 👥 Authors

- [@Snehal](https://github.com/Snehal-Salvi)
