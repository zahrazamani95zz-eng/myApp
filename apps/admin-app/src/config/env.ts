import { z } from "zod";

const envSchema = z.object({
  ADMIN_API_BASE_URL: z.url(),
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const serverEnv = envSchema.parse({
  ADMIN_API_BASE_URL: process.env.ADMIN_API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
