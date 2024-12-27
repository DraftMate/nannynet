// src/app/api/auth/route.ts
import { db } from '@/drizzle/db';
import { NannyTable, AuthTable } from '@/drizzle/schema';
import {eq} from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    const id = params.id
  try {
    const refreshToken = await db
        .select()
        .from(AuthTable)
        .where(eq(AuthTable.nannyId, id))
        .limit(1);
    if(refreshToken.length === 0) {
      //return 'Refresh token not found'
      return NextResponse.json('Refresh token not found')
    }
    
    return NextResponse.json(refreshToken, { status: 200});
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve refresh token for nanny' }, 
      { status: 401 }
    );
  }
}
