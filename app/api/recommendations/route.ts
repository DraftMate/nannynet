// src/app/api/recommendations/route.ts
import { db } from '../../../drizzle/db';
import { Recommendations } from '../../../drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecommendation = await db
      .insert(Recommendations)
      .values({
        nannyId: body.nannyId,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        text: body.text,
        rating: body.rating
      })
      .returning();

    return NextResponse.json(newRecommendation[0], { status: 201 });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to create recommendation' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Optional: filter by nannyId if provided as a query parameter
    const { searchParams } = new URL(request.url);
    const nannyId = searchParams.get('nannyId');

    let recommendations;
    if (nannyId) {
      recommendations = await db
        .select()
        .from(Recommendations)
        .where(eq(Recommendations.nannyId, parseInt(nannyId)));
    } else {
      recommendations = await db.select().from(Recommendations);
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