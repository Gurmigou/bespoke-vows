import { SignJWT, jwtVerify } from 'jose';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(getSecret());
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}
