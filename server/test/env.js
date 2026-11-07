import { userInfo } from 'node:os';

// Tests use their own database because they wipe it. Override with TEST_DATABASE_URL if needed.
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || `postgresql://${userInfo().username}@localhost:5432/signature_test`;

if (!new URL(TEST_DATABASE_URL).pathname.includes('test')) {
  throw new Error('Refusing to run: the test database name must contain "test", because the tests delete its data.');
}

process.env.DATABASE_URL = TEST_DATABASE_URL;
