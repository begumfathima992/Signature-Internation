import { createContext, useContext } from 'react';
import { company } from '../data/company.js';

// "+44 (0)20 7946 0123" -> "+442079460123" for tel: links (the UK "(0)" is not dialled from abroad).
export const phoneHref = (phone) => phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');

// How UK numbers are shown on the website: "+44 - 7741919923", whether the admin typed "+44 (0)7741 919923",
// "07741 919923" or "0044 7741919923". Numbers from other countries are shown as typed.
export function formatPhone(phone) {
  const digits = phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
  const national = digits.match(/^(?:\+44|0044|0)0?(\d{9,10})$/);
  return national ? `+44 - ${national[1]}` : phone.trim();
}

// Adds the link-ready values the pages need to a set of contact details.
export function withLinks(details) {
  return {
    ...details,
    phone: formatPhone(details.phone),
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
