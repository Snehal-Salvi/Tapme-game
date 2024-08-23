export const resolvers = (supabase: any) => ({
    Query: {
      getUser: async (_: any, { telegramId }: { telegramId: string }) => {
        try {
          const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .eq('telegram_id', telegramId);
  
          if (error) {
            throw new Error(`Error fetching user: ${error.message}`);
          }
  
          if (data.length > 1) {
            console.error('Multiple users found for telegramId:', telegramId);
            throw new Error('Multiple users found for telegramId');
          }
  
          if (data.length === 0) {
            return null; // Return null or handle the case when no user is found
          }
  
          return data[0];
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
  