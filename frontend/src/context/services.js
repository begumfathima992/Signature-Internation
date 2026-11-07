import { createContext, useContext } from 'react';
import { getServiceBySlug, services as staticServices } from '../data/services.js';

// The services shown on the site. They load from the API; until then, or if it fails, the built-in
// list in data/services.js is used. status is 'loading', 'ready' (from the API) or 'fallback'.
export const ServicesContext = createContext({
  services: staticServices,
  status: 'fallback',
  getService: getServiceBySlug,
});

export function useServices() {
  return useContext(ServicesContext);
}

// Combines the API's names, order and visibility with the page content kept in data/services.js,
// matched by slug. Services added in the admin area have no stored content, so hasDetails is false
// and they get a simpler page.
export function mergeServices(categories) {
  return categories.map((category) => {
    const known = getServiceBySlug(category.slug);
    return {
      ...known,
      slug: category.slug,
      title: category.title,
      icon: category.icon,
      summary: category.description || known?.summary || '',
      hasDetails: Boolean(known),
      related: known?.related ?? [],
      subServices: category.items.map((item) => {
        const knownItem = known?.subServices.find((sub) => sub.slug === item.slug);
        return {
          ...knownItem,
          slug: item.slug,
          title: item.title,
          icon: knownItem?.icon ?? 'check',
          hasDetails: Boolean(knownItem),
        };
      }),
    };
  });
}
