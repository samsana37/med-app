import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { medications, medicationLogs } from "~/server/db/schema";

export const medicationRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.medications.findMany({
        where: eq(medications.userId, input.userId),
        orderBy: [desc(medications.createdAt)],
      });
    }),

  getActive: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.medications.findMany({
        where: and(
          eq(medications.userId, input.userId),
          eq(medications.active, true),
        ),
        orderBy: [desc(medications.createdAt)],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().min(1),
        dosage: z.string().optional(),
        times: z.array(z.string()).optional(),
        active: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [medication] = await ctx.db
        .insert(medications)
        .values(input)
        .returning();
      return medication;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        dosage: z.string().optional(),
        times: z.array(z.string()).optional(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [medication] = await ctx.db
        .update(medications)
        .set(updates)
        .where(eq(medications.id, id))
        .returning();
      return medication;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(medications).where(eq(medications.id, input.id));
    }),

  // Medication logs
  logTaken: publicProcedure
    .input(
      z.object({
        medicationId: z.number(),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [log] = await ctx.db
        .insert(medicationLogs)
        .values(input)
        .returning();
      return log;
    }),

  getLogs: publicProcedure
    .input(z.object({ userId: z.number(), medicationId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.medicationId) {
        return await ctx.db.query.medicationLogs.findMany({
          where: and(
            eq(medicationLogs.userId, input.userId),
            eq(medicationLogs.medicationId, input.medicationId),
          ),
          orderBy: [desc(medicationLogs.takenAt)],
        });
      }
      return await ctx.db.query.medicationLogs.findMany({
        where: eq(medicationLogs.userId, input.userId),
        orderBy: [desc(medicationLogs.takenAt)],
      });
    }),
});

