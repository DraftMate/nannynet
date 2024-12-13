// src/app/api/auth/register/route.ts
import { db } from '@/drizzle/db';
import { NannyTable, AuthTable } from '@/drizzle/schema';
import {eq} from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { createAccessToken, createRefreshToken} from '@/lib/auth';

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    const id = params.id
  try {
    const refreshToken = await db
        .select()
        .from(AuthTable)
        .where(eq(AuthTable.nannyId, id));
    
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve refresh token for nanny' }, 
      { status: 401 }
    );
  }
}
