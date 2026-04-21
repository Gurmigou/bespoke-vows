import 'dotenv/config';
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors.js';
import { authRoutes } from './routes/auth.js';
import { invitationRoutes, publicInvitationRoutes } from './routes/invitations.js';
import { uploadRoutes } from './routes/upload.js';

const app = new Hono();

app.use('*', corsMiddleware);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/auth', authRoutes);
app.route('/invitations', invitationRoutes);
app.route('/i', publicInvitationRoutes);
app.route('/upload', uploadRoutes);

export default app;
