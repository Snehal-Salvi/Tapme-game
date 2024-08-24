import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file to access sensitive information
dotenv.config();

// Retrieve the bot token, app URL, Supabase URL, and API key from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN!;
const appUrl = process.env.REACT_APP_URL!;
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseApiKey = process.env.SUPABASE_API_KEY!;

// Initialize the Supabase client with the URL and API key
const supabase = createClient(supabaseUrl, supabaseApiKey);

// Create a new Telegram bot instance with the provided token and enable polling to receive messages
const bot = new TelegramBot(token, { polling: true });

// Define a handler for the /start command sent by users
bot.onText(/\/start/, async (msg) => {
  // Extract the chat ID and user information from the received message
  const chatId = msg.chat.id;
  const { id: telegramId, username, first_name: firstName, last_name: lastName } = msg.from!;

  try {
    // Query the Supabase database to check if the user is already registered
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users') // Specify the 'users' table
      .select('*') // Select all columns
      .eq('telegram_id', telegramId.toString()); // Filter by the Telegram user ID

    // Handle any errors that occur while fetching user data
    if (fetchError) {
      console.error('Error fetching user:', fetchError.message);
      return; // Exit the function if there is an error
    }

    // Check if the user is already in the database
    if (existingUsers.length === 0) {
      // If no existing user is found, insert a new record into the 'users' table
      const { data, error } = await supabase
        .from('users') // Specify the 'users' table
        .insert([ // Insert a new record
          {
            telegram_id: telegramId.toString(), // User's Telegram ID
            username: username || null, // User's Telegram username (if available)
            first_name: firstName || null, // User's first name (if available)
            last_name: lastName || null, // User's last name (if available)
          },
        ])
        .select(); // Return the inserted record

      // Handle any errors that occur while inserting user data
      if (error) {
        console.error('Error inserting user:', error.message);
      } else {
        console.log('User registered successfully', data);
      }
    } else {
      // If the user is already registered, log their information
      console.log('User already registered:', existingUsers[0]);
    }

    // Define options for the message, including an inline button that starts the game
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Start Game', // Text displayed on the button
              url: `${appUrl}?telegramId=${telegramId}`, // URL to open the game with the Telegram ID as a query parameter
            },
          ],
        ],
      },
    };

    // Send a welcome message to the user with the inline button
    bot.sendMessage(chatId, 'Welcome to the Coin Counter game! Click the button below to start:', opts);
  } catch (error) {
    // Handle any errors that occur during the processing of the /start command
    if (error instanceof Error) {
      console.error('Error handling /start command:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
});

// Log a message to indicate that the bot server is up and running
console.log('Bot server is up and running');
