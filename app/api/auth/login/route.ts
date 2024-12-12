// src/app/api/auth/login/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextResponse, NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/hash-password';
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        // Convert the ID to a number if your database uses numeric IDs
        const nannyEmail = body.email
        const nannyPassword = body.password
      
        console.log(nannyEmail, nannyPassword)
        // Query for a specific nanny by ID
        const nanny = await db
            .select()
            .from(NannyTable)
            .where(eq(NannyTable.email, nannyEmail))
            .limit(1)
        console.log(nanny)
        try {
            //verify password with hashed password in DB
            const result = await verifyPassword(nannyPassword, nanny[0].password)
            if(result)  {
                return NextResponse.json(true, {status: 201}) 
            } else {
                return NextResponse.json(false, {status: 401})
            }
          
        }
        catch(err) {
            return NextResponse.json({error: 'Incorrect email or password, please try again.'}, {status: 401})
        }

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to login nanny', details: error }, 
            { status: 500 }
        );
    }
  }