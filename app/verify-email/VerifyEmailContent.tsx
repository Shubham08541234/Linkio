'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

type Status = 'verifying' | 'success' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<Status>('verifying')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Missing verification token.')
      return
    }

    const verify = async () => {
      try {
        const res = await authClient.verifyEmail({
          query: { token },
        })

        if (res.error) {
          setStatus('error')
          setError(res.error.statusText ?? 'Verification failed')
          return
        }

        setStatus('success')

        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (err) {
        console.log('Verification request failed: ', err)
        setStatus('error')
        setError('Something went wrong. Please try again.')
      }
    }

    verify()
  }, [token, router])

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <h1 className="text-lg font-semibold text-foreground">
              Verifying email...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <h1 className="text-lg font-semibold text-foreground">
              Email verified
            </h1>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your account...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-lg font-semibold text-foreground">
              Verification failed
            </h1>
            <p className="text-sm text-muted-foreground">
              {error ?? 'The verification link is invalid or expired.'}
            </p>
            <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                className="mt-2 w-full"
            >
                Back to sign in
            </Button>
          </div>
        )}
      </Card>
    </main>
  )
}