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
  general: photo('general', 'United States passport resting on an open passport and a world map', 533),
  generalDetail: photo('general-detail', 'Hand holding two passports with boarding passes tucked inside', 533),
  office: photo('office', 'Bright office corridor lined with glass-walled meeting rooms', 534),
  approach: photo('approach', 'Hand sketching a project plan on a whiteboard', 533),
  teams: photo('teams', 'Small team reviewing documents together in front of a chalkboard wall', 450),

  // Sub-service photos (3:2).
  subBusinessConsultancy: photo(
    'sub-business-consultancy',
    'Adviser reviewing a document with a client across a desk',
    533,
  ),
  subBusinessDevelopment: photo(
    'sub-business-development',
    'Two businessmen shaking hands across a meeting table',
    533,
  ),
  subStrategy: photo('sub-strategy', 'Hand moving a white king on a chessboard', 533),
  subChange: photo('sub-change', 'Team listening as a colleague presents at a whiteboard', 533),
  subOrganisation: photo('sub-organisation', 'Four hands fitting coloured puzzle pieces together', 533),
  subProcess: photo('sub-process', 'Hand mapping a process flow on a whiteboard covered in diagrams', 533),
  subProject: photo('sub-project', 'Hands holding sticky notes labelled To Do, Doing and Done', 533),
  subWebsite: photo('sub-website', 'Hand-drawn website wireframe on paper beside an orange pen', 533),
  subMobileApp: photo('sub-mobile-app', 'Smartphone showing app icons beside a laptop keyboard', 533),
  subUiDesign: photo('sub-ui-design', 'Designer sketching mobile interface screens on paper', 533),
  subContent: photo('sub-content', 'Desk with monitors and camera equipment for creating content', 533),
  subSocial: photo('sub-social', 'Smartphone showing a folder of social media apps', 533),
  subLogo: photo('sub-logo', 'Designer drawing a logo on a tablet with a stylus', 533),
  subFlyer: photo('sub-flyer', 'Hand passing a printed flyer to another person', 533),
  subBrochure: photo('sub-brochure', 'Design books and printed brochure samples laid out on a white surface', 533),
  subTrademark: photo('sub-trademark', 'Person signing a printed document with a pen', 533),
  subPassport: photo('sub-passport', 'Hand filling in a printed application form', 533),
  subTravel: photo('sub-travel', 'Open passport with colourful entry stamps', 533),
};
