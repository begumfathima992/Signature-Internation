// Applies migrations to the test database before the tests run.
import { execSync } from 'node:child_process';
import { TEST_DATABASE_URL } from '../test/env.js';

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
});
