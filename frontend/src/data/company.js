// Company details used across the site.
// TODO(client): every value marked PLACEHOLDER must be replaced before launch.
const address = ['1 Sample Street', 'London EC1A 1AA', 'United Kingdom']; // PLACEHOLDER

export const company = {
  name: 'Signature International Services Limited',
  tagline: 'Consultancy, digital and business support services from one dependable partner.',
  description:
    'Signature International Services Limited provides management consultancy, web development, digital marketing, business advertisement and general business services.',

  email: 'hello@signatureinternational.example', // PLACEHOLDER
  helpEmail: 'help@signatureinternational.example', // PLACEHOLDER: shown when the form fails
  phone: '+44 (0)20 7946 0123', // PLACEHOLDER (Ofcom drama number)
  phoneHref: '+442079460123', // PLACEHOLDER
  whatsapp: '442079460123', // PLACEHOLDER: international format, digits only
  address,
  hours: [
    { days: 'Monday to Friday', time: '9:00am to 5:30pm' }, // PLACEHOLDER
    { days: 'Saturday and Sunday', time: 'Closed' }, // PLACEHOLDER
  ],

  // Google Maps embed is off until VITE_ENABLE_MAP=true and an embed URL is set.
  // It only loads after the visitor accepts cookies, because Google sets its own.
  map: {
    enabled: import.meta.env.VITE_ENABLE_MAP === 'true',
    embedUrl: '', // PLACEHOLDER: Google Maps > Share > Embed a map > copy the src URL
    linkUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.join(', '))}`,
  },
};
