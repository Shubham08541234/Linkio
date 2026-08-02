import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUrls } from '@/app/actions/urls'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const urls = await getUrls({ archived: false, limit: 50 })

  return <DashboardClient initialUrls={urls} user={session.user} />
}
