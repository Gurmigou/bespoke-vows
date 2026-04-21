import { cors } from 'hono/cors';

const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:8080';

export const corsMiddleware = cors({
  origin: WEB_ORIGIN,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
});
