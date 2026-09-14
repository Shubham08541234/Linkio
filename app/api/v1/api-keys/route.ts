import crypto from "crypto";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    console.log("session: ", session);
    if (!session?.user) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : "Default API Key";

    // Generate 32 random bytes.
    const secret = crypto.randomBytes(32).toString("hex");

    const apiKey = `lk_live_${secret}`;

    const keyHash = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    const keyPrefix = apiKey.slice(0, 15);

    const result = await db
      .insert(apiKeys)
      .values({
        userId: session.user.id,
        name,
        keyHash,
        keyPrefix,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        createdAt: apiKeys.createdAt,
      });

    const key = result[0];

    return Response.json(
      {
        success: true,
        data: {
          id: key.id,
          name: key.name,
          key: apiKey,
          keyPrefix: key.keyPrefix,
          createdAt: key.createdAt,
        },
        message:
          "API key created. Store it securely because it will not be shown again.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create API key error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}



// list api keys

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
        revokedAt: apiKeys.revokedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, session.user.id));

    return Response.json({
      success: true,
      data: keys,
    });
  } catch (error) {
    console.error("List API keys error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch API keys",
      },
      { status: 500 }
    );
  }
}


// revoke api key