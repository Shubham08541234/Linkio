import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDashboardStats, getUrls } from '@/app/actions/urls'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const [urls, stats] = await Promise.all([
    getUrls({ archived: false, limit: 50 }),
    getDashboardStats(),
  ])

  return <DashboardClient initialUrls={urls} stats={stats} user={session.user} />
}
