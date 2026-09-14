import crypto from "crypto";
import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { authenticateApiKey } from "@/lib/api-auth";

function generateShortCode(length = 7) {
  return crypto
    .randomBytes(length)
    .toString("base64url")
    .slice(0, length);
}

export async function POST(request: Request) {
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
    

    const body = await request.json();

    const {
      url,
      customAlias,
      title,
      description,
      password,
      expiresAt,
      maxClicks,
    } = body;

    if (!url || typeof url !== "string") {
      return Response.json(
        {
          success: false,
          error: "url is required",
        },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid URL",
        },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return Response.json(
        {
          success: false,
          error: "Only HTTP and HTTPS URLs are supported",
        },
        { status: 400 }
      );
    }

    if (
      customAlias !== undefined &&
      customAlias !== null &&
      typeof customAlias !== "string"
    ) {
      return Response.json(
        {
          success: false,
          error: "customAlias must be a string",
        },
        { status: 400 }
      );
    }

    if (
      maxClicks !== undefined &&
      maxClicks !== null &&
      (!Number.isInteger(maxClicks) || maxClicks <= 0)
    ) {
      return Response.json(
        {
          success: false,
          error: "maxClicks must be a positive integer",
        },
        { status: 400 }
      );
    }

    let shortCode = customAlias?.trim();

    if (shortCode) {
      const existing = await db
        .select({ id: urls.id })
        .from(urls)
        .where(eq(urls.shortCode, shortCode))
        .limit(1);

      if (existing.length > 0) {
        return Response.json(
          {
            success: false,
            error: "Custom alias already exists",
          },
          { status: 409 }
        );
      }
    } else {
      // Generate a unique short code.
      let attempts = 0;

      while (attempts < 10) {
        const generated = generateShortCode();

        const existing = await db
          .select({ id: urls.id })
          .from(urls)
          .where(eq(urls.shortCode, generated))
          .limit(1);

        if (existing.length === 0) {
          shortCode = generated;
          break;
        }

        attempts++;
      }

      if (!shortCode) {
        return Response.json(
          {
            success: false,
            error: "Failed to generate unique short code",
          },
          { status: 500 }
        );
      }
    }

    const result = await db
      .insert(urls)
      .values({
        userId: apiKey.userId,
        shortCode,
        originalUrl: url,
        customAlias: customAlias?.trim() || null,
        title: title || null,
        description: description || null,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks: maxClicks ?? null,
      })
      .returning();

    const createdUrl = result[0];

    const origin = new URL(request.url).origin;

    return Response.json(
      {
        success: true,
        data: {
          id: createdUrl.id,
          shortCode: createdUrl.shortCode,
          shortUrl: `${origin}/api/redirect/${createdUrl.shortCode}`,
          originalUrl: createdUrl.originalUrl,
          title: createdUrl.title,
          description: createdUrl.description,
          expiresAt: createdUrl.expiresAt,
          maxClicks: createdUrl.maxClicks,
          clicks: createdUrl.clicks,
          createdAt: createdUrl.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create URL API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to create short URL",
      },
      { status: 500 }
    );
  }
}


// get urls

export async function GET(request: Request) {
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

    const result = await db
      .select({
        id: urls.id,
        shortCode: urls.shortCode,
        originalUrl: urls.originalUrl,
        customAlias: urls.customAlias,
        title: urls.title,
        description: urls.description,
        expiresAt: urls.expiresAt,
        maxClicks: urls.maxClicks,
        clicks: urls.clicks,
        archived: urls.archived,
        createdAt: urls.createdAt,
        updatedAt: urls.updatedAt,
      })
      .from(urls)
      .where(eq(urls.userId, apiKey.userId))
      .orderBy(desc(urls.createdAt));

    const origin = new URL(request.url).origin;

    return Response.json({
      success: true,
      data: result.map((url) => ({
        ...url,
        shortUrl: `${origin}/api/redirect/${url.shortCode}`,
      })),
    });
  } catch (error) {
    console.error("List URLs API error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch URLs",
      },
      { status: 500 }
    );
  }
}