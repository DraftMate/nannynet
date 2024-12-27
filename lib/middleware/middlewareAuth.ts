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
    version: 0,
    isAuthorized: false,
  };

  // Validate authentication
  const headersList = await headers();
    const accessToken = headersList.get('authorization')?.split(' ')[1];
    console.log(accessToken)
  if (accessToken) {
    // Verify token and set context
    let tokenPayload = verifyToken(accessToken, false)
    console.log('this is my tokenPayload from verifyToken', tokenPayload)
    if(!tokenPayload?.userId) {
      return NextResponse.json( {
        error: "No userId found"
      }, {status: 401} )
    }
    if(!tokenPayload.userEmail) {
      return NextResponse.json( {
          error: "No user email found"
      }, {status: 401})
    }
    if(!tokenPayload.version) {
      return NextResponse.json( {
          error: "No version found"
      }, {status: 401})
    }
    if(tokenPayload != null) {
        req.context.userId = tokenPayload.userId; // Get from token verification
        req.context.userEmail = tokenPayload.userEmail;
        req.context.version = tokenPayload.version
        req.context.isAuthorized = true
    } 
    console.log('payload after calling middleware', tokenPayload)
    console.log(req.context)
    return tokenPayload;
  } else {
    return NextResponse.json( {
        error: "No Access Token" }, {status: 401}
    )
  }
}
