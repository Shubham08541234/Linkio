import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 15, // 15 minutes for token expiry
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log('🔔 sendVerificationEmail fired for:', user.email)
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to verify your email address:</p>
          <p><a href="${url}">Verify email</a></p>
          <p>If you didn't create an account, you can ignore this email.</p>
        `,
      })
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})