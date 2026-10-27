// All service copy lives here so it can be edited without touching components.
// `icon` must be a key in components/Icon.jsx; `image` and `detailImage` are keys in data/images.js.
// Kept free of asset imports so vite.config.js can read it to build sitemap.xml.
export const services = [
  {
    slug: 'management-consultancy',
    icon: 'briefcase',
    image: 'consultancy',
    detailImage: 'consultancyDetail',
    title: 'Management Consultancy Services',
    summary: 'Practical advice on strategy, operations and sustainable growth.',
    overview: [
      'We work alongside owners and leadership teams to understand where the business stands today, agree where it needs to be, and set out a realistic plan to close the gap.',
      'Our advice is grounded in how your organisation actually runs. We focus on a small number of priorities, explain the reasoning behind every recommendation, and stay involved while changes are put in place.',
    ],
    included: [
      'Business health check covering finance, operations and people',
      'Strategy and business planning workshops',
      'Process mapping and operational improvement',
      'Organisational structure and role design',
      'Market entry and expansion planning',
      'Ongoing advisory support for leadership teams',
    ],
    process: [
      {
        title: 'Diagnose',
        text: 'Interviews, data review and site visits to understand how the business operates today.',
      },
      { title: 'Prioritise', text: 'We agree the issues that matter most and the outcomes you want to see.' },
      { title: 'Plan', text: 'A clear action plan with owners, timescales and measures of success.' },
      { title: 'Support', text: 'Regular check-ins to keep changes on track and adjust the plan as needed.' },
    ],
    audience: [
      'Owner-managed businesses preparing for their next stage of growth',
      'Leadership teams facing a change in market, structure or ownership',
      'Organisations whose processes have not kept pace with their size',
      'Start-ups that need a credible business plan for investors or lenders',
    ],
    faqs: [
      {
        q: 'How long does a typical consultancy engagement last?',
        a: 'It depends on scope. A focused business review can take a few weeks, while support with implementing change usually runs over several months. We agree the timescale before any work begins.',
      },
      {
        q: 'Do you work with small businesses?',
        a: 'Yes. Much of our work is with owner-managed and growing businesses, and we scale the engagement to suit your size and budget.',
      },
      {
        q: 'Will you help us implement the recommendations?',
        a: 'Yes, if you would like us to. We can hand over a plan for your team to deliver, or stay involved and support the changes alongside you.',
      },
    ],
    related: ['digital-marketing', 'general-services'],
  },
  {
    slug: 'web-development',
    icon: 'code',
    image: 'webdev',
    detailImage: 'webdevDetail',
    title: 'Web Development Services',
    summary: 'Fast, secure, mobile-friendly websites and web applications.',
    overview: [
      'From a straightforward company website to a custom web application, we design and build reliable digital products that are easy to use and easy to manage.',
      'Every project is planned around what your visitors need to do and what your team needs to maintain. We build with performance, accessibility and security in mind from day one, and hand over sites you fully own.',
    ],
    included: [
      'Discovery session and written project scope',
      'Responsive design for mobile, tablet and desktop',
      'Custom web applications and client portals',
      'Content management set-up and team training',
      'Hosting, domain, SSL and security configuration',
      'Ongoing maintenance and support plans',
    ],
    process: [
      { title: 'Scope', text: 'We define goals, pages, features and integrations in a written specification.' },
      { title: 'Design', text: 'Page layouts and visual designs for you to review before development starts.' },
      { title: 'Build', text: 'Development with regular previews so you can see progress and give feedback.' },
      { title: 'Launch', text: 'Testing across devices, go-live, and training for your team.' },
    ],
    audience: [
      'Businesses whose current website is slow, dated or hard to update',
      'New companies that need a professional online presence quickly',
      'Teams replacing spreadsheets or paperwork with a web-based system',
      'Organisations that need a secure portal for clients or staff',
    ],
    faqs: [
      {
        q: 'Will I be able to update the website myself?',
        a: 'Yes. Where it suits the project we set up a content management system and train your team to edit pages, news and images without technical knowledge.',
      },
      {
        q: 'Do you provide hosting?',
        a: 'We can arrange and configure hosting for you, or deploy to a hosting provider you already use. Either way, the site and its content belong to you.',
      },
      {
        q: 'Can you improve our existing website rather than rebuild it?',
        a: 'Often, yes. We start by reviewing your current site and will recommend improvements or a rebuild depending on which gives you better value.',
      },
    ],
    related: ['digital-marketing', 'business-advertisement'],
  },
  {
    slug: 'digital-marketing',
    icon: 'chart',
    image: 'marketing',
    detailImage: 'marketingDetail',
    title: 'Digital Marketing Services',
    summary: 'Search, social and email campaigns that deliver measurable results.',
    overview: [
      'We plan and run digital marketing that is tied to clear business goals, whether that is more enquiries, stronger brand awareness or better customer retention.',
      'Rather than spreading your budget across every channel, we focus on the ones your customers actually use, set up proper tracking, and report on results in plain English.',
    ],
    included: [
      'Digital marketing audit and channel strategy',
      'Search engine optimisation (SEO)',
      'Pay-per-click advertising set-up and management',
      'Social media planning and content',
      'Email marketing campaigns and automation',
      'Analytics set-up and monthly reporting',
    ],
    process: [
      { title: 'Audit', text: 'A review of your website, channels, competitors and current results.' },
      { title: 'Strategy', text: 'A channel plan with goals, budgets and the measures we will report on.' },
      { title: 'Launch', text: 'Campaigns built, tracking checked, and activity scheduled.' },
      { title: 'Optimise', text: 'Monthly reports and ongoing changes based on what is working.' },
    ],
    audience: [
      'Businesses that want a steadier flow of enquiries from their website',
      'Companies spending on ads without clear evidence of return',
      'Teams without the time or in-house skills to manage marketing',
      'Organisations launching a new product, service or location',
    ],
    faqs: [
      {
        q: 'How soon will we see results?',
        a: 'Paid advertising can bring traffic within days, while search engine optimisation typically builds over several months. We set realistic expectations for each channel at the start.',
      },
      {
        q: 'Do we need a minimum budget?',
        a: 'No fixed minimum. We recommend a budget based on your goals and market, and explain what can realistically be achieved at different levels.',
      },
      {
        q: 'How will we know what is working?',
        a: 'We set up tracking at the start and send a monthly report showing what was done, what it achieved, and what we plan to change next.',
      },
    ],
    related: ['web-development', 'business-advertisement'],
  },
  {
    slug: 'business-advertisement',
    icon: 'megaphone',
    image: 'advertising',
    detailImage: 'advertisingDetail',
    title: 'Business Advertisement Services',
    summary: 'Print, outdoor and online advertising that reaches the right audience.',
    overview: [
      'We help businesses get noticed with well-planned advertising that reaches the people who matter, in the places they are most likely to see it.',
      'From the first creative idea to booking the space, we manage the whole campaign so your message is consistent across every format and your budget is spent where it has the most effect.',
    ],
    included: [
      'Campaign planning and audience research',
      'Advertising copywriting and creative design',
      'Print, press and directory advertising',
      'Outdoor advertising and business signage',
      'Online display and social media advertising',
      'Media buying, scheduling and results review',
    ],
    process: [
      { title: 'Brief', text: 'We agree your audience, message, budget and campaign timing.' },
      { title: 'Create', text: 'Copy and designs prepared for each format, ready for your approval.' },
      { title: 'Place', text: 'We book the media and manage production and deadlines with suppliers.' },
      { title: 'Review', text: 'A summary of what ran, where, and how it performed.' },
    ],
    audience: [
      'Local businesses that want to be better known in their area',
      'Companies launching a new brand, product or premises',
      'Organisations running seasonal or event-based promotions',
      'Businesses that want consistent branding across print and online',
    ],
    faqs: [
      {
        q: 'Which advertising channels should we use?',
        a: 'That depends on who you want to reach and where. We recommend a mix based on your audience and budget, and explain the reasoning for each choice.',
      },
      {
        q: 'Do you handle design and printing?',
        a: 'Yes. We prepare the copy and artwork, and coordinate production with printers, sign makers and media owners so you have one point of contact.',
      },
      {
        q: 'Can you work with our existing branding?',
        a: 'Yes. We work within your brand guidelines, or help you create simple guidelines if you do not have them yet.',
      },
    ],
    related: ['digital-marketing', 'management-consultancy'],
  },
  {
    slug: 'general-services',
    icon: 'layers',
    image: 'general',
    detailImage: 'generalDetail',
    title: 'General Services',
    summary: 'Flexible support for the day-to-day tasks that keep business moving.',
    overview: [
      'Not every requirement fits neatly into a single category. Our general services cover a wide range of business support needs, giving you a dependable partner for the tasks that take time away from running your business.',
      'Support can be arranged for a single project or on an ongoing basis, and we adapt to the systems and ways of working you already have in place.',
    ],
    included: [
      'Administrative and back-office support',
      'Document preparation and business correspondence',
      'Supplier and vendor coordination',
      'Research and information gathering',
      'Project coordination and scheduling',
      'Tailored support packages on request',
    ],
    process: [
      { title: 'Listen', text: 'We learn what needs doing, how often, and how you currently handle it.' },
      { title: 'Propose', text: 'A clear outline of the support we will provide and how it is priced.' },
      { title: 'Deliver', text: 'Work carried out to agreed standards, using your preferred tools.' },
      { title: 'Review', text: 'Regular check-ins to adjust the support as your needs change.' },
    ],
    audience: [
      'Small teams stretched by administration and paperwork',
      'Businesses that need extra help during busy periods',
      'Managers who want a reliable partner for one-off projects',
      'Organisations without dedicated in-house support staff',
    ],
    faqs: [
      {
        q: 'What kind of tasks can you help with?',
        a: 'Most routine business support, from administration and correspondence to research and project coordination. If you are not sure whether a task fits, ask us.',
      },
      {
        q: 'Do we need to sign a long-term contract?',
        a: 'No. Support can be arranged for a single project, for a set period, or on an ongoing basis.',
      },
      {
        q: 'How do you keep our information secure?',
        a: 'We work within your systems where possible, limit access to the people who need it, and handle all information in line with UK data protection law.',
      },
    ],
    related: ['management-consultancy', 'web-development'],
  },
];

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug);
}
