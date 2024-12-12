import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  index,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
 
export const NannyTable = pgTable(
  'nanny',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    yearsOfExperience: serial('yearsOfExperience').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (nanny) => {
    return {
      nameIdx: uniqueIndex('nameIdx').on(nanny.firstName),
    };
  },
);

export const WorkHistory = pgTable(
  'workHistory',
  {
    id: serial('id').primaryKey(),
    nannyId: uuid('nannyId').notNull(),
    jobTitle: text('jobTitle').notNull(),
    description: text('description'),
    startDate: timestamp('startDate').notNull(),
    endDate: timestamp('endDate'),
  },
  (workHistory) => {
    return {
      nannyWorkHistoryIdx: index('nannyWorkHistoryIdx').on(workHistory.nannyId),
    };
  },
);

export const Recommendations = pgTable(
  'recommendations',
  
  {
    id: serial('id').primaryKey(),
    nannyId: uuid('nannyId').notNull(),
    customerName: text('customerName').notNull(),
    customerEmail: text('customerEmail').notNull(),
    text: text('text').notNull(),
    rating: serial('rating').notNull(),
  },
  (recommendations) => {
    return {
      nannyRecommendationsIdx: index('nannyRecommendationsIdx').on(recommendations.nannyId)
    };
  }
);

export const AuthTable = pgTable(
  'auth',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    nannyId: uuid('id').notNull().references(() => NannyTable.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    refreshTokenVersion: integer('refreshTokenVersion').notNull(),
    refreshToken: text('refreshToken').notNull(),
    expiresAt: timestamp('expirationDate').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    lastUsedAt: timestamp('lastUsedAt').notNull(),
    isRevoked: boolean('isRevoked').notNull(),
  },
  (auth) => {
    return {
      nannyIdIdx: index('nannyIdIdx').on(auth.nannyId)
    }
  }
)
