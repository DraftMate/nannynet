// src/app/api/auth/register/route.ts
import { db } from '@/drizzle/db';
import { NannyTable, AuthTable } from '@/drizzle/schema';
import { NextResponse, NextRequest } from 'next/server';
import { hashPassword } from '@/lib/hash-password';
import { createAccessToken, createRefreshToken} from '@/lib/auth';
import BaseError from '@/lib/base-error'

type RegisterInput = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  yearsOfExperience: number
}

export async function POST(request: NextRequest) {
  let body: { 
    email?: string | undefined,
    password?: string | undefined,
    firstName?: string | undefined,
    lastName?: string | undefined,
    yearsOfExperience?: number | undefined
   }
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'body is not json' }, 
      { status: 400 }
    );
  }

  // validate input
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
  if (typeof body.firstName != 'string') {
    return NextResponse.json(
      { error: 'firstName must be string' }, 
      { status: 400 }
    );
  }
  if (typeof body.lastName != 'string') {
    return NextResponse.json(
      { error: 'lastName must be string' }, 
      { status: 400 }
    );
  }
  if (typeof body.yearsOfExperience != 'number') {
    return NextResponse.json(
      { error: 'yearsOfExperience must be number' }, 
      { status: 400 }
    );
  }

  try {
    const input = body as RegisterInput
    const hashedPassword = await hashPassword(input.password)

    const [newNanny] = await db
      .insert(NannyTable)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
        yearsOfExperience: input.yearsOfExperience
      })
      .returning()
      .catch(err => {
        if (err.code === '23505') {
          throw BaseError.wrap(err, 'email already exists', { input, status: 400 })
        }
        console.log(err)
        throw BaseError.wrap(err, 'failed to insert nanny', { input, status: 500 })
      });

    const accessToken = createAccessToken({
      userId: newNanny.id,
      userEmail: newNanny.email,
      version: 1 //TODO: versioning
    })
    const refreshToken = createRefreshToken({
      userId: newNanny.id, 
      userEmail: newNanny.email,
      version: 1 //TODO: versioning
    })

    await db.insert(AuthTable).values({
      nannyId: newNanny.id,
      email: newNanny.email,
      refreshTokenVersion: 1, //TODO: versioning
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      createdAt: new Date(),
      lastUsedAt: new Date(),
      isRevoked: false
    }).catch(err => {
      console.log(err)
      throw BaseError.wrap(err, 'failed to insert auth for nanny', { input, status: 500 })
    });

    return NextResponse.json({
      nanny: newNanny,
      accessToken,
      refreshToken
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating nanny:', err);
    return NextResponse.json(
      { error: err instanceof BaseError ? err.message : 'Failed to create nanny' }, 
      { status: err.status ?? 500 }
    );
  }
}
