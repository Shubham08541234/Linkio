import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  date,
  unique
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables: URL Shortener -----------------------------------------------

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  shortCode: text('shortCode').notNull().unique(),
  originalUrl: text('originalUrl').notNull(),
  customAlias: text('customAlias'),
  title: text('title'),
  description: text('description'),
  password: text('password'),
  expiresAt: timestamp('expiresAt'),
  maxClicks: integer('maxClicks'),
  clicks: integer('clicks').notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  urlId: integer('urlId').notNull(),
  userId: text('userId').notNull(),

  visitorId: text('visitorId').notNull(),
  
  referrer: text('referrer'),
  userAgent: text('userAgent'),
  ipAddress: text('ipAddress'),
  country: text('country'),
  city: text('city'),
  browser: text('browser'),
  browserVersion: text('browserVersion'),
  os: text('os'),
  osVersion: text('osVersion'),
  device: text('device'),
  deviceType: text('deviceType'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const dailyStats = pgTable('dailyStats', {
  id: serial('id').primaryKey(),
  urlId: integer('urlId').notNull(),
  userId: text('userId').notNull(),
  date: date('date').notNull(),
  clicks: integer('clicks').notNull().default(0),
  uniqueVisitors: integer('uniqueVisitors').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
},
(table) => ([
    unique().on(table.urlId, table.date),
  ])
)
