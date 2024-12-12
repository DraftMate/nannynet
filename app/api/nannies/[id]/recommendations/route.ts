// src/app/api/nannies/[id]/recommendations/route.ts
import { db } from '@/drizzle/db';
import { Recommendations } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// Get recommendations by nanny ID
export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const nannyId = params.id

    let recommendations;
    if (nannyId) {
      recommendations = await db
        .select()
        .from(Recommendations)
        .where(eq(Recommendations.nannyId, nannyId));
    } else {
      return NextResponse.json({ error: 'Nanny ID not provided' }, { status: 400 });
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

