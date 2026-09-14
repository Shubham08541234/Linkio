import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { authenticateApiKey } from "@/lib/api-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = await authenticateApiKey(request);

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "Invalid or missing API key",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const urlId = Number(id);

    if (!Number.isInteger(urlId)) {
      return Response.json(
        {
          success: false,
          error: "Invalid URL ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(urls)
      .where(
        and(
          eq(urls.id, urlId),
          eq(urls.userId, apiKey.userId)
        )
      )
      .limit(1);

    const url = result[0];

    if (!url) {
      return Response.json(
        {
          success: false,
          error: "URL not found",
        },
        { status: 404 }
      );
    }

    const origin = new URL(request.url).origin;

    return Response.json({
      success: true,
      data: {
        ...url,
        shortUrl: `${origin}/api/redirect/${url.shortCode}`,
      },
    });
  } catch (error) {
    console.error("Get URL API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch URL",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = await authenticateApiKey(request);

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "Invalid or missing API key",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const urlId = Number(id);

    if (!Number.isInteger(urlId)) {
      return Response.json(
        {
          success: false,
          error: "Invalid URL ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .delete(urls)
      .where(
        and(
          eq(urls.id, urlId),
          eq(urls.userId, apiKey.userId)
        )
      )
      .returning({
        id: urls.id,
      });

    if (result.length === 0) {
      return Response.json(
        {
          success: false,
          error: "URL not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete URL API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to delete URL",
      },
      { status: 500 }
    );
  }
}