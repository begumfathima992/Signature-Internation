import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { company } from '../data/company.js';
import Modal from './Modal.jsx';

// Shows a newly created invitation or reset link once, with easy ways to send it.
export default function ShareLinkModal({ link, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!link) return null;

  const url = `${window.location.origin}/admin/accept?token=${encodeURIComponent(link.token)}`;
  const firstName = link.name.split(' ')[0];
  const isInvite = link.type === 'INVITE';
  const message = isInvite
    ? `Hi ${firstName}, you have been invited to manage the ${company.name} website. Open this link within 48 hours to set your password: ${url}`
    : `Hi ${firstName}, here is your link to choose a new password for the ${company.name} website admin. It works once, within 48 hours: ${url}`;
  const subject = isInvite ? `Your admin invitation for the ${company.name} website` : 'Reset your admin password';

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked: the link is selected in the box so it can be copied by hand.
      document.getElementById('share-link-url')?.select();
    }
  }

  return (
    <Modal
      open
      title={isInvite ? 'Invitation ready' : 'Reset link ready'}
      onClose={onClose}
      footer={
        <button type="button" className="button button--primary button--sm" onClick={onClose}>
          Done
        </button>
      }
    >
      <p className="share-link__intro">
        Send this link to <strong>{link.name}</strong> ({link.email}). It works once and expires in 48 hours.
        {isInvite ? ' They choose their own password.' : ' They will choose a new password.'}
      </p>
      <p className="share-link__warning">
        Anyone with this link can {isInvite ? 'create the account' : 'change the password'}, so send it only to{' '}
        {firstName}. For your security it is shown only now.
      </p>

      <div className="field">
        <label htmlFor="share-link-url">Link</label>
        <div className="share-link__row">
          <input id="share-link-url" type="text" readOnly value={url} onFocus={(event) => event.target.select()} />
          <button type="button" className="button button--secondary button--sm" onClick={copy}>
            <Icon name={copied ? 'check' : 'fileText'} size={16} /> {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {copied ? 'Link copied to the clipboard.' : ''}
        </p>
      </div>

      <div className="share-link__send">
        <a
          className="button button--secondary button--sm"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="messageCircle" size={16} /> Send by WhatsApp
        </a>
        <a
          className="button button--secondary button--sm"
          href={`mailto:${link.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
        >
          <Icon name="mail" size={16} /> Send by email
        </a>
      </div>
    </Modal>
  );
}
