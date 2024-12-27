// src/app/api/auth/login/route.ts
import { db } from '@/drizzle/db';
import { NannyTable } from '@/drizzle/schema';
import { NextResponse, NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/hash-password';
import { RequestWithContext } from '@/lib/types/request';

export async function POST(request: RequestWithContext) {
    let body: {
        email?: string | undefined,
        password?: string | undefined
    }
    
    try {
        body = await request.json()
    } catch(err) {
        return NextResponse.json(
            { error: 'body is not json' }, 
            { status: 400 }
        );
    }

    if (typeof body.email != 'string') {
        return NextResponse.json(
          { error: 'email must be string' }, 
          { status: 400 }
        );
    }
 
    if (typeof body.password != 'string') {
        return NextResponse.json(
            { error: 'password must be string' }, 
            { status: 400 }
        );
    }
    try {
    const nanny = await db
    .select()
    .from(NannyTable)
    .where(eq(NannyTable.email, body.email))
    .limit(1)
        //verify password with hashed password in DB
        const result = await verifyPassword(body.password, nanny[0].password)
        if(result)  {
            console.log("made it!")
            return NextResponse.json(true, {status: 201})
        } else {
            return NextResponse.json(false, {status: 401})
        }
          
    }
    catch(err) {
        return NextResponse.json({error: 'Incorrect email or password, please try again.'}, {status: 401})
    }
}

