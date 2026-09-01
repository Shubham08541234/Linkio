import { db } from "@/lib/db";
import { dailyStats } from "@/lib/db/schema";
import { and, asc, eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const urlId = Number(searchParams.get("urlId"));
    const days = Number(searchParams.get("days")) || 7;

    if (!urlId) {
      return NextResponse.json(
        { error: "urlId is required" },
        { status: 400 }
      );
    }

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - (days - 1));

    const startDateString = startDate.toISOString().split("T")[0];

    const stats = await db
      .select({
        date: dailyStats.date,
        clicks: dailyStats.clicks,
        uniqueVisitors: dailyStats.uniqueVisitors,
      })
      .from(dailyStats)
      .where(
        and(
          eq(dailyStats.urlId, urlId),
          gte(dailyStats.date, startDateString)
        )
      )
      .orderBy(asc(dailyStats.date));

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch click stats:", error);

    return NextResponse.json(
      { error: "Failed to fetch click stats" },
      { status: 500 }
    );
  }
}