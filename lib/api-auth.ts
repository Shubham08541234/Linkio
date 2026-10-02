import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "./rate-limit";

export async function authenticateApiKey(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const apiKey = authorization.substring(7);

  if (!apiKey.startsWith("lk_live_")) {
    return null;
  }

  // Hash API key
  const keyHash = crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");

  // Find API key in database
  const result = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1);

  const key = result[0];

  if (!key) {
    return null;
  }

  // Revoked key
  if (key.revokedAt) {
    return null;
  }

  // Rate limit using database API key ID
  const rateLimit = await checkRateLimit(key.id.toString());

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: rateLimit.reset,
      },
      { status: 429 }
    );
  }

  // Update last usage
  await db
    .update(apiKeys)
    .set({
      lastUsedAt: new Date(),
    })
    .where(eq(apiKeys.id, key.id));

  return key;
}