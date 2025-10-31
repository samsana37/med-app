import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "~/server/api/routers/user";
import { medicationRouter } from "~/server/api/routers/medication";
import { caregiverRouter } from "~/server/api/routers/caregiver";
import { moodRouter } from "~/server/api/routers/mood";
import { symptomRouter } from "~/server/api/routers/symptom";
import { healthRouter } from "~/server/api/routers/health";
import { databaseRouter } from "~/server/api/routers/database";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  medication: medicationRouter,
  caregiver: caregiverRouter,
  mood: moodRouter,
  symptom: symptomRouter,
  health: healthRouter,
  database: databaseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
