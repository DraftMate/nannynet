import '@/drizzle/envConfig';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

export const getAllNannies = await db.select().from(schema.NannyTable);

export async function getSelectNanny(nannyId: number) {
    return await db.select().from(schema.NannyTable).where(eq(schema.NannyTable.id, nannyId));
}

export async function getRecommendations(nannyId: number) {
    return await db.select().from(schema.Recommendations).where(eq(schema.Recommendations.nannyId, nannyId));
}

export async function getWorkHistory(nannyId: number) {
    return await db.select().from(schema.WorkHistory).where(eq(schema.WorkHistory.nannyId, nannyId));
}