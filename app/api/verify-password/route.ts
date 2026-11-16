
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { shortCode, password } = await request.json();

    if (!shortCode || !password) {
      return NextResponse.json(
        { error: "Short code and password are required" },
        { status: 400 }
      );
    }

    const res = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .limit(1);

    const url = res[0];

    if (!url || !url.password) {
      return NextResponse.json(
        { error: "Protected URL not found" },
        { status: 404 }
      );
    }
    const hashedPass = crypto.createHash('sha256').update(password).digest('hex')
    const isValid = hashedPass === url.password;

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: url.originalUrl,
    });

  } catch (error) {
    console.error("Password verification failed:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
