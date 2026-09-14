import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  urls,
  analytics,
  dailyStats,
} from "@/lib/db/schema";
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

    // Verify ownership.
    const urlResult = await db
      .select({
        id: urls.id,
        shortCode: urls.shortCode,
        originalUrl: urls.originalUrl,
        clicks: urls.clicks,
      })
      .from(urls)
      .where(
        and(
          eq(urls.id, urlId),
          eq(urls.userId, apiKey.userId)
        )
      )
      .limit(1);

    const url = urlResult[0];

    if (!url) {
      return Response.json(
        {
          success: false,
          error: "URL not found",
        },
        { status: 404 }
      );
    }

    // Daily statistics.
    const daily = await db
      .select({
        date: dailyStats.date,
        clicks: dailyStats.clicks,
        uniqueVisitors: dailyStats.uniqueVisitors,
      })
      .from(dailyStats)
      .where(eq(dailyStats.urlId, urlId))
      .orderBy(dailyStats.date);

    // Countries.
    const countries = await db
      .select({
        country: analytics.country,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.country)
      .orderBy(desc(sql`count(*)`));

    // Cities.
    const cities = await db
      .select({
        city: analytics.city,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.city)
      .orderBy(desc(sql`count(*)`));

    // Browsers.
    const browsers = await db
      .select({
        browser: analytics.browser,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.browser)
      .orderBy(desc(sql`count(*)`));

    // Devices.
    const devices = await db
      .select({
        deviceType: analytics.deviceType,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.deviceType)
      .orderBy(desc(sql`count(*)`));

    // Operating systems.
    const operatingSystems = await db
      .select({
        os: analytics.os,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.os)
      .orderBy(desc(sql`count(*)`));

    // Referrers.
    const referrers = await db
      .select({
        referrer: analytics.referrer,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId))
      .groupBy(analytics.referrer)
      .orderBy(desc(sql`count(*)`));

    // Total unique visitors.
    const uniqueVisitorsResult = await db
      .select({
        count: sql<number>`
          count(distinct ${analytics.visitorId})
        `,
      })
      .from(analytics)
      .where(eq(analytics.urlId, urlId));

    const uniqueVisitors =
      Number(uniqueVisitorsResult[0]?.count ?? 0);

    return Response.json({
      success: true,

      data: {
        url: {
          id: url.id,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
        },

        overview: {
          clicks: url.clicks,
          uniqueVisitors,
        },

        dailyStats: daily,

        countries,

        cities,

        browsers,

        devices,

        operatingSystems,

        referrers,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}