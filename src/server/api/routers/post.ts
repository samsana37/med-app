import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Placeholder router - can be removed or repurposed
export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
