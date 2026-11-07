import { useEffect, useMemo, useState } from 'react';
import { ServicesContext, mergeServices } from '../context/services.js';
import { services as staticServices } from '../data/services.js';
import { api } from '../lib/api.js';

// When pages are rendered outside a browser (the route check script) there is no API call, so the
// built-in list is used straight away.
const initialStatus = typeof window === 'undefined' ? 'fallback' : 'loading';

export default function ServicesProvider({ children }) {
  const [state, setState] = useState({ status: initialStatus, services: staticServices });

  useEffect(() => {
    const controller = new AbortController();
    api('/api/services', { signal: controller.signal })
      .then(({ categories }) => {
        // An empty answer would leave the site with no services, so keep the built-in list instead.
        if (!categories?.length) throw new Error('No services returned');
        setState({ status: 'ready', services: mergeServices(categories) });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'fallback', services: staticServices });
      });
    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getService: (slug) => state.services.find((service) => service.slug === slug),
    }),
    [state],
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}
