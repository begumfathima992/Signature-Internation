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
  // Optional so a request without it (such as Hide/Show) leaves the saved description alone.
  description: z.string().trim().max(300).optional(),
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

const shortText = (label, max) =>
  z.string().trim().min(1, `Please enter ${label}.`).max(max, `Keep it under ${max} characters.`);

export const contactInput = z.object({
  email,
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{6,30}$/, 'Use digits, spaces, brackets and an optional + only, e.g. +44 7741919923.'),
  // Stored as digits only, the form wa.me links need: spaces, + and brackets are removed.
  whatsapp: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8,15}$/, 'Enter the full number with country code, e.g. 44 7946 000000.')),
  address: z
    .array(z.string().trim().max(80, 'Keep each line under 80 characters.'))
    .transform((lines) => lines.filter(Boolean))
    .pipe(z.array(z.string()).min(1, 'Please enter the address.').max(6, 'Use 6 lines or fewer.')),
  hours: z
    .array(z.object({ days: shortText('the days', 40), time: shortText('the times', 40) }))
    .max(7, 'Use 7 rows or fewer.'),
});
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
const entities = ['ServiceCategory', 'ServiceItem', 'Admin', 'ContactDetails'];
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
