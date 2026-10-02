import { Ratelimit } from "@upstash/ratelimit";
import { redis } from './redis';


export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "linkio:ratelimit",
});

export async function checkRateLimit(apiKey: string) {
  const result = await apiRateLimit.limit(apiKey);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}