// src/app/api/nannies/[id]/work-history/route.ts
import { db } from '@/drizzle/db';
import { WorkHistory } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// Get work history by nanny ID
export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const nannyId = Number(params.id)

    let workHistories;
    if (nannyId) {
        workHistories = await db
        .select()
        .from(WorkHistory)
        .where(eq(WorkHistory.nannyId, nannyId));
    } else {
        return NextResponse.json({ error: 'Nanny ID not provided' }, { status: 400 });
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

