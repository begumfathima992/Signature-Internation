import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.webp';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { useAuth } from '../context/auth.js';
import { company } from '../data/company.js';
import { api } from '../lib/api.js';

const MIN_PASSWORD = 12;

// Opened from an invitation link (new admin sets up their account) or a reset link (choose a new password).
export default function AcceptLinkPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const { acceptLink } = useAuth();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | invalid
  const [invalidMessage, setInvalidMessage] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api(`/api/auth/link?token=${encodeURIComponent(token)}`, { signal: controller.signal })
      .then((data) => {
        setLink(data);
        setName(data.name);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setInvalidMessage(
          error.status === 410 || error.status === 400
            ? 'This link has expired or has already been used.'
            : error.message,
        );
        setStatus('invalid');
      });
    return () => controller.abort();
  }, [token]);

  const isInvite = link?.type === 'INVITE';

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (isInvite && !name.trim()) nextErrors.name = 'Please enter your name.';
    if (password.length < MIN_PASSWORD) nextErrors.password = `Use at least ${MIN_PASSWORD} characters.`;
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await acceptLink({ token, name: isInvite ? name : undefined, password });
      navigate('/admin', { replace: true });
    } catch (error) {
      setErrors(Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message])));
      setFormError(error.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <PageMeta title={isInvite ? 'Set up your admin account' : 'Choose a new password'} noIndex />
      <div className="admin-login__card">
        <Link to="/" className="admin-login__brand">
          <img src={logo} alt={company.name} width="192" height="48" />
        </Link>

        {status === 'loading' && (
          <p className="admin-loading admin-loading--inline" role="status">
            <span className="spinner" aria-hidden="true" /> Checking your link…
          </p>
        )}

        {status === 'invalid' && (
          <>
            <h1>Link not valid</h1>
            <p className="admin-login__intro">
              {invalidMessage} Please ask an admin to send you a new link. Links work once, for 48 hours.
            </p>
            <Link to="/admin/login" className="button button--secondary button--block">
              Go to login
            </Link>
          </>
        )}

        {status === 'ready' && (
          <>
            <h1>{isInvite ? 'Set up your admin account' : 'Choose a new password'}</h1>
            <p className="admin-login__intro">
              {isInvite
                ? `You have been invited to manage the ${company.name} website. Choose a password to finish.`
                : `Choose a new password for ${link.email}.`}
            </p>

            {formError && (
              <div className="form-alert" role="alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {isInvite && (
                <div className="field">
                  <label htmlFor="accept-name">Your name</label>
                  <input
                    id="accept-name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'accept-name-error' : undefined}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <p id="accept-name-error" className="field__error">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <div className="field">
                <label htmlFor="accept-email">Email</label>
                <input id="accept-email" type="email" autoComplete="username" value={link.email} readOnly />
              </div>
              <div className="field">
                <label htmlFor="accept-password">{isInvite ? 'Password' : 'New password'}</label>
                <p id="accept-password-hint" className="field__hint">
                  At least {MIN_PASSWORD} characters.
                </p>
                <div className="password-input">
                  <input
                    id="accept-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={72}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={['accept-password-hint', errors.password && 'accept-password-error']
                      .filter(Boolean)
                      .join(' ')}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="password-input__toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-controls="accept-password"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} />
                  </button>
                </div>
                {errors.password && (
                  <p id="accept-password-error" className="field__error">
                    {errors.password}
                  </p>
                )}
              </div>
              <button type="submit" className="button button--primary button--block" disabled={submitting}>
                {submitting && <span className="spinner" aria-hidden="true" />}
                {submitting ? 'Saving…' : isInvite ? 'Create my account' : 'Save new password'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
