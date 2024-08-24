// Define and export resolvers for the GraphQL server
export const resolvers = (supabase: any) => ({
  Query: {
    // Resolver for the 'getUser' query
    getUser: async (_: any, { telegramId }: { telegramId: string }) => {
      // Query the Supabase 'users' table to get a user by their Telegram ID
      const { data, error } = await supabase
        .from('users') // Specify the 'users' table
        .select('*') // Select all columns
        .eq('telegram_id', telegramId) // Filter by the provided Telegram ID
        .single(); // Retrieve a single record

      // Handle any errors that occur during the query
      if (error) {
        throw new Error(error.message); // Throw an error with the message from Supabase
      }

      // Return the user data if the query is successful
      return data;
    },
  },
  Mutation: {
    // Resolver for the 'updateCoins' mutation
    updateCoins: async (
      _: any,
      { telegramId, coins }: { telegramId: string; coins: number }
    ) => {
      // Update the 'coins' column for a user with the specified Telegram ID
      const { data, error } = await supabase
        .from('users') // Specify the 'users' table
        .update({ coins }) // Set the 'coins' column to the new value
        .eq('telegram_id', telegramId) // Filter by the provided Telegram ID
        .single(); // Update a single record

      // Handle any errors that occur during the update
      if (error) {
        throw new Error(error.message); // Throw an error with the message from Supabase
      }

      // Return the updated user data if the update is successful
      return data;
    },
  },
});
