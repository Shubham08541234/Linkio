import { db } from '@/lib/db'
import { urls } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || undefined

  // Record the click (in background - don't wait for it)
  recordClickInBackground(shortCode, {
    userAgent,
    referrer,
    ipAddress,
  })

  // Redirect to original URL
  redirect(url.originalUrl)
}

async function recordClickInBackground(
  shortCode: string,
  analyticsData: {
    userAgent?: string
    referrer?: string
    ipAddress?: string
  }
) {
  try {
    // We'll implement a server action call here in the future
    // For now, this is a placeholder
  } catch (error) {
    console.error('Failed to record click:', error)
  }
}
