import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PAPER_SOURCE_QUERY: z
    .string()
    .min(1)
    .default(
      "cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG+OR+cat:cs.CV+OR+cat:cs.RO+OR+cat:cs.IR+OR+cat:cs.CR+OR+cat:cs.DB+OR+cat:cs.DC+OR+cat:cs.HC+OR+cat:cs.SD+OR+cat:stat.ML",
    ),
  PAPER_SOURCE_MAX_RESULTS: z.coerce.number().int().positive().default(5),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(300000),
  WORKER_USER_AGENT: z.string().min(1).default("research-paper-live-tracker/0.1"),
});

export const env = envSchema.parse(process.env);
