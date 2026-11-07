import { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageMeta from '../components/PageMeta.jsx';
import { useAuth } from '../context/auth.js';
import { formatDate } from './auditSummary.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import Modal from './Modal.jsx';
import ShareLinkModal from './ShareLinkModal.jsx';
import { useToast } from './toast.js';
import { useAdminRequest } from './useAdminRequest.js';

const ADMINS = '/api/admin/admins';

// Who can log in: invite a new admin, send a password reset link, or deactivate an account.
export default function AdminsPage() {
  const { admin: me } = useAuth();
  const request = useAdminRequest();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { kind, target }

  const load = useCallback(async () => {
    try {
      setData(await request(ADMINS));
      setStatus('ready');
    } catch (error) {
      if (error.status !== 401) setStatus('error');
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  async function createInvite(values) {
    const result = await request(`${ADMINS}/invites`, { method: 'POST', body: values });
    setInviteOpen(false);
    setShareLink({ type: 'INVITE', token: result.token, name: result.invite.name, email: result.invite.email });
    load();
  }

  async function resendInvite(invite) {
    try {
      const result = await request(`${ADMINS}/invites`, {
        method: 'POST',
        body: { name: invite.name, email: invite.email },
      });
      setShareLink({ type: 'INVITE', token: result.token, name: invite.name, email: invite.email });
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function createResetLink(admin) {
    try {
      const result = await request(`${ADMINS}/${admin.id}/reset-link`, { method: 'POST' });
      setShareLink({ type: 'RESET', token: result.token, name: admin.name, email: admin.email });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function confirmAction() {
    const { kind, target } = pendingAction;
    try {
      if (kind === 'cancel') {
        await request(`${ADMINS}/invites/${target.id}`, { method: 'DELETE' });
        toast.success(`Invitation for ${target.email} cancelled.`);
      } else {
        await request(`${ADMINS}/${target.id}`, { method: 'PATCH', body: { isActive: kind === 'reactivate' } });
        toast.success(
          kind === 'reactivate' ? `${target.name} can log in again.` : `${target.name} can no longer log in.`,
        );
      }
      setPendingAction(null);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const full = data && data.placesUsed >= data.maxAdmins;

  return (
    <>
      <PageMeta title="Admins | Admin" noIndex />
      <div className="admin-page-header">
        <div>
          <h1>Admins</h1>
          <p>
            Invite someone to manage the website, send a password reset link, or remove access.
            {data && ` ${data.placesUsed} of ${data.maxAdmins} admin places used.`}
          </p>
        </div>
        <button
          type="button"
          className="button button--primary button--sm"
          onClick={() => setInviteOpen(true)}
          disabled={!data || full}
          aria-describedby={full ? 'admins-full' : undefined}
        >
          <Icon name="plus" size={18} /> Invite admin
        </button>
      </div>
      {full && (
        <p id="admins-full" className="admin-note">
          All {data.maxAdmins} places are taken. To invite someone new, deactivate an admin or cancel an invitation
          first.
        </p>
      )}

      {status === 'loading' && (
        <div className="admin-card admin-empty" role="status">
          <span className="spinner" aria-hidden="true" /> Loading…
        </div>
      )}
      {status === 'error' && (
        <div className="admin-card admin-empty" role="alert">
          <p>The admins could not be loaded.</p>
          <button type="button" className="button button--secondary button--sm" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <section className="admin-card admin-card--flush" aria-labelledby="admins-accounts">
            <h2 id="admins-accounts" className="admin-card__title">
              Accounts
            </h2>
            <ul className="people-list">
              {data.admins.map((admin) => {
                const isMe = admin.id === me.id;
                return (
                  <li key={admin.id} className={`person${admin.isActive ? '' : ' is-hidden'}`}>
                    <span className="person__avatar" aria-hidden="true">
                      {admin.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="person__text">
                      <span className="person__name">
                        {admin.name}
                        {isMe && <span className="badge badge--update">You</span>}
                        {!admin.isActive && <span className="badge badge--muted">Deactivated</span>}
                      </span>
                      <span className="person__meta">
                        {admin.email} ·{' '}
                        {admin.lastLoginAt ? `last login ${formatDate(admin.lastLoginAt)}` : 'never logged in'}
                      </span>
                    </span>
                    {!isMe && (
                      <div className="row-actions">
                        {admin.isActive ? (
                          <>
                            <button
                              type="button"
                              className="button button--secondary button--xs"
                              onClick={() => createResetLink(admin)}
                            >
                              <Icon name="refresh" size={16} /> Reset password
                            </button>
                            <button
                              type="button"
                              className="button button--danger-ghost button--xs"
                              onClick={() => setPendingAction({ kind: 'deactivate', target: admin })}
                            >
                              <Icon name="eyeOff" size={16} /> Deactivate
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="button button--secondary button--xs"
                            onClick={() => setPendingAction({ kind: 'reactivate', target: admin })}
                            disabled={full}
                          >
                            <Icon name="eye" size={16} /> Reactivate
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="admin-card admin-card--flush" aria-labelledby="admins-invites">
            <h2 id="admins-invites" className="admin-card__title">
              Open invitations
            </h2>
            {data.invites.length === 0 ? (
              <p className="admin-card__empty">No open invitations.</p>
            ) : (
              <ul className="people-list">
                {data.invites.map((invite) => (
                  <li key={invite.id} className="person">
                    <span className="person__avatar person__avatar--pending" aria-hidden="true">
                      <Icon name="mail" size={16} />
                    </span>
                    <span className="person__text">
                      <span className="person__name">{invite.name}</span>
                      <span className="person__meta">
                        {invite.email} · link expires {formatDate(invite.expiresAt)}
                      </span>
                    </span>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="button button--secondary button--xs"
                        onClick={() => resendInvite(invite)}
                      >
                        <Icon name="refresh" size={16} /> New link
                      </button>
                      <button
                        type="button"
                        className="button button--danger-ghost button--xs"
                        onClick={() => setPendingAction({ kind: 'cancel', target: invite })}
                      >
                        <Icon name="close" size={16} /> Cancel
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="admin-help">
            <Icon name="lightbulb" size={16} /> Forgot your own password? Ask the other admin to send you a reset link
            from this page.
          </p>
        </>
      )}

      {inviteOpen && <InviteModal onSave={createInvite} onClose={() => setInviteOpen(false)} />}
      {shareLink && <ShareLinkModal key={shareLink.token} link={shareLink} onClose={() => setShareLink(null)} />}
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction?.kind === 'cancel'
            ? 'Cancel invitation?'
            : pendingAction?.kind === 'reactivate'
              ? 'Reactivate account?'
              : 'Deactivate account?'
        }
        confirmLabel={
          pendingAction?.kind === 'cancel'
            ? 'Cancel invitation'
            : pendingAction?.kind === 'reactivate'
              ? 'Reactivate'
              : 'Deactivate'
        }
        message={
          pendingAction &&
          (pendingAction.kind === 'cancel'
            ? `The link sent to ${pendingAction.target.email} will stop working.`
            : pendingAction.kind === 'reactivate'
              ? `${pendingAction.target.name} will be able to log in again with their existing password.`
              : `${pendingAction.target.name} will be logged out and will not be able to log in. You can reactivate the account later.`)
        }
        busyLabel="Saving…"
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />
    </>
  );
}

function InviteModal({ onSave, onClose }) {
  const [values, setValues] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Please enter their name.';
    if (!values.email.trim()) nextErrors.email = 'Please enter their email address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    setFormError('');
    try {
      await onSave(values);
    } catch (error) {
      setErrors(Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message])));
      setFormError(error.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      title="Invite an admin"
      onClose={saving ? () => {} : onClose}
      footer={
        <>
          <button type="button" className="button button--secondary button--sm" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="invite-form" className="button button--primary button--sm" disabled={saving}>
            {saving && <span className="spinner" aria-hidden="true" />}
            {saving ? 'Creating link…' : 'Create invitation link'}
          </button>
        </>
      }
    >
      <form id="invite-form" className="admin-form" onSubmit={handleSubmit} noValidate>
        <p className="admin-modal__message">
          You will get a link to send them. They open it, choose their own password, and can then log in.
        </p>
        {formError && (
          <div className="form-alert" role="alert">
            {formError}
          </div>
        )}
        <div className="field">
          <label htmlFor="invite-name">Their name</label>
          <input
            id="invite-name"
            type="text"
            maxLength={80}
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'invite-name-error' : undefined}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the first field of a dialog the admin just opened
            autoFocus
          />
          {errors.name && (
            <p id="invite-name-error" className="field__error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="invite-email">Their email</label>
          <input
            id="invite-email"
            type="email"
            maxLength={254}
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'invite-email-error' : undefined}
          />
          {errors.email && (
            <p id="invite-email-error" className="field__error">
              {errors.email}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
