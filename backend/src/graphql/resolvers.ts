export const resolvers = (supabase: any) => ({
    Query: {
      getUser: async (_: any, { telegramId }: { telegramId: string }) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', telegramId)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      },
    },
    Mutation: {
      updateCoins: async (
        _: any,
        { telegramId, coins }: { telegramId: string; coins: number }
      ) => {
        const { data, error } = await supabase
          .from('users')
          .update({ coins })
          .eq('telegram_id', telegramId)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      },
    },
  });
  