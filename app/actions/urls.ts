'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { urls, analytics, dailyStats } from '@/lib/db/schema'
import { and, desc, eq, gte, lte, sql, ilike, isNull } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Generate a short code using nanoid
function generateShortCode(): string {
  return nanoid(6)
}

// Hash password for protected URLs
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Verify password for protected URLs
function verifyPassword(password: string, hash: string): boolean {
  return crypto.createHash('sha256').update(password).digest('hex') === hash
}

export async function createUrl(data: {
  originalUrl: string
  title?: string
  description?: string
  password?: string
  expiresAt?: Date
  maxClicks?: number
  customAlias?: string
}) {
  const userId = await getUserId()

  // Validate URL
  try {
    new URL(data.originalUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  // Check if custom alias is already taken
  if (data.customAlias) {
    const existing = await db
      .select()
      .from(urls)
      .where(eq(urls.customAlias, data.customAlias))
      .limit(1)

    if (existing.length > 0) {
      throw new Error('Custom alias already taken')
    }
  }

  const shortCode = data.customAlias || generateShortCode()
  const passwordHash = data.password ? hashPassword(data.password) : null

  const result = await db
    .insert(urls)
    .values({
      userId,
      shortCode,
      originalUrl: data.originalUrl,
      customAlias: data.customAlias,
      title: data.title,
      description: data.description,
      password: passwordHash,
      expiresAt: data.expiresAt,
      maxClicks: data.maxClicks,
    })
    .returning()

  revalidatePath('/dashboard')
  return result[0]
}

export async function getUrls(options?: {
  search?: string
  archived?: boolean
  limit?: number
  offset?: number
}) {
  const userId = await getUserId()

  let query = db
    .select()
    .from(urls)
    .where(
      and(
        eq(urls.userId, userId),
        options?.archived !== undefined ? eq(urls.archived, options.archived) : undefined,
        options?.search ? ilike(urls.title, `%${options.search}%`) : undefined
      )
    )
    .orderBy(desc(urls.createdAt))

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.offset(options.offset)
  }

  return await query
}

export async function getUrlById(id: number) {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(urls)
    .where(and(eq(urls.id, id), eq(urls.userId, userId)))
    .limit(1)

  return result[0] || null
}

export async function updateUrl(
  id: number,
  data: {
    title?: string
    description?: string
    archived?: boolean
  }
) {
  const userId = await getUserId()

  const result = await db
    .update(urls)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(urls.id, id), eq(urls.userId, userId)))
    .returning()

  revalidatePath('/dashboard')
  return result[0]
}

export async function deleteUrl(id: number) {
  const userId = await getUserId()

  await db.delete(urls).where(and(eq(urls.id, id), eq(urls.userId, userId)))

  revalidatePath('/dashboard')
}

export async function recordClick(shortCode: string, analyticsData: {
  referrer?: string
  userAgent?: string
  ipAddress?: string
  country?: string
  city?: string
  browser?: string
  browserVersion?: string
  os?: string
  osVersion?: string
  device?: string
  deviceType?: string
}) {
  const url = await db
    .select()
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1)

  if (!url[0]) {
    throw new Error('URL not found')
  }

  // Check if URL has expired
  if (url[0].expiresAt && url[0].expiresAt < new Date()) {
    throw new Error('URL has expired')
  }

  // Check if max clicks reached
  if (url[0].maxClicks && url[0].clicks >= url[0].maxClicks) {
    throw new Error('URL max clicks reached')
  }

  // Increment click count
  await db
    .update(urls)
    .set({ clicks: sql`${urls.clicks} + 1` })
    .where(eq(urls.id, url[0].id))

  // Record analytics
  await db.insert(analytics).values({
    urlId: url[0].id,
    userId: url[0].userId,
    ...analyticsData,
  })

  // Update daily stats
  const today = new Date().toISOString().split('T')[0]
  const existingDailyStat = await db
    .select()
    .from(dailyStats)
    .where(and(eq(dailyStats.urlId, url[0].id), eq(dailyStats.date, today as any)))
    .limit(1)

  if (existingDailyStat.length > 0) {
    await db
      .update(dailyStats)
      .set({ clicks: sql`${dailyStats.clicks} + 1` })
      .where(and(eq(dailyStats.urlId, url[0].id), eq(dailyStats.date, today as any)))
  } else {
    await db.insert(dailyStats).values({
      urlId: url[0].id,
      userId: url[0].userId,
      date: today as any,
      clicks: 1,
      uniqueVisitors: 1,
    })
  }
}

export async function getUrlAnalytics(urlId: number) {
  const userId = await getUserId()

  const url = await db
    .select()
    .from(urls)
    .where(and(eq(urls.id, urlId), eq(urls.userId, userId)))
    .limit(1)

  if (!url[0]) {
    throw new Error('URL not found')
  }

  const stats = await db
    .select()
    .from(dailyStats)
    .where(eq(dailyStats.urlId, urlId))
    .orderBy(desc(dailyStats.date))

  const analyticsData = await db
    .select()
    .from(analytics)
    .where(eq(analytics.urlId, urlId))
    .orderBy(desc(analytics.createdAt))

  return {
    url: url[0],
    dailyStats: stats,
    analytics: analyticsData,
  }
}

export async function getUrlStats(urlId: number) {
  const userId = await getUserId()

  const url = await db
    .select()
    .from(urls)
    .where(and(eq(urls.id, urlId), eq(urls.userId, userId)))
    .limit(1)

  if (!url[0]) {
    throw new Error('URL not found')
  }

  const stats = await db
    .select({
      date: dailyStats.date,
      clicks: sql`sum(${dailyStats.clicks})`.mapWith(Number),
    })
    .from(dailyStats)
    .where(eq(dailyStats.urlId, urlId))
    .groupBy(dailyStats.date)
    .orderBy(desc(dailyStats.date))
    .limit(30)

  const browsers = await db
    .select({
      browser: analytics.browser,
      count: sql`count(*)`.mapWith(Number),
    })
    .from(analytics)
    .where(eq(analytics.urlId, urlId))
    .groupBy(analytics.browser)
    .orderBy(desc(sql`count(*)`))
    .limit(10)

  const devices = await db
    .select({
      device: analytics.deviceType,
      count: sql`count(*)`.mapWith(Number),
    })
    .from(analytics)
    .where(eq(analytics.urlId, urlId))
    .groupBy(analytics.deviceType)
    .orderBy(desc(sql`count(*)`))

  const countries = await db
    .select({
      country: analytics.country,
      count: sql`count(*)`.mapWith(Number),
    })
    .from(analytics)
    .where(eq(analytics.urlId, urlId))
    .groupBy(analytics.country)
    .orderBy(desc(sql`count(*)`))
    .limit(10)

  return {
    totalClicks: url[0].clicks,
    dailyStats: stats,
    browsers,
    devices,
    countries,
  }
}
