// TODO(legal): generic template text. Must be reviewed by a qualified legal adviser
// and completed with the company's registered details before the site goes live.
import { company } from './company.js';

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Who we are',
        body: [
          `${company.name} (“we”, “us”) is responsible for the personal information collected through this website. You can contact us at ${company.email}.`,
        ],
      },
      {
        heading: 'What we collect',
        body: [
          'When you use our contact form we collect your name, email address, phone number (if provided), the service you are interested in, and your message.',
          'Our website may also record basic technical information, such as your browser type and the pages you visit, to keep the site secure and working properly.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'We use the information you send us only to respond to your enquiry and, if you become a client, to provide our services. We do not sell your information or use it for unrelated marketing.',
          'Our lawful basis is your consent, given when you submit the form, and our legitimate interest in responding to business enquiries.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'We use essential storage to remember your cookie preference. If you accept cookies, we may load third-party content such as an embedded map, which can set its own cookies. You can change your choice at any time using “Cookie settings” in the footer.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'We keep enquiry information only for as long as needed to respond and for a reasonable period afterwards, unless we have a legal reason to keep it longer.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under UK data protection law you can ask to see, correct or delete the personal information we hold about you, or object to how we use it. Contact us to make a request.',
          'If you are unhappy with how we have handled your information, you can complain to the Information Commissioner’s Office (ico.org.uk).',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: [
      {
        heading: 'About these terms',
        body: [`These terms apply to your use of the ${company.name} website. By using the site you agree to them.`],
      },
      {
        heading: 'Use of the website',
        body: [
          'You may use this website for lawful purposes only. You must not attempt to interfere with its operation or gain unauthorised access to any part of it.',
        ],
      },
      {
        heading: 'Information on this site',
        body: [
          'The content on this website is for general information only and does not form an offer or professional advice. Any services we provide are governed by a separate written agreement.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The text, design and logos on this website belong to us or are used under licence. Photographs are used under the Unsplash licence. You may not reproduce site content without permission.',
        ],
      },
      {
        heading: 'Links to other websites',
        body: [
          'Links to third-party websites are provided for convenience. We are not responsible for the content or privacy practices of those sites.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'We take care to keep this website accurate and available, but we cannot guarantee it will always be error-free or uninterrupted. Nothing in these terms limits liability that cannot be limited by law.',
        ],
      },
      {
        heading: 'Governing law',
        body: ['These terms are governed by the law of England and Wales.'],
      },
    ],
  },
};
