// src/app/api/nannies/[id]/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// Get nanny by ID
export async function GET(
    request: Request,
    { params }: { params: { email: string } }
  ) {
    try {
      // Convert the ID to a number if your database uses numeric IDs
      const nannyEmail = params.email
  
      // Query for a specific nanny by ID
      const nanny = await db
        .select()
        .from(NannyTable)
        .where(eq(NannyTable.email, nannyEmail))
        .limit(1);
        
      return NextResponse.json(nanny, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch nanny', details: error }, 
        { status: 500 }
      );
    }
  }

