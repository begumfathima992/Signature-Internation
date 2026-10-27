import { createContext, useContext } from 'react';

// Shared site state: legal modals and cookie consent.
export const SiteContext = createContext(null);

export function useSite() {
  return useContext(SiteContext);
}
