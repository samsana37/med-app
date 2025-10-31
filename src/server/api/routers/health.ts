import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { vitalSigns } from "~/server/db/schema";

export const healthRouter = createTRPCRouter({
  // Vital signs
  getAllVitalSigns: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.vitalSigns.findMany({
        where: eq(vitalSigns.userId, input.userId),
        orderBy: [desc(vitalSigns.recordedAt)],
      });
    }),

  createVitalSign: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        type: z.string().min(1), // e.g., "blood_pressure", "heart_rate", "temperature", "weight"
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [vitalSign] = await ctx.db
        .insert(vitalSigns)
        .values(input)
        .returning();
      return vitalSign;
    }),

  deleteVitalSign: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(vitalSigns).where(eq(vitalSigns.id, input.id));
    }),
});

