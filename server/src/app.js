import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { requireAdmin } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errors.js';
import { adminsRouter } from './routes/admin-admins.js';
import { auditLogsRouter } from './routes/admin-audit-logs.js';
import { categoriesRouter } from './routes/admin-categories.js';
import { authRouter } from './routes/auth.js';
import { publicServicesRouter } from './routes/public-services.js';

export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  // Behind Render's proxy this makes req.ip the visitor's address, for rate limiting and the audit log.
  app.set('trust proxy', config.trustProxy);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || config.siteOrigins.includes(origin)),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRouter(config));
  app.use('/api/services', publicServicesRouter());

  const admin = express.Router();
  admin.use(requireAdmin(config));
  admin.use('/categories', categoriesRouter());
  admin.use('/audit-logs', auditLogsRouter());
  admin.use('/admins', adminsRouter(config));
  app.use('/api/admin', admin);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
