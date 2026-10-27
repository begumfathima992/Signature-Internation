import { useSite } from '../context/site.js';

export default function CookieBanner() {
  const { setConsent, openLegal } = useSite();

  return (
    <section className="cookie-banner" aria-label="Cookie preferences">
      <p>
        We use essential storage to run this site. With your permission we also load third-party content, such as maps,
        which may set its own cookies. Read our{' '}
        <button type="button" className="link-button" onClick={() => openLegal('privacy')}>
          privacy policy
        </button>
        .
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="button button--secondary button--sm" onClick={() => setConsent('declined')}>
          Decline
        </button>
        <button type="button" className="button button--primary button--sm" onClick={() => setConsent('accepted')}>
          Accept
        </button>
      </div>
    </section>
  );
}
