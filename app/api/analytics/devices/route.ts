import { db } from "@/lib/db";
import { analytics } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const urlId = Number(searchParams.get("urlId"));

    if (!urlId || Number.isNaN(urlId)) {
      return NextResponse.json(
        { error: "urlId is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        deviceType: analytics.deviceType,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.deviceType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch device analytics:", error);

    return NextResponse.json(
      { error: "Failed to fetch device analytics" },
      { status: 500 }
    );
  }
}