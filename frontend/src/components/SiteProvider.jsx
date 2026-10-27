import { useCallback, useMemo, useState } from 'react';
import { SiteContext } from '../context/site.js';
import CookieBanner from './CookieBanner.jsx';
import LegalModal from './LegalModal.jsx';

const CONSENT_KEY = 'sis-cookie-consent';

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export default function SiteProvider({ children }) {
  const [legalDoc, setLegalDoc] = useState(null); // 'privacy' | 'terms' | null
  const [consent, setConsentState] = useState(readConsent); // 'accepted' | 'declined' | null
  const [bannerOpen, setBannerOpen] = useState(() => readConsent() === null);

  const setConsent = useCallback((value) => {
    setConsentState(value);
    setBannerOpen(false);
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  }, []);

  const value = useMemo(
    () => ({
      consent,
      setConsent,
      openCookieSettings: () => setBannerOpen(true),
      openLegal: setLegalDoc,
    }),
    [consent, setConsent],
  );

  return (
    <SiteContext.Provider value={value}>
      {children}
      {bannerOpen && <CookieBanner />}
      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </SiteContext.Provider>
  );
}
