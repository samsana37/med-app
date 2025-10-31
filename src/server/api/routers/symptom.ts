import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { symptoms } from "~/server/db/schema";

export const symptomRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.symptoms.findMany({
        where: eq(symptoms.userId, input.userId),
        orderBy: [desc(symptoms.symptomDate)],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().min(1),
        severity: z.enum(["Mild", "Moderate", "Severe"]),
        notes: z.string().optional(),
        symptomDate: z.string().optional(), // ISO date string
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { symptomDate, ...data } = input;
      const [symptom] = await ctx.db
        .insert(symptoms)
        .values({
          ...data,
          ...(symptomDate ? { symptomDate } : {}),
        })
        .returning();
      return symptom;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        severity: z.enum(["Mild", "Moderate", "Severe"]).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [symptom] = await ctx.db
        .update(symptoms)
        .set(updates)
        .where(eq(symptoms.id, id))
        .returning();
      return symptom;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(symptoms).where(eq(symptoms.id, input.id));
    }),
});

