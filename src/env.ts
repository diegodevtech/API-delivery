import { z } from "zod";

// Define a schema for environment variables using Zod
const envSchema = z.object({
  DATABASE_URL: z.string().url(), 
  JWT_SECRET: z.string()
});

export const env = envSchema.parse(process.env);