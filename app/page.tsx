import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  LockKeyhole,
  MousePointer2,
  QrCode,
  Sparkles,
  Zap,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return (
    <div className="linkio-glow min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="relative z-50 mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-black tracking-tight">
          <span className="grid h-9 w-9 rotate-3 place-items-center rounded-[11px] bg-primary text-primary-foreground shadow-[0_0_30px_oklch(var(--primary)/20%)]">
            <Link2 className="h-5 w-5 -rotate-3" />
          </span>
          LINKIO
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="hidden sm:block">
            <Button variant="ghost" className="rounded-full px-5">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="h-10 rounded-full px-5 font-bold">
              Start creating <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="linkio-grid relative mx-auto min-h-[650px] max-w-[1380px] border-x border-border/60 px-5 pb-16 pt-16 lg:px-10 lg:pt-24">
          <div className="absolute right-[8%] top-16 h-32 w-32 rounded-full border border-primary/20" />
          <div className="absolute right-[10%] top-20 h-24 w-24 rounded-full border border-dashed border-primary/30" />

          <div className="relative grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Your links deserve better
              </div>
              <h1 className="max-w-[760px] text-[clamp(4rem,8vw,7.4rem)] font-black leading-[0.86] tracking-[-0.065em]">
                Make every
                <span className="relative block text-primary">
                  click count.
                  <svg className="absolute -bottom-3 left-1 w-[58%] text-accent" viewBox="0 0 300 18" fill="none" aria-hidden="true">
                    <path d="M3 12C83 3 195 17 297 5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mt-9 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                Turn long, forgettable URLs into sharp short links—and learn exactly who is paying attention.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 rounded-full px-6 text-base font-bold">
                    Create your first link <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <span className="px-2 text-xs font-medium text-muted-foreground">Free forever · No card needed</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -left-7 top-16 z-10 rotate-[-7deg] rounded-xl border border-border bg-card px-4 py-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MousePointer2 className="h-4 w-4 text-primary" />
                  <span className="font-mono">live clicks</span>
                  <strong className="ml-2 text-base text-foreground">+84</strong>
                </div>
              </div>
              <div className="rotate-[2deg] rounded-[28px] border border-primary/20 bg-card p-3 shadow-[0_30px_100px_oklch(0.82_0.19_128/10%)]">
                <div className="rounded-[20px] border border-border bg-background p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Link performance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 rounded-2xl bg-primary p-5 text-primary-foreground">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">Total clicks</p>
                      <div className="mt-2 flex items-end justify-between">
                        <strong className="text-5xl tracking-tight">12.8k</strong>
                        <span className="mb-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-bold">↑ 18.4%</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border p-4">
                      <Globe2 className="mb-7 h-5 w-5 text-primary" />
                      <strong className="text-2xl">36</strong>
                      <p className="mt-1 text-xs text-muted-foreground">countries</p>
                    </div>
                    <div className="rounded-2xl border border-border p-4">
                      <BarChart3 className="mb-7 h-5 w-5 text-accent" />
                      <strong className="text-2xl">3.2k</strong>
                      <p className="mt-1 text-xs text-muted-foreground">visitors</p>
                    </div>
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-2 rounded-2xl border border-border px-4 pb-3">
                    {[38, 60, 44, 82, 55, 72, 94, 68, 88, 76, 100, 84].map((height, index) => (
                      <span key={index} className="flex-1 rounded-t-sm bg-primary/70" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] border-x border-border/60 px-5 py-20 lg:px-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Built to move</p>
              <h2 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">One tiny link. A whole lot of signal.</h2>
            </div>
            <ArrowDownRight className="hidden h-16 w-16 text-accent sm:block" />
          </div>
          <div className="grid gap-px overflow-hidden rounded-[24px] border border-border bg-border md:grid-cols-3">
            {[
              { icon: Zap, number: '01', title: 'Shorten instantly', copy: 'Create clean, memorable links in seconds—with aliases when you want to make it yours.' },
              { icon: BarChart3, number: '02', title: 'Read the room', copy: 'See clicks, devices, countries, and referrers turn into practical performance insight.' },
              { icon: LockKeyhole, number: '03', title: 'Stay in control', copy: 'Protect sensitive links, set limits, and decide exactly how each destination behaves.' },
            ].map((feature) => (
              <article key={feature.number} className="group bg-background p-7 transition-colors hover:bg-card sm:p-9">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/20 bg-primary/8 text-primary transition-transform group-hover:-rotate-6 group-hover:scale-105">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">{feature.number}</span>
                </div>
                <h3 className="mt-12 text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] border-x border-border/60 px-5 pb-20 lg:px-10">
          <div className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-primary px-7 py-12 text-primary-foreground sm:px-12 sm:py-14">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-primary-foreground/10" />
            <div className="relative max-w-2xl">
              <QrCode className="mb-6 h-8 w-8" />
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Ready to make a shorter path?</h2>
              <p className="mt-5 max-w-lg text-lg opacity-75">Create, share, measure, repeat. Your next great campaign starts with one link.</p>
              <Link href="/sign-up" className="mt-8 inline-block">
                <Button size="lg" className="h-12 rounded-full bg-primary-foreground px-6 text-primary hover:bg-primary-foreground/90">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-7 text-sm text-muted-foreground lg:px-10">
          <span className="font-black tracking-tight text-foreground">LINKIO</span>
          <span>Links that work harder.</span>
        </div>
      </footer>
    </div>
  )
}
