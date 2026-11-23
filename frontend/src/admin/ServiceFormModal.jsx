import { cloneElement, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Modal from './Modal.jsx';
import { ICON_CHOICES } from './iconChoices.js';
import { slugify } from './slugify.js';

const emptyCategory = { title: '', slug: '', description: '', icon: 'briefcase', isVisible: true };
const emptyItem = { title: '', slug: '', description: '', isVisible: true };

// Add or edit a category (kind="category") or an item (kind="item"). onSave resolves when saved and
// rejects with the API error, whose field errors are shown next to the fields.
// The parent mounts it only while open, so each opening starts from fresh values.
export default function ServiceFormModal({ kind, initial, categoryTitle, onSave, onClose }) {
  const isCategory = kind === 'category';
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState(() => {
    const base = isCategory ? emptyCategory : emptyItem;
    return initial ? { ...base, ...pickFields(initial, base) } : base;
  });
  // When editing, the slug is left alone unless the admin changes it.
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'title' && !slugTouched) next.slug = slugify(value);
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = 'Title is required.';
    if (!values.slug.trim()) nextErrors.slug = 'Slug is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setFormError('');
    try {
      await onSave(values);
    } catch (error) {
      const fieldErrors = Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message]));
      setErrors(fieldErrors);
      setFormError(error.message);
      setSaving(false);
    }
  }

  const noun = isCategory ? 'category' : 'item';
  const slugChanged = isEdit && values.slug !== initial.slug;
  const formId = `${kind}-form`;

  return (
    <Modal
      open
      onClose={saving ? () => {} : onClose}
      title={isEdit ? `Edit ${noun}` : isCategory ? 'Add category' : `Add item to ${categoryTitle}`}
      footer={
        <>
          <button type="button" className="button button--secondary button--sm" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form={formId} className="button button--primary button--sm" disabled={saving}>
            {saving && <span className="spinner" aria-hidden="true" />}
            {saving ? 'Saving…' : isEdit ? 'Save changes' : `Add ${noun}`}
          </button>
        </>
      }
    >
      <form id={formId} className="admin-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="form-alert" role="alert">
            {formError}
          </div>
        )}

        <Field id={`${kind}-title`} label="Title" error={errors.title}>
          <input
            type="text"
            value={values.title}
            maxLength={120}
            onChange={(event) => update('title', event.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the first field of a dialog the admin just opened
            autoFocus
          />
        </Field>

        <Field
          id={`${kind}-slug`}
          label="Slug"
          hint={`Used in the web address: /services/${isCategory ? '' : '…/'}${values.slug || 'your-slug'}`}
          error={errors.slug}
        >
          <input
            type="text"
            value={values.slug}
            maxLength={80}
            onChange={(event) => {
              setSlugTouched(true);
              update('slug', event.target.value.toLowerCase());
            }}
          />
        </Field>
        {slugChanged && (
          <p className="admin-form__warning" role="note">
            Changing the slug changes this page’s web address, so existing links to it will stop working.
          </p>
        )}

        {!isCategory && (
          <Field
            id="item-description"
            label="Description"
            hint={`One or two short sentences, shown under the title on this item’s page. Leave empty to show “Part of our ${categoryTitle}.”`}
            error={errors.description}
          >
            <textarea
              rows="3"
              maxLength={300}
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
            />
          </Field>
        )}

        {isCategory && (
          <>
            <Field id="category-description" label="Description" hint="One short sentence." error={errors.description}>
              <textarea
                rows="3"
                maxLength={300}
                value={values.description}
                onChange={(event) => update('description', event.target.value)}
              />
            </Field>

            <fieldset className="icon-picker">
              <legend>Icon</legend>
              <div className="icon-picker__grid">
                {ICON_CHOICES.map((name) => (
                  <label key={name} className="icon-picker__option" title={name}>
                    <input
                      type="radio"
                      name="category-icon"
                      value={name}
                      checked={values.icon === name}
                      onChange={() => update('icon', name)}
                    />
                    <span className="icon-picker__tile">
                      <Icon name={name} size={20} />
                      <span className="visually-hidden">{name}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.icon && <p className="field__error">{errors.icon}</p>}
            </fieldset>
          </>
        )}

        <label className="switch">
          <input
            type="checkbox"
            checked={values.isVisible}
            onChange={(event) => update('isVisible', event.target.checked)}
          />
          <span className="switch__track" aria-hidden="true" />
          <span>Visible on the website</span>
        </label>
      </form>
    </Modal>
  );
}

function pickFields(source, base) {
  return Object.fromEntries(Object.keys(base).map((key) => [key, source[key] ?? base[key]]));
}

function Field({ id, label, hint, error, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {cloneElement(children, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
