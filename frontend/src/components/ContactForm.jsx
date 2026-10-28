import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context/site.js';
import { company } from '../data/company.js';
import { services } from '../data/services.js';
import Icon from './Icon.jsx';

const API_URL = import.meta.env.VITE_API_URL;
const MESSAGE_MAX = 2000;
const TIMEOUT_MS = 10000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number, or leave this blank.';
  }
  if (!values.service) errors.service = 'Please choose a service.';
  if (!values.message.trim()) errors.message = 'Please tell us a little about your request.';
  else if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  if (!values.consent) errors.consent = 'Please confirm you agree to be contacted.';
  return errors;
}

async function submitContact(payload) {
  // Mock mode: no backend configured yet, so simulate a successful send.
  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'The request took too long to respond.' };
    }
    return { success: false, message: 'We could not reach our server.' };
  } finally {
    clearTimeout(timer);
  }
}

export default function ContactForm({ initialService = '', topic }) {
  const { openLegal } = useSite();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    message: '',
    consent: false,
    website: '', // honeypot: hidden from real visitors
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverMessage, setServerMessage] = useState('');
  // The topic (a sub-service) only applies while the service it belongs to is still selected.
  const activeTopic = topic && values.service === initialService ? topic : undefined;
  const formRef = useRef(null);
  const successRef = useRef(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function send() {
    if (sendingRef.current) return; // block double submits
    sendingRef.current = true;
    setStatus('sending');
    setServerMessage('');
    const result = await submitContact({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      service: values.service,
      message: values.message.trim(),
      consent: values.consent,
      topic: activeTopic, // optional: omitted from the JSON when undefined
    });
    sendingRef.current = false;
    if (result.success) {
      setStatus('success');
    } else {
      setServerMessage(result.message || '');
      setStatus('error');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      formRef.current.elements[firstInvalid]?.focus();
      return;
    }

    // Bots tend to fill every field; quietly pretend it worked.
    if (values.website) {
      setStatus('success');
      return;
    }
    send();
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <svg className="form-success__icon" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l7 7 15-15" />
        </svg>
        <h2 ref={successRef} tabIndex="-1">
          Thank you{values.name.trim() ? `, ${values.name.trim().split(' ')[0]}` : ''}.
        </h2>
        <p>Your message has been sent. A member of our team will reply within one working day.</p>
      </div>
    );
  }

  const sending = status === 'sending';
  const remaining = MESSAGE_MAX - values.message.length;

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name) =>
    errors[name] && (
      <p className="field__error" id={`${name}-error`}>
        {errors[name]}
      </p>
    );

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={sending}>
      <h2>Send us a message</h2>
      <p className="form-note">
        Fields marked <span className="required">*</span> are required.
      </p>

      {status === 'error' && (
        <div className="form-alert" role="alert">
          <strong>Sorry, your message could not be sent.</strong>
          <p>
            {serverMessage && <>{serverMessage} </>}
            Please try again, or email us at <a href={`mailto:${company.helpEmail}`}>{company.helpEmail}</a>.
          </p>
          <button
            type="button"
            className="button button--secondary button--sm"
            onClick={() => formRef.current.requestSubmit()}
          >
            Try again
          </button>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Full name <span className="required">*</span>
          </label>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
          {fieldError('name')}
        </div>

        <div className="field">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          {fieldError('email')}
        </div>

        <div className="field">
          <label htmlFor="phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
          {fieldError('phone')}
        </div>

        <div className="field">
          <label htmlFor="service">
            Service of interest <span className="required">*</span>
          </label>
          <select {...fieldProps('service')}>
            <option value="">Choose a service…</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {fieldError('service')}
        </div>

        <div className="field field--full">
          <label htmlFor="message">
            Message <span className="required">*</span>
          </label>
          {activeTopic && (
            <p id="message-topic" className="field__topic">
              <Icon name="fileText" size={16} />
              <span>
                Topic: <strong>{activeTopic}</strong>
              </span>
            </p>
          )}
          <textarea
            rows="6"
            maxLength={MESSAGE_MAX}
            placeholder={activeTopic ? `Tell us what you need help with for ${activeTopic}.` : undefined}
            {...fieldProps('message')}
            aria-describedby={[activeTopic && 'message-topic', 'message-count', errors.message && 'message-error']
              .filter(Boolean)
              .join(' ')}
          />
          <div className="field__meta">
            {fieldError('message') || <span />}
            <span id="message-count" className={`field__count${remaining < 100 ? ' is-low' : ''}`}>
              {values.message.length} / {MESSAGE_MAX}
            </span>
          </div>
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input type="text" tabIndex="-1" autoComplete="off" {...fieldProps('website')} />
        </div>

        <div className="field field--full">
          <div className="checkbox">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={values.consent}
              onChange={handleChange}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
            />
            <label htmlFor="consent">
              I agree to be contacted about this request, as described in the{' '}
              <button type="button" className="link-button" onClick={() => openLegal('privacy')}>
                privacy policy
              </button>
              .{' '}
              <span className="required">*</span>
            </label>
          </div>
          {fieldError('consent')}
        </div>
      </div>

      <button type="submit" className="button button--primary button--lg" disabled={sending}>
        {sending && <span className="spinner" aria-hidden="true" />}
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
