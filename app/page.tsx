import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Lock, Zap, QrCode, Clock, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text">
            Linkio
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Shorten Your URLs,
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Amplify Your Reach
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create branded short links with powerful analytics. Track every click, understand your audience, and optimize your campaigns in real-time.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to create, track, and optimize your links
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Link Creation</h3>
              <p className="text-muted-foreground">Create short, memorable links in seconds. Add custom aliases or let us generate them for you.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">Track clicks, visitors, devices, locations, and more with beautiful dashboards and insights.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Code Generation</h3>
              <p className="text-muted-foreground">Generate QR codes for your shortened links instantly. Perfect for offline marketing.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Protection</h3>
              <p className="text-muted-foreground">Protect sensitive links with passwords. Control who can access your content.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Link Expiration</h3>
              <p className="text-muted-foreground">Set expiration dates or click limits. Keep your links relevant and secure.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border bg-background/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">Bank-level encryption, SSL/TLS, and compliance with industry standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to shorten your links?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of marketers and creators using Linkio to drive engagement and track results.</p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started for Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Linkio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
