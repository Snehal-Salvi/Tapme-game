// src/graphql/resolvers.ts

export const resolvers = (supabase: any) => ({
    Query: {
      getUser: async (_: any, { telegramId }: { telegramId: string }) => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();
  
          if (error) {
            throw new Error(`Error fetching user: ${error.message}`);
          }
  
          return data;
        } catch (error) {
          console.error('Error in getUser resolver:', error);
          throw error;
        }
      },
    },
    Mutation: {
      updateCoins: async (
        _: any,
        { telegramId, coins }: { telegramId: string; coins: number }
      ) => {
        try {
          const { data, error } = await supabase
            .from('users')
            .update({ coins })
            .eq('telegram_id', telegramId)
            .single();
  
          if (error) {
            throw new Error(`Error updating coins: ${error.message}`);
          }
  
          return data;
        } catch (error) {
          console.error('Error in updateCoins resolver:', error);
          throw error;
        }
      },
    },
  });
  