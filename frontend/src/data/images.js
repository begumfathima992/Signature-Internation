// Photography from Unsplash (free licence). Sources and photographers: IMAGE_CREDITS.md.
// Each photo is stored at 800px and 1600px wide; the browser picks the right size.
const files = import.meta.glob('../assets/images/*.webp', { eager: true, import: 'default' });

function photo(name, alt, height) {
  const small = files[`../assets/images/${name}-800.webp`];
  const large = files[`../assets/images/${name}-1600.webp`];
  return { src: small, srcSet: `${small} 800w, ${large} 1600w`, width: 800, height, alt };
}

export const images = {
  consultancy: photo('consultancy', 'Five colleagues in discussion around a table in a bright meeting room', 450),
  consultancyDetail: photo('consultancy-detail', 'Two business advisers reviewing charts on a laptop together', 450),
  webdev: photo('webdev', 'Two developers reviewing code on monitors in a bright office', 533),
  webdevDetail: photo('webdev-detail', 'Laptop showing code on a tidy desk beside a coffee cup', 533),
  marketing: photo('marketing', 'Marketing team planning a campaign with colour swatches and charts', 450),
  marketingDetail: photo(
    'marketing-detail',
    'Colleagues organising campaign ideas with sticky notes on a glass wall',
    450,
  ),
  advertising: photo('advertising', 'Two blank billboards against a clear blue sky', 533),
  advertisingDetail: photo('advertising-detail', 'Illuminated “Open” sign hanging in a shop window', 533),
  general: photo('general', 'Bright open-plan office with rows of desks', 534),
  generalDetail: photo('general-detail', 'Desk with a calculator, ring binders, notebook and glasses', 533),
  office: photo('office', 'Bright office corridor lined with glass-walled meeting rooms', 534),
  approach: photo('approach', 'Hand sketching a project plan on a whiteboard', 533),
  teams: photo('teams', 'Small team reviewing documents together in front of a chalkboard wall', 450),
};
