// src/app/api/nannies/[id]/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// Get nanny by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // Convert the ID to a number if your database uses numeric IDs
      const nannyId = Number(params.id);
  
      // Query for a specific nanny by ID
      const nanny = await db
        .select()
        .from(NannyTable)
        .where(eq(NannyTable.id, nannyId))
        .limit(1);
  
      // Check if nanny exists
      if (nanny.length === 0) {
        return NextResponse.json(
          { error: 'Nanny not found' }, 
          { status: 404 }
        );
      }
  
      return NextResponse.json(nanny[0], { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch nanny', details: error }, 
        { status: 500 }
      );
    }
  }

