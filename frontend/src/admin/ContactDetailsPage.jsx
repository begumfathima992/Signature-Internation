import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { formatPhone } from '../context/contact.js';
import PageMeta from '../components/PageMeta.jsx';
import { useToast } from './toast.js';
import { useAdminRequest } from './useAdminRequest.js';

const URL = '/api/admin/contact-details';
const MAX_HOURS_ROWS = 7;

// Form values: the address is edited as one line per row in a text box.
const toForm = (contact) => ({ ...contact, address: contact.address.join('\n') });
const toPayload = (values) => ({
  ...values,
  address: values.address.split('\n').map((line) => line.trim()),
  hours: values.hours.map((row) => ({ days: row.days.trim(), time: row.time.trim() })),
});

// The email, phone, WhatsApp, address and opening hours shown on the Contact page, footer and menu.
export default function ContactDetailsPage() {
  const request = useAdminRequest();
  const toast = useToast();
  const [saved, setSaved] = useState(null);
  const [values, setValues] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { contact } = await request(URL);
      setSaved(toForm(contact));
      setValues(toForm(contact));
      setStatus('ready');
    } catch (error) {
      if (error.status !== 401) setStatus('error');
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const changed = values && saved && JSON.stringify(values) !== JSON.stringify(saved);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  }

  function updateHours(index, field, value) {
    setValues((current) => ({
      ...current,
      hours: current.hours.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
    setErrors((current) => ({ ...current, [`hours.${index}.${field}`]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const { contact } = await request(URL, { method: 'PUT', body: toPayload(values) });
      setSaved(toForm(contact));
      setValues(toForm(contact));
      setErrors({});
      toast.success('Contact details saved. The website shows them straight away.');
    } catch (error) {
      setErrors(Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message])));
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const fieldProps = (name, hint) => ({
    id: `contact-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby':
      [hint && `contact-${name}-hint`, errors[name] && `contact-${name}-error`].filter(Boolean).join(' ') || undefined,
  });
  const hint = (name, text) => (
    <p id={`contact-${name}-hint`} className="field__hint">
      {text}
    </p>
  );
  const error = (name) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="field__error">
        {errors[name]}
      </p>
    );

  return (
    <>
      <PageMeta title="Contact details | Admin" noIndex />
      <div className="admin-page-header">
        <div>
          <h1>Contact details</h1>
          <p>Shown on the Contact page, in the footer and in the mobile menu. Changes appear straight away.</p>
        </div>
      </div>

      {status === 'loading' && (
        <div className="admin-card admin-empty" role="status">
          <span className="spinner" aria-hidden="true" /> Loading…
        </div>
      )}
      {status === 'error' && (
        <div className="admin-card admin-empty" role="alert">
          <p>The contact details could not be loaded.</p>
          <button type="button" className="button button--secondary button--sm" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <form className="admin-card admin-form contact-form-admin" onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="form-alert" role="alert">
              {formError}
            </div>
          )}

          <div className="contact-form-admin__grid">
            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                maxLength={254}
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                {...fieldProps('email')}
              />
              {error('email')}
            </div>
            <div className="field">
              <label htmlFor="contact-phone">Phone</label>
              {hint('phone', `Shown on the website as ${formatPhone(values.phone) || '+44 - 7741919923'}`)}
              <input
                type="tel"
                maxLength={30}
                value={values.phone}
                onChange={(e) => update('phone', e.target.value)}
                {...fieldProps('phone', true)}
              />
              {error('phone')}
            </div>
            <div className="field">
              <label htmlFor="contact-whatsapp">WhatsApp number</label>
              {hint('whatsapp', 'With country code, e.g. 44 7700 900123 (no leading 0)')}
              <input
                type="tel"
                maxLength={30}
                value={values.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                {...fieldProps('whatsapp', true)}
              />
              {error('whatsapp')}
            </div>
            <div className="field">
              <label htmlFor="contact-address">Address</label>
              {hint('address', 'One line per row')}
              <textarea
                rows="4"
                value={values.address}
                onChange={(e) => update('address', e.target.value)}
                {...fieldProps('address', true)}
              />
              {error('address')}
            </div>
          </div>

          <fieldset className="hours-editor">
            <legend>Opening hours</legend>
            {values.hours.length === 0 && <p className="field__hint">No opening hours are shown.</p>}
            {values.hours.map((row, index) => (
              <div key={index} className="hours-editor__row">
                <div className="field">
                  <label htmlFor={`contact-hours.${index}.days`}>Days</label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Monday to Friday"
                    value={row.days}
                    onChange={(e) => updateHours(index, 'days', e.target.value)}
                    {...fieldProps(`hours.${index}.days`)}
                  />
                  {error(`hours.${index}.days`)}
                </div>
                <div className="field">
                  <label htmlFor={`contact-hours.${index}.time`}>Hours</label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="9:00am to 5:30pm, or Closed"
                    value={row.time}
                    onChange={(e) => updateHours(index, 'time', e.target.value)}
                    {...fieldProps(`hours.${index}.time`)}
                  />
                  {error(`hours.${index}.time`)}
                </div>
                <button
                  type="button"
                  className="icon-action icon-action--danger hours-editor__remove"
                  aria-label={`Remove ${row.days || 'this row'}`}
                  title="Remove row"
                  onClick={() =>
                    update(
                      'hours',
                      values.hours.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
            {values.hours.length < MAX_HOURS_ROWS && (
              <button
                type="button"
                className="button button--ghost button--xs"
                onClick={() => update('hours', [...values.hours, { days: '', time: '' }])}
              >
                <Icon name="plus" size={16} /> Add row
              </button>
            )}
          </fieldset>

          <div className="contact-form-admin__actions">
            <button type="submit" className="button button--primary button--sm" disabled={!changed || saving}>
              {saving && <span className="spinner" aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="button button--secondary button--sm"
              disabled={!changed || saving}
              onClick={() => {
                setValues(saved);
                setErrors({});
                setFormError('');
              }}
            >
              Undo changes
            </button>
          </div>
        </form>
      )}
    </>
  );
}
