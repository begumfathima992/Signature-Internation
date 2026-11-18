import { useEffect, useState } from 'react';
import { ContactContext, fallbackContact, withLinks } from '../context/contact.js';
import { api } from '../lib/api.js';

// Outside a browser (the route check script) there is no API call, so the built-in details are used.
const initialStatus = typeof window === 'undefined' ? 'fallback' : 'loading';

export default function ContactProvider({ children }) {
  const [state, setState] = useState({ status: initialStatus, contact: fallbackContact });

  useEffect(() => {
    const controller = new AbortController();
    api('/api/contact-details', { signal: controller.signal })
      .then(({ contact }) => setState({ status: 'ready', contact: withLinks(contact) }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'fallback', contact: fallbackContact });
      });
    return () => controller.abort();
  }, []);

  return <ContactContext.Provider value={state}>{children}</ContactContext.Provider>;
}
