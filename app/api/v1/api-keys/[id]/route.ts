import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";



// revoke api key
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const keyId = Number(id);

    if (!Number.isInteger(keyId)) {
      return Response.json(
        {
          success: false,
          error: "Invalid API key ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .update(apiKeys)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.userId, session.user.id)
        )
      )
      .returning({
        id: apiKeys.id,
      });

    if (result.length === 0) {
      return Response.json(
        {
          success: false,
          error: "API key not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "API key revoked",
    });
  } catch (error) {
    console.error("Revoke API key error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to revoke API key",
      },
      { status: 500 }
    );
  }
}