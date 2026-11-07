import { z } from 'zod';

// Settings come from the environment and are checked once at startup, so a missing secret fails loudly.
const schema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SITE_ORIGIN: z.string().default('http://localhost:5174'),
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  // How many admins can have access at once (active accounts plus open invitations).
  MAX_ADMINS: z.coerce.number().int().min(1).default(2),
});

export function loadConfig(env = process.env) {
  const result = schema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid server configuration:\n${problems}`);
  }
  const values = result.data;
  return {
    port: values.PORT,
    jwtSecret: values.JWT_SECRET,
    siteOrigins: values.SITE_ORIGIN.split(',').map((origin) => origin.trim().replace(/\/$/, '')),
    trustProxy: values.TRUST_PROXY,
    maxAdmins: values.MAX_ADMINS,
    // Browsers only send Secure cookies over HTTPS, and Safari also refuses them on http://localhost.
    cookieSecure: values.NODE_ENV === 'production',
  };
}
