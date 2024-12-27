// src/app/api/me/recommendations/route.ts
import { db } from '@/drizzle/db';
import { Recommendations } from '@/drizzle/schema';
import {  NextResponse } from 'next/server';
import {RequestWithContext} from '@/lib/types/request';
import { eq } from 'drizzle-orm';

// Get recommendations by Request Context
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

    let recommendations;
    if (nannyId) {
      recommendations = await db
        .select()
        .from(Recommendations)
        .where(eq(Recommendations.nannyId, nannyId));
    } else {
      return NextResponse.json({ error: '' }, { status: 400 });
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' }, 
      { status: 500 }
    );
  }
}

