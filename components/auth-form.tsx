'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = isSignUp
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

      console.log(res)

      if (res.error) {
        const message = res.error.statusText ?? res.error.message

        if (message?.toLowerCase().includes('already exists')) {
          setError('An account with this email already exists. Try signing in instead.')
        } else if (
          message?.toLowerCase().includes('invalid') &&
          message?.toLowerCase().includes('password')
        ) {
          setError('Incorrect email or password.')
        } else if(message?.includes("UNAUTHORIZED")){
          setError("Invalid credentials! please visit signup page...")
        }
        else {
          setError(message ?? 'Something went wrong. Please try again.')
        }
        return
      }

      // Sign-up succeeded but no session/token means email verification
      // is required before the user can be logged in.
      if (isSignUp && !res.data?.token) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Auth request failed:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="linkio-glow linkio-grid min-h-svh p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100svh-3rem)]">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-card/85 shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden border-r border-border p-10 lg:flex">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[54px] border-primary/8" />
            <Link href="/" className="relative flex items-center gap-2.5 text-xl font-black tracking-tight">
              <span className="grid h-9 w-9 rotate-3 place-items-center rounded-[11px] bg-primary text-primary-foreground">
                <svg className="h-5 w-5 -rotate-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
                </svg>
              </span>
              LINKIO
            </Link>
            <div className="relative">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">One link away</p>
              <h2 className="max-w-md text-5xl font-black leading-[0.95] tracking-tight">
                {isSignUp ? 'Start making every link matter.' : 'Your next insight is waiting.'}
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
                Short links, useful analytics, and complete control—wrapped into one focused workspace.
              </p>
            </div>
            <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_oklch(var(--primary))]" />
              All systems operational
            </div>
          </section>

          <Card className="border-0 bg-transparent p-7 sm:p-10 lg:p-12">
            <Link href="/" className="mb-10 flex items-center gap-2 text-lg font-black tracking-tight lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">L</span>
              LINKIO
            </Link>
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {isSignUp ? 'New workspace' : 'Welcome back'}
              </p>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                {isSignUp ? 'Create your account' : 'Sign in to Linkio'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="h-11" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="h-11" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={isSignUp ? 'new-password' : 'current-password'} className="h-11" />
              </div>

              {error && <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive error-message" role="alert">{error}</p>}

              <Button type="submit" disabled={loading} className="mt-1 h-11 w-full rounded-xl font-bold">
                {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-bold text-primary underline-offset-4 hover:underline">
                {isSignUp ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}