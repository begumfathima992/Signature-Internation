import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { company } from '../data/company.js';

// Sets the page title, description and Open Graph tags for the current route.
export default function PageMeta({ title, description = company.description, noIndex = false }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${company.name}` : company.name;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex' : 'index, follow'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={import.meta.env.VITE_SITE_URL + pathname} />
    </Helmet>
  );
}
