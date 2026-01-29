/**
 * Vercel serverless handler: runs Express API for all /api/* routes.
 * Backend must be built first (npm run build:all).
 */
// @ts-expect-error - backend dist emitted at build time
import app, { initDatabase } from '../backend/dist/server.js';

await initDatabase();

export default app;
