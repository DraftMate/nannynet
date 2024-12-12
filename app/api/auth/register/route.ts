// src/app/api/auth/register/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextResponse, NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/hash-password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hashedPassword = await hashPassword(body.password)

    const newNanny = await db
      .insert(NannyTable)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        yearsOfExperience: body.yearsOfExperience
      })
      .returning();
      
    console.log(newNanny)
    return NextResponse.json(newNanny[0], { status: 201 });
  } catch (error) {
    console.error('Error creating nanny:', error);
    return NextResponse.json(
      { error: 'Failed to create nanny' }, 
      { status: 500 }
    );
  }
}
