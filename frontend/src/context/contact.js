import { createContext, useContext } from 'react';
import { company } from '../data/company.js';

// "+44 (0)20 7946 0123" -> "+442079460123" for tel: links (the UK "(0)" is not dialled from abroad).
export const phoneHref = (phone) => phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');

// Adds the link-ready values the pages need to a set of contact details.
export function withLinks(details) {
  return {
    ...details,
    phoneHref: phoneHref(details.phone),
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address.join(', '))}`,
  };
}

const fallback = withLinks({
  email: company.email,
  phone: company.phone,
  whatsapp: company.whatsapp,
  address: company.address,
  hours: company.hours,
});

// The contact details admins edit in the admin area. Until they load, or if the API is down, the
// built-in details in data/company.js are used. status is 'loading', 'ready' or 'fallback'.
export const ContactContext = createContext({ contact: fallback, status: 'fallback' });

export const fallbackContact = fallback;

export function useContactDetails() {
  return useContext(ContactContext);
}
