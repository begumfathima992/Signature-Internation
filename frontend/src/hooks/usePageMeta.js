import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { company } from '../data/company.js';

function setMeta(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// Sets the page title, description and Open Graph tags for the current route.
export default function usePageMeta({ title, description = company.description, noIndex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.name}` : company.name;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', window.location.origin + pathname);
  }, [title, description, noIndex, pathname]);
}
