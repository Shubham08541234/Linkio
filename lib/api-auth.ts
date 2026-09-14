import crypto from "crypto";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function authenticateApiKey(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const apiKey = authorization.substring(7);

  if (!apiKey.startsWith("lk_live_")) {
    return null;
  }

  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

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

  // Update last usage
  await db
    .update(apiKeys)
    .set({
      lastUsedAt: new Date(),
    })
    .where(eq(apiKeys.id, key.id));

  return key;
}
