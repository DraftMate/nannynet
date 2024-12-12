import { sign, verify, decode, JwtPayload } from 'jsonwebtoken';
const ACCESS_SECRET_KEY = process.env.ACESS_SECRET_KEY as string;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;

interface TokenPayload extends JwtPayload {
    userId: string,
    userEmail: string,
    version: number
}
//create Access and Refresh Token
export const createAccessToken = (payLoad: TokenPayload) => {
    return sign(payLoad, ACCESS_SECRET_KEY, {
        expiresIn: '15m',
        algorithm: 'HS256',
      //  audience: JWT_AUDIENCE,
      //  issuer: JWT_ISSUER
    })
}

export const createRefreshToken = (payLoad: TokenPayload) => {
    return sign(payLoad, REFRESH_SECRET_KEY, {
        expiresIn: '7d',
        algorithm: 'HS256',
       // audience: JWT_AUDIENCE,
       // issuer: JWT_ISSUER
    })
}
export const verifyToken = (token: string, isRefreshToken: boolean) => {
    try {
        const secret = isRefreshToken ? REFRESH_SECRET_KEY : ACCESS_SECRET_KEY;
        const decoded = verify(token, secret, {
            algorithms: ['HS256'],
            
        }) as TokenPayload
        return decoded
    }
    catch (error) {
        console.log("Unable to verify token")
        return null;
    }
}