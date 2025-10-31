import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { moodEntries, journalEntries } from "~/server/db/schema";

export const moodRouter = createTRPCRouter({
  // Mood entries
  getAll: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.moodEntries.findMany({
        where: eq(moodEntries.userId, input.userId),
        orderBy: [desc(moodEntries.entryDate)],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        mood: z.number().min(1).max(5),
        notes: z.string().optional(),
        entryDate: z.string().optional(), // ISO date string
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { entryDate, ...data } = input;
      const [entry] = await ctx.db
        .insert(moodEntries)
        .values({
          ...data,
          ...(entryDate ? { entryDate } : {}),
        })
        .returning();
      return entry;
    }),

  // Journal entries
  getAllJournals: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.journalEntries.findMany({
        where: eq(journalEntries.userId, input.userId),
        orderBy: [desc(journalEntries.entryDate)],
      });
    }),

  createJournal: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
        entryDate: z.string().optional(), // ISO date string
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { entryDate, ...data } = input;
      const [entry] = await ctx.db
        .insert(journalEntries)
        .values({
          ...data,
          ...(entryDate ? { entryDate } : {}),
        })
        .returning();
      return entry;
    }),

  updateJournal: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [entry] = await ctx.db
        .update(journalEntries)
        .set(updates)
        .where(eq(journalEntries.id, id))
        .returning();
      return entry;
    }),

  deleteJournal: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(journalEntries).where(eq(journalEntries.id, input.id));
    }),
});

