// middleware.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { RequestWithContext } from '@/lib/types/request';
import { verifyToken } from '@/lib/auth';

export async function checkAuth(request: NextRequest) {
  const req = request as RequestWithContext;
  
  req.context = {
    userId: '',
    userEmail: '',
    isAuthorized: false
  };

  // Validate authentication
  const headersList = await headers();
    const accessToken = headersList.get('authorization')?.split(' ')[1];
    console.log(accessToken)
  if (accessToken) {
    // Verify token and set context
    let tokenPayload = verifyToken(accessToken, false)
    if(!tokenPayload?.userId) {
      return NextResponse.json( {
        error: "Not authorized"
      }, {status: 401} )
    }
    if(!tokenPayload.userEmail) {
      return NextResponse.json( {
          error: "User not found"
      }, {status: 401})
    }
    if(!tokenPayload.isAuthorized) {
      return NextResponse.json( {
          error: "User email not found"
      }, {status: 401})
    }
    if(tokenPayload != null) {
        req.context.userId = tokenPayload.userId; // Get from token verification
        req.context.userEmail = tokenPayload.userEmail;
        req.context.isAuthorized = true
    } 
    console.log('payload after calling middleware', tokenPayload)
    console.log(req.context)
    
  } else {
    return NextResponse.json( {
        error: "No Access Token" }, {status: 401}
    )
  }

  return NextResponse.next();
}
