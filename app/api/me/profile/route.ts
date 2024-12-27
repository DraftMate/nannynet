// src/app/api/me/route.ts
//This is home page for logged in user
import { db } from '@/drizzle/db';
import { NannyTable, } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/hash-password';
import { checkAuth } from '@/lib/middleware/middlewareAuth';
import { RequestWithContext } from '@/lib/types/request';
import {eq} from 'drizzle-orm';
// Get nanny by Request Context
export async function GET(request: RequestWithContext) {
  const tokenPayLoad = await checkAuth(request)
  try {
    console.log("This is payload", tokenPayLoad)
    console.log(request.context)
    const nannies = await db.select()
    .from(NannyTable)
    .where(eq(NannyTable.id, request.context.userId))
    .limit(1);

    return NextResponse.json(nannies);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nannies' }, 
      { status: 500 }
    );
  }
}
