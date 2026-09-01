import { db } from '@/lib/db'
import { urls, analytics, dailyStats } from '@/lib/db/schema'
import { eq, sql, and, gte, lt } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {UAParser} from 'ua-parser-js'
import { IPinfoWrapper } from 'node-ipinfo'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params
  const headersList = await headers()

  // Get URL from database
  const result = await db
    .select()
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1)

  if (!result[0]) {
    return new Response('Short URL not found', { status: 404 })
  }

  const url = result[0]

  // Check if expired
  if (url.expiresAt && url.expiresAt < new Date()) {
    return new Response('Short URL has expired', { status: 410 })
  }

  // Check if max clicks reached
  if (url.maxClicks && url.clicks >= url.maxClicks) {
    return new Response('Short URL max clicks reached', { status: 410 })
  }

  // If password protected, redirect to password page
  if (url.password) {
    redirect(`/p/${shortCode}`)
  }

  // Extract analytics data
  const userAgent = headersList.get('user-agent') || undefined
  const referrer = headersList.get('referer') || undefined
  const ipAddress =
    headersList.get('x-forwarded-for')?.split(',')[0] || undefined

  // set visitorId as cookies if not exits
  const cookieStore = await cookies();
  let visitorId = cookieStore.get('visitorId')?.value;

  if(!visitorId){
    visitorId = crypto.randomUUID();

    cookieStore.set('visitorId', visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }

  // Record the click
  await recordClickInBackground(url.id, url.userId, {
    userAgent,
    referrer,
    ipAddress,
    visitorId
  })

  // Redirect to original URL
  redirect(url.originalUrl)
}

async function recordClickInBackground(
  urlId: number,
  userId: string,
  analyticsData: {
    userAgent?: string
    referrer?: string
    ipAddress?: string
    visitorId: string
  }
) {
  try {
    //ip information

    const ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_TOKEN || "");
    const ipinfo = await ipinfoWrapper.lookupIp(analyticsData.ipAddress === "::1"? "1.1.1.1": analyticsData.ipAddress || "8.8.8.8");
    // Parse User-Agent
    const parser = new UAParser(analyticsData.userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const device = parser.getDevice()
    console.log("device: ", device);

    // 1. Increment total clicks
    await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
      })
      .where(eq(urls.id, urlId))

    // check if this visitor have already visited today or not

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(24, 0, 0, 0);

    const existingVisitor = await db
      .select({ id: analytics. id })
      .from(analytics)
      .where(
        and(
          eq(analytics.urlId, urlId),
          eq(analytics.visitorId, analyticsData.visitorId),
          gte(analytics.createdAt, startOfDay),
          lt(analytics.createdAt, endOfDay)
        )
      )
      .limit(1);

    console.log("existingVisitor: ", existingVisitor);
    const isUniqueVisitor = existingVisitor.length === 0;
    console.log("uqiqueVisitor: ", isUniqueVisitor);

    // 2. Store analytics event
    await db.insert(analytics).values({
      urlId,
      userId,

      referrer: analyticsData.referrer,
      userAgent: analyticsData.userAgent,
      ipAddress: analyticsData.ipAddress,

      visitorId: analyticsData.visitorId,

      country: ipinfo.country,
      city: ipinfo.city,

      browser: browser.name,
      browserVersion: browser.version,

      os: os.name,
      osVersion: os.version,

      device: device.model ?? "desktop",
      deviceType: device.type ?? device.vendor ?? "desktop",
    })

    // 3. Get today's date
    const today = new Date().toISOString().split('T')[0]

    // 4. Update daily stats
    await db
      .insert(dailyStats)
      .values({
        urlId,
        userId,
        date: today,
        clicks: 1,
        uniqueVisitors: isUniqueVisitor ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: [dailyStats.urlId, dailyStats.date],
        set: {
          clicks: sql`${dailyStats.clicks} + 1`,

          ...(isUniqueVisitor && {
            uniqueVisitors: sql`${dailyStats.uniqueVisitors} + 1`,
          }),
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    console.error('Failed to record click:', error)
  }
}