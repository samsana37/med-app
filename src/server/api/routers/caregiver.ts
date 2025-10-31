import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { caregivers, emergencyAlerts } from "~/server/db/schema";

export const caregiverRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.caregivers.findMany({
        where: eq(caregivers.userId, input.userId),
        orderBy: [desc(caregivers.createdAt)],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().min(1),
        relationship: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check limit of 3 caregivers
      const existing = await ctx.db.query.caregivers.findMany({
        where: eq(caregivers.userId, input.userId),
      });

      if (existing.length >= 3) {
        throw new Error("Maximum of 3 emergency contacts allowed");
      }

      const [caregiver] = await ctx.db
        .insert(caregivers)
        .values(input)
        .returning();
      return caregiver;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        relationship: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [caregiver] = await ctx.db
        .update(caregivers)
        .set(updates)
        .where(eq(caregivers.id, id))
        .returning();
      return caregiver;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(caregivers).where(eq(caregivers.id, input.id));
    }),

  // Emergency alerts
  triggerAlert: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [alert] = await ctx.db
        .insert(emergencyAlerts)
        .values({ userId: input.userId })
        .returning();
      return alert;
    }),

  getAlertHistory: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.emergencyAlerts.findMany({
        where: eq(emergencyAlerts.userId, input.userId),
        orderBy: [desc(emergencyAlerts.triggeredAt)],
      });
    }),
});

