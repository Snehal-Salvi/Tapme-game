// Define and export resolvers for the GraphQL server
// Resolvers are functions that handle the logic for GraphQL queries and mutations.
// They interact with the database to fetch or modify data.

export const resolvers = (supabase: any) => ({
  Query: {
    // Resolver for the 'getUser' query
    // This query retrieves a user's information based on their Telegram ID.
    getUser: async (_: any, { telegramId }: { telegramId: string }) => {
      // Query the Supabase 'users' table to get a user by their Telegram ID
      // The `single()` method ensures that only one user is returned.
      const { data, error } = await supabase
        .from('users') // Specify the 'users' table
        .select('*') // Select all columns
        .eq('telegram_id', telegramId) // Filter by the provided Telegram ID
        .single(); // Retrieve a single record

      // Handle any errors that occur during the query
      // If there is an error, it is thrown as an exception.
      if (error) {
        throw new Error(error.message); // Throw an error with the message from Supabase
      }

      // Return the user data if the query is successful
      // The user's data is returned to the client.
      return data;
    },
  },
  Mutation: {
    // Resolver for the 'updateCoins' mutation
    // This mutation updates the coin balance of a user based on their Telegram ID.
    updateCoins: async (
      _: any,
      { telegramId, coins }: { telegramId: string; coins: number }
    ) => {
      // Update the 'coins' column for a user with the specified Telegram ID
      // The `update()` method sets the new value for the 'coins' column.
      const { data, error } = await supabase
        .from('users') // Specify the 'users' table
        .update({ coins }) // Set the 'coins' column to the new value
        .eq('telegram_id', telegramId) // Filter by the provided Telegram ID
        .single(); // Update a single record

      // Handle any errors that occur during the update
      // If there is an error, it is thrown as an exception.
      if (error) {
        throw new Error(error.message); // Throw an error with the message from Supabase
      }

      // Return the updated user data if the update is successful
      // The updated user data is returned to the client.
      return data;
    },
  },
});
