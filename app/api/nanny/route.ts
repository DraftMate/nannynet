// src/app/api/nannies/route.ts
import { db } from '../../../drizzle/db';
import { NannyTable } from '../../../drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const nannies = await db.select().from(NannyTable);
    return NextResponse.json(nannies);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nannies' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newNanny = await db
      .insert(NannyTable)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        yearsOfExperience: body.yearsOfExperience
      })
      .returning();

    return NextResponse.json(newNanny[0], { status: 201 });
  } catch (error) {
    console.error('Error creating nanny:', error);
    return NextResponse.json(
      { error: 'Failed to create nanny' }, 
      { status: 500 }
    );
  }
}

