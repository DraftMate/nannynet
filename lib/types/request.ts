import { NextRequest } from "next/server"
type AuthContext = {
    userId: string,
    userEmail: string,
    version: number,
    isAuthorized: boolean
}

export interface RequestWithContext extends NextRequest {
    context: AuthContext
}

