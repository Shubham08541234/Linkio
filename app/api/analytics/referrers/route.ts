import { db } from "@/lib/db";
import { analytics } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlId = Number(searchParams.get("urlId"));

    if (!urlId) {
      return NextResponse.json(
        { error: "urlId is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        referrer: analytics.referrer,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.referrer)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    return NextResponse.json(
      result.map((item) => ({
        referrer: item.referrer || "Direct",
        count: Number(item.count),
      }))
    );
  } catch (error) {
    console.error("Failed to fetch referrer stats:", error);

    return NextResponse.json(
      { error: "Failed to fetch referrer stats" },
      { status: 500 }
    );
  }
}