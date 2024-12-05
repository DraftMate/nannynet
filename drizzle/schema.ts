import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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
      nannyWorkHistoryIdx: uniqueIndex('nannyWorkHistoryIdx').on(workHistory.nannyId),
    };
  },
);

export const Recommandations = pgTable(
  'recommdandations',
  {
    id: serial('id').primaryKey(),
    nannyId: serial('nannyId').notNull(),
    customerName: text('customerName').notNull(),
    customerEmail: text('customerEmail').notNull(),
    text: text('text').notNull(),
    rating: serial('rating').notNull(),
  },
  (recommandations) => {
    return {
      nannyRecommandationIdx: uniqueIndex('nannyRecommandationIdx').on(recommandations.nannyId)
    };
  }
);
