// Turns an audit log row into a sentence such as: Renamed "Logo Design" to "Logo & Brand Design".

export const ACTION_LABELS = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  REORDER: 'Reordered',
  LOGIN: 'Logged in',
  LOGOUT: 'Logged out',
  LOGIN_FAILED: 'Failed login',
  INVITE: 'Invited admin',
  REVOKE_INVITE: 'Cancelled invitation',
  ACCEPT_INVITE: 'Joined',
  RESET_LINK: 'Reset link sent',
  PASSWORD_RESET: 'Password reset',
};

export const ENTITY_LABELS = {
  ServiceCategory: 'Category',
  ServiceItem: 'Item',
  Admin: 'Admin',
};

export const FIELD_LABELS = {
  title: 'Title',
  slug: 'Slug (web address)',
  description: 'Description',
  icon: 'Icon',
  isVisible: 'Visible on website',
  sortOrder: 'Position',
  deletedAt: 'Deleted at',
  category: 'Category',
  name: 'Name',
  email: 'Email',
  isActive: 'Can log in',
  expiresAt: 'Link expires',
};

const quoted = (text) => `“${text}”`;

function where(log, record) {
  return log.entityType === 'ServiceItem' && record?.category ? ` in ${record.category}` : '';
}

export function describeLog(log) {
  const { action, before, after } = log;
  const record = after ?? before;
  const noun = log.entityType === 'ServiceCategory' ? 'category ' : '';

  switch (action) {
    case 'LOGIN':
      return 'Logged in';
    case 'LOGOUT':
      return 'Logged out';
    case 'LOGIN_FAILED':
      return `Failed login attempt for ${log.adminEmail}`;
    case 'INVITE':
      return `Invited ${record.name} (${record.email}) to be an admin`;
    case 'REVOKE_INVITE':
      return `Cancelled the invitation for ${record.email}`;
    case 'ACCEPT_INVITE':
      return `${record.name} accepted the invitation and created their account`;
    case 'RESET_LINK':
      return `Created a password reset link for ${record.name}`;
    case 'PASSWORD_RESET':
      return 'Set a new password using a reset link';
    case 'CREATE':
      if (log.entityType === 'Admin') return `Registered admin account for ${record.email}`;
      return `Added ${noun}${quoted(record.title)}${where(log, record)}`;
    case 'DELETE':
      return `Deleted ${noun}${quoted(record.title)}${where(log, record)}`;
    case 'REORDER':
      return log.entityType === 'ServiceCategory'
        ? 'Changed the order of the categories'
        : `Changed the order of the items in ${record?.category ?? 'a category'}`;
    case 'UPDATE':
      return describeUpdate(log);
    default:
      return ACTION_LABELS[action] ?? action;
  }
}

function describeUpdate(log) {
  const { before, after } = log;
  if (log.entityType === 'Admin') {
    return after.isActive ? `Reactivated ${after.name}’s account` : `Deactivated ${after.name}’s account`;
  }
  const parts = [];
  if (before.title !== after.title) parts.push(`Renamed ${quoted(before.title)} to ${quoted(after.title)}`);
  if (before.isVisible !== after.isVisible) {
    const verb = after.isVisible ? 'Showed' : 'Hid';
    parts.push(parts.length ? `${verb.toLowerCase()} it` : `${verb} ${quoted(after.title)}`);
  }
  const others = ['slug', 'description', 'icon']
    .filter((field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]))
    .map((field) => (field === 'slug' ? 'web address' : FIELD_LABELS[field].toLowerCase()));
  if (others.length) {
    const list = others.join(' and ');
    parts.push(parts.length ? `changed its ${list}` : `Changed the ${list} of ${quoted(after.title)}`);
  }
  const sentence = parts.length ? parts.join(', ') : `Updated ${quoted(after.title)}`;
  return sentence + where(log, after);
}

// Rows for the details table: every field in before or after, with whether it changed.
export function changeRows(log) {
  const before = log.before ?? {};
  const after = log.after ?? {};
  return Object.keys(FIELD_LABELS)
    .filter((field) => field in before || field in after)
    .map((field) => ({
      field,
      label: FIELD_LABELS[field],
      before: formatValue(field, before[field], field in before),
      after: formatValue(field, after[field], field in after),
      changed: JSON.stringify(before[field]) !== JSON.stringify(after[field]),
    }));
}

function formatValue(field, value, present) {
  if (!present) return '—';
  if (value === null || value === undefined || value === '') return '(empty)';
  if (field === 'isVisible' || field === 'isActive') return value ? 'Yes' : 'No';
  if (field === 'sortOrder') return String(value + 1);
  if (field === 'deletedAt' || field === 'expiresAt') return formatDate(value);
  return String(value);
}

export function formatDate(value) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
