# 🧩 TapMe Backend

This repository contains the backend code for the TapMe project. It consists of a Telegram bot that integrates with a React app and a Supabase database to track user interactions and manage a coin balance. The bot sends users a welcome message with a button to start a game, and their coin balance can be updated via the React app.

## 🛠️ Technologies Used

- **Node.js:** JavaScript runtime for building the bot.
- **GraphQL:** API query language for flexible data retrieval and manipulation.
- **Supabase:** Open-source backend-as-a-service for database management.
- **Telegram Bot API:** Provides the interface for interacting with Telegram users.

## 🛠️ Installation

To run this project locally, follow these steps:

1. Clone the repository.
2. Navigate to the project directory:

```
cd backend
```

3. Install the necessary dependencies:

```
npm install
```

4. Set up environment variables.

```
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
REACT_APP_URL=https://your-react-app-url.com
SUPABASE_URL=https://your-supabase-project-url.supabase.co
SUPABASE_API_KEY=your-supabase-api-key

```

5. Run the project.

```
npm start
```

## 📖 Approach

### Backend Architecture

- **Bot Initialization:** Uses `node-telegram-bot-api` to handle Telegram bot interactions.
- **Database Integration:** Connects to Supabase for user data management and coin balance updates.
- **GraphQL API:** Utilizes `graphql-yoga` to create a GraphQL server that handles queries and mutations related to user data.

### Bot Functionality

- **/start Command:** Registers new users in the Supabase database if they are not already registered and sends a welcome message with a button to start the game.
- **User Registration:** Checks if the user exists in the database; if not, creates a new user record.
- **Game Interaction:** Provides a URL to the React app where users can interact with the game and update their coin balance.

## 👩‍💻 Authors

- [@Snehal](https://github.com/Snehal-Salvi)
