// src/app/api/me/work-history/route.ts
import { db } from '@/drizzle/db';
import { WorkHistory } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import {RequestWithContext} from '@/lib/types/request';
import { eq } from 'drizzle-orm';

// Get work history by Request Context
export async function GET(request: RequestWithContext) {
    if(!request.context.isAuthorized) {
        return NextResponse.json( {
          error: "Not authorized"
        }, {status: 401} )
      }
      if(!request.context.userId) {
        return NextResponse.json( {
            error: "User not found"
        }, {status: 401})
      }
      if(!request.context.userEmail) {
        return NextResponse.json( {
            error: "User email not found"
        }, {status: 401})
      }
    try {
    const nannyId = request.context.userId

    let workHistories;
    if (nannyId) {
      workHistories = await db
        .select()
        .from(WorkHistory)
        .where(eq(WorkHistory.nannyId, nannyId));
    } else {
      return NextResponse.json({ error: '' }, { status: 400 });
    }

    return NextResponse.json(workHistories);
  } catch (error) {
    console.error('Error fetching workHistories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workHistories' }, 
      { status: 500 }
    );
  }
}

