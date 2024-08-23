// src/bot.ts

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN!;
const appUrl = process.env.REACT_APP_URL!;
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseApiKey = process.env.SUPABASE_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseApiKey);

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const { id: telegramId, username, first_name: firstName, last_name: lastName } = msg.from!;

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (fetchError) {
    console.error('Error fetching user:', fetchError.message);
  }

  if (!existingUser) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          telegram_id: telegramId.toString(),
          username: username || null,
          first_name: firstName || null,
          last_name: lastName || null,
        },
      ]);

    if (error) {
      console.error('Error inserting user:', error.message);
    } else {
      console.log('User registered:', data);
    }
  } else {
    console.log('User already registered:', existingUser);
  }

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Start Game',
            url: appUrl,
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, 'Welcome to the Coin Counter game! Click the button below to start:', opts);
});
