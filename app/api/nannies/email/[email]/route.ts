// src/app/api/nannies/email/[email]/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/hash-password';

// Get nanny by email
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
      
      if(nanny.length > 0) {
        return NextResponse.json({ error: 'Nanny already exists' }, { status: 400 });
      } else {
        return NextResponse.json(nanny);
      }

    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch nanny', details: error }, 
        { status: 500 }
      );
    }
  }

