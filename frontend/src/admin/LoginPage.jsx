import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { useAuth } from '../context/auth.js';
import { company } from '../data/company.js';

export default function LoginPage() {
  const { admin, status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const destination = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin';
  if (status === 'ready' && admin && !submitting) return <Navigate to={destination} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <PageMeta title="Admin login" noIndex />
      <div className="admin-login__card">
        <Link to="/" className="admin-login__brand">
          <img src={logo} alt={company.name} width="192" height="48" />
        </Link>
        <h1>Admin login</h1>
        <p className="admin-login__intro">For {company.name} staff only.</p>

        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <div className="password-input">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
                required
              />
              <button
                type="button"
                className="password-input__toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-controls="admin-password"
                onClick={() => setShowPassword((current) => !current)}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} />
              </button>
            </div>
          </div>
          <button type="submit" className="button button--primary button--block" disabled={submitting}>
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="admin-login__switch">
          New admin? Ask an existing admin to send you an invitation link. Forgot your password? Ask the other admin for
          a reset link.
        </p>

        <Link to="/" className="admin-login__back">
          <Icon name="arrowLeft" size={16} /> Back to the website
        </Link>
      </div>
    </main>
  );
}
