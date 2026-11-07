import { z } from 'zod';

export const id = z.uuid('Invalid id.');
export const idParams = z.object({ id });
export const itemParams = z.object({ id, itemId: id });

const slug = z
  .string()
  .trim()
  .min(1, 'Slug is required.')
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only.');

const title = z.string().trim().min(1, 'Title is required.').max(120);

export const categoryInput = z.object({
  title,
  slug,
  description: z.string().trim().max(300).default(''),
  // A key from the site's icon list (components/Icon.jsx), e.g. "briefcase".
  icon: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]{1,40}$/, 'Choose an icon.'),
  isVisible: z.boolean().default(true),
});

export const itemInput = z.object({
  title,
  slug,
  isVisible: z.boolean().default(true),
});

export const reorderInput = z.object({
  ids: z.array(id).min(1).max(500),
});

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().max(254),
  // bcrypt only reads the first 72 bytes; longer values are rejected rather than silently cut.
  password: z.string().min(1).max(72),
});

const name = z.string().trim().min(1, 'Please enter a name.').max(80);
// Trimmed and lowercased before the format check, so a pasted email with spaces still works.
const email = z.string().trim().toLowerCase().max(254).pipe(z.email('Please enter a valid email address.'));
const newPassword = z.string().min(12, 'Use at least 12 characters.').max(72, 'Use 72 characters or fewer.');
const token = z.string().trim().min(20, 'This link is not valid.').max(100, 'This link is not valid.');

export const inviteInput = z.object({ name, email });
export const tokenQuery = z.object({ token });
export const acceptInput = z.object({ token, name: name.optional(), password: newPassword });
export const adminStatusInput = z.object({ isActive: z.boolean() });

const actions = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'REORDER',
  'LOGIN',
  'LOGOUT',
  'LOGIN_FAILED',
  'INVITE',
  'REVOKE_INVITE',
  'ACCEPT_INVITE',
  'RESET_LINK',
  'PASSWORD_RESET',
];
const entities = ['ServiceCategory', 'ServiceItem', 'Admin'];
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.');

export const auditQuery = z.object({
  adminId: id.optional(),
  action: z.enum(actions).optional(),
  entityType: z.enum(entities).optional(),
  from: dateOnly.optional(),
  to: dateOnly.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
