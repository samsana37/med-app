import { z } from "zod";
import { ilike, or } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { medicines, conditions } from "~/server/db/schema";

export const databaseRouter = createTRPCRouter({
  // Medicines
  searchMedicines: publicProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.query) {
        return await ctx.db.query.medicines.findMany({
          where: ilike(medicines.name, `%${input.query}%`),
          limit: 50,
        });
      }
      return await ctx.db.query.medicines.findMany({ limit: 50 });
    }),

  getMedicine: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.medicines.findFirst({
        where: (medicines, { eq }) => eq(medicines.id, input.id),
      });
    }),

  // Conditions
  searchConditions: publicProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.query) {
        return await ctx.db.query.conditions.findMany({
          where: ilike(conditions.name, `%${input.query}%`),
          limit: 50,
        });
      }
      return await ctx.db.query.conditions.findMany({ limit: 50 });
    }),

  getCondition: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.conditions.findFirst({
        where: (conditions, { eq }) => eq(conditions.id, input.id),
      });
    }),
});

