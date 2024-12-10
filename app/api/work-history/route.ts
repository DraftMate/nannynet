// src/app/api/work-history/route.ts
import { db } from '../../../drizzle/db';
import { WorkHistory } from '../../../drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Optional: filter by nannyId if provided as a query parameter
    const { searchParams } = new URL(request.url);
    const nannyId = searchParams.get('nannyId');

    let workHistories;
    if (nannyId != null) {
      workHistories = await db
        .select()
        .from(WorkHistory)
        .where(eq(WorkHistory.nannyId, parseInt(nannyId)));
    } else {
      throw new Error('Nanny ID is required')
    }

    return NextResponse.json(workHistories);
  } catch (error) {
    console.error('Error fetching work histories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work histories' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newWorkHistory = await db
      .insert(WorkHistory)
      .values({
        nannyId: body.nannyId,
        jobTitle: body.jobTitle,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate
      })
      .returning();

    return NextResponse.json(newWorkHistory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating work history:', error);
    return NextResponse.json(
      { error: 'Failed to create work history' }, 
      { status: 500 }
    );
  }
}