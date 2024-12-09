import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { start } from 'repl';
 
export const db = drizzle(sql);

export const NannyTable = pgTable(
  'nanny',
  {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull(),
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
    nannyId: serial('nannyId').notNull(),
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
    nannyId: serial('nannyId').notNull(),
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
