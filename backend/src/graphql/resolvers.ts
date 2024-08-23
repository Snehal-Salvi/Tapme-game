export const resolvers = (supabase: any) => ({
    Query: {
      getUser: async (_: any, { id }: { id: string }) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    },
    Mutation: {
      updateCoins: async (_: any, { id, coins }: { id: string; coins: number }) => {
        const { data, error } = await supabase
          .from('users')
          .update({ coins })
          .eq('id', id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    },
  });
  