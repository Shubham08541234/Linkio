import { db } from "@/lib/db";
import { analytics } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlId = Number(
      request.nextUrl.searchParams.get("urlId")
    );

    if (!urlId || Number.isNaN(urlId)) {
      return Response.json(
        { error: "Invalid urlId" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        browser: analytics.browser,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.browser)
      .orderBy(sql`count(*) DESC`);

    return Response.json(
      result.map((item) => ({
        browser: item.browser || "Unknown",
        count: Number(item.count),
      }))
    );
  } catch (error) {
    console.error("Failed to fetch browser stats:", error);

    return Response.json(
      { error: "Failed to fetch browser stats" },
      { status: 500 }
    );
  }
}