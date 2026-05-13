import { SignJWT, jwtVerify } from 'jose';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface PreviewTokenPayload {
  sub: string;
  inv: string;
  jti: string;
  exp: number;
  kind: 'preview';
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
  if ((payload as { kind?: string }).kind === 'preview') {
    throw new Error('Wrong token kind');
  }
  return payload as unknown as JwtPayload;
}

export async function signPreviewToken(args: { invitationId: string; ownerId: string }): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({ inv: args.invitationId, sub: args.ownerId, jti, kind: 'preview' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(getSecret());
}

export async function verifyPreviewToken(token: string): Promise<PreviewTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  if ((payload as { kind?: string }).kind !== 'preview') {
    throw new Error('Wrong token kind');
  }
  if (typeof (payload as { jti?: unknown }).jti !== 'string') {
    throw new Error('Missing jti');
  }
  if (typeof (payload as { exp?: unknown }).exp !== 'number') {
    throw new Error('Missing exp');
  }
  return payload as unknown as PreviewTokenPayload;
}
