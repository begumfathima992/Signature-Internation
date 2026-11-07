// Writes one AuditLog row. Pass the transaction client (tx) so the log and the change it records
// are saved together or not at all.
export function writeAudit(tx, req, { admin, adminEmail, action, entityType, entityId, before, after }) {
  return tx.auditLog.create({
    data: {
      adminId: admin?.id ?? null,
      adminEmail: admin?.email ?? adminEmail,
      action,
      entityType,
      entityId,
      before: before ?? undefined,
      after: after ?? undefined,
      ipAddress: req.ip ?? null,
      userAgent: req.get('user-agent')?.slice(0, 500) ?? null,
    },
  });
}

const CATEGORY_FIELDS = ['slug', 'title', 'description', 'icon', 'sortOrder', 'isVisible', 'deletedAt'];
const ITEM_FIELDS = ['categoryId', 'slug', 'title', 'sortOrder', 'isVisible', 'deletedAt'];

function pick(record, fields) {
  return Object.fromEntries(fields.map((field) => [field, record[field]]));
}

export const categorySnapshot = (category) => pick(category, CATEGORY_FIELDS);
// Item entries also record the category's title, so the activity log can name it.
export const itemSnapshot = (item, category) => ({ ...pick(item, ITEM_FIELDS), category: category.title });

// True when any field the admin can edit is different.
export function hasChanges(before, after) {
  return Object.keys(after).some((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
}
