// All service copy lives here so it can be edited without touching components.
// `icon` must be a key in components/Icon.jsx; `image` and `detailImage` are keys in data/images.js.
// Each service has `subServices`, and every sub-service has its own page at /services/:slug/:subSlug.
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
    whyChooseUs: [
      {
        icon: 'users',
        title: 'Senior attention',
        text: 'The advisers you meet at the start are the people who do the work.',
      },
      {
        icon: 'fileText',
        title: 'Plain-English advice',
        text: 'Clear recommendations with the reasoning behind them, not jargon.',
      },
      {
        icon: 'handshake',
        title: 'Support to deliver',
        text: 'We can stay involved while your plan is put into practice.',
      },
    ],
    subServices: [
      {
        slug: 'business-consultancy',
        icon: 'lightbulb',
        image: 'subBusinessConsultancy',
        title: 'Business Consultancy Services',
        shortDescription: 'Independent advice on the challenges, decisions and opportunities facing your business.',
        overview: [
          'Every business reaches points where an outside view helps: a difficult decision, a drop in performance, or an opportunity that needs testing before you commit. We give you an honest, independent assessment and practical options.',
          'We start by listening, then review the numbers and how the business runs day to day. You receive clear findings, a short list of priorities and recommendations you can act on.',
        ],
        whatsIncluded: [
          'An initial consultation to understand your situation and goals',
          'A review of financial performance, operations and customer base',
          'Interviews with owners, managers and key staff where useful',
          'A written report with findings and prioritised recommendations',
          'A follow-up session to talk through the report and next steps',
          'Optional ongoing advisory sessions on a monthly basis',
        ],
        process: [
          { title: 'Listen', text: 'We learn about your business, your concerns and what success looks like.' },
          { title: 'Review', text: 'We look at the figures, processes and market to see what is really happening.' },
          { title: 'Recommend', text: 'We set out clear options with the pros, cons and costs of each.' },
          { title: 'Follow up', text: 'We help you decide on next steps and check in on progress.' },
        ],
        benefits: [
          {
            title: 'An objective view',
            text: 'An independent perspective that is not tied to internal habits or politics.',
          },
          { title: 'Better decisions', text: 'Choices based on evidence and clearly explained trade-offs.' },
          { title: 'Focus', text: 'A short list of priorities so effort goes where it matters most.' },
        ],
        whoItIsFor: [
          'Owners facing a significant decision about the business',
          'Businesses whose performance has stalled or declined',
          'Leadership teams who want an independent second opinion',
          'Companies exploring a new opportunity before investing',
        ],
        faqs: [
          {
            q: 'What do we need to prepare before the first meeting?',
            a: 'Nothing formal. A short summary of the issue is helpful. If we go ahead, we will ask for recent accounts and any relevant reports.',
          },
          {
            q: 'Is what we share kept confidential?',
            a: 'Yes. We treat all information about your business as confidential and are happy to sign a non-disclosure agreement.',
          },
          {
            q: 'Can we book a single session rather than a full review?',
            a: 'Yes. A one-off advisory session works well for a specific question. We will tell you if we think a fuller review would be more useful.',
          },
        ],
      },
      {
        slug: 'business-development',
        icon: 'trendingUp',
        image: 'subBusinessDevelopment',
        title: 'Business Development',
        shortDescription: 'Identifying new markets, customers and partnerships, and planning how to win them.',
        overview: [
          'Growth rarely happens by chance. We help you identify where new revenue is most likely to come from, whether that is new customers, new markets, new services or partnerships with other businesses.',
          'Together we build a practical plan: who to target, what to offer them, how to reach them and how to measure results, sized to the time and budget you actually have.',
        ],
        whatsIncluded: [
          'A review of your current customers, services and sales channels',
          'Research into target markets and customer segments',
          'Identification of potential partners and referral sources',
          'A value proposition for each priority customer group',
          'A business development plan with actions, owners and targets',
          'Simple tracking so you can measure progress each month',
        ],
        process: [
          { title: 'Assess', text: 'We look at where your revenue comes from today and what is working.' },
          { title: 'Identify', text: 'We research and agree the opportunities with the best potential.' },
          { title: 'Plan', text: 'We build an action plan with clear targets and responsibilities.' },
          { title: 'Review', text: 'We review results with you and refine the approach.' },
        ],
        benefits: [
          { title: 'Clear targets', text: 'Know exactly which customers and markets to pursue and why.' },
          {
            title: 'Efficient effort',
            text: 'Spend sales and marketing time on the opportunities most likely to pay off.',
          },
          { title: 'Measurable progress', text: 'Simple measures that show whether the plan is working.' },
        ],
        whoItIsFor: [
          'Businesses that rely on a small number of customers',
          'Companies ready to expand into a new area or market',
          'Owners who want a structured approach to winning new work',
          'Firms looking for partnership or referral opportunities',
        ],
        faqs: [
          {
            q: 'Do you make sales calls on our behalf?',
            a: 'Our focus is on planning and preparation. We can support your team with materials, introductions and coaching, but your business remains the face to your customers.',
          },
          {
            q: 'How soon should we expect to see results?',
            a: 'It depends on your sales cycle. Early indicators, such as more conversations with the right prospects, usually appear before new revenue does.',
          },
          {
            q: 'Can this include entering an overseas market?',
            a: 'Yes. We can research the market, identify likely customers and partners, and set out the practical steps involved.',
          },
        ],
      },
      {
        slug: 'strategy-development',
        icon: 'target',
        image: 'subStrategy',
        title: 'Strategy Development',
        shortDescription: 'A clear strategy that sets direction, priorities and measurable goals for the years ahead.',
        overview: [
          'A good strategy explains where the business is going, how it will get there and, just as importantly, what it will not do. We help you agree that direction and turn it into a plan the whole team understands.',
          'We combine a review of your market and competitors with workshops for your leadership team. The result is a concise strategy document with goals, priorities and a timeline.',
        ],
        whatsIncluded: [
          'A review of your market, competitors and current position',
          'Facilitated strategy workshops with your leadership team',
          'Agreed vision, objectives and strategic priorities',
          'A concise strategy document that is easy to share',
          'Measurable goals and key performance indicators',
          'A phased action plan for the next one to three years',
        ],
        process: [
          { title: 'Research', text: 'We analyse your market, competitors and internal strengths and weaknesses.' },
          { title: 'Workshop', text: 'We work with your leadership team to agree direction and priorities.' },
          { title: 'Document', text: 'We write up the strategy and the plan to deliver it.' },
          { title: 'Embed', text: 'We help you share it with your team and track progress.' },
        ],
        benefits: [
          { title: 'Shared direction', text: 'Everyone understands where the business is heading and why.' },
          { title: 'Clear priorities', text: 'Decisions about time and money become easier to make.' },
          { title: 'Measurable goals', text: 'Progress can be tracked and reported with confidence.' },
          { title: 'A plan you can use', text: 'A practical document, not a report that sits on a shelf.' },
        ],
        whoItIsFor: [
          'Businesses without a written strategy or whose strategy is out of date',
          'Leadership teams that disagree on priorities',
          'Companies preparing for investment, sale or succession',
          'Organisations responding to a major change in their market',
        ],
        faqs: [
          {
            q: 'How long does it take to develop a strategy?',
            a: 'For most small and medium-sized businesses, a few weeks from first meeting to final document, depending on how quickly workshops can be scheduled.',
          },
          {
            q: 'Who should take part in the workshops?',
            a: 'Usually the owners and senior managers. We may also suggest speaking with a few staff or customers to test our understanding.',
          },
          {
            q: 'How often should a strategy be reviewed?',
            a: 'We recommend a short review every year, and a fuller one whenever your market or business changes significantly.',
          },
        ],
      },
      {
        slug: 'change-management',
        icon: 'refresh',
        image: 'subChange',
        title: 'Change Management',
        shortDescription: 'Guiding your people and processes through change with as little disruption as possible.',
        overview: [
          'Restructures, new systems, mergers and new ways of working all depend on people adopting the change. We help you plan and communicate change so that it is understood, accepted and sustained.',
          'We look at who is affected and how, then build a plan covering communication, training and support. We help you anticipate concerns early and keep the business running smoothly throughout.',
        ],
        whatsIncluded: [
          'An assessment of the change and the people it affects',
          'A change plan with milestones, risks and responsibilities',
          'A communication plan for staff, customers and suppliers',
          'Support for managers leading their teams through the change',
          'Training and guidance on new processes or systems',
          'Regular progress reviews and adjustments to the plan',
        ],
        process: [
          { title: 'Understand', text: 'We define the change, the reasons for it and who it will affect.' },
          { title: 'Plan', text: 'We build the change, communication and training plans.' },
          { title: 'Support', text: 'We help managers and teams as the change is introduced.' },
          { title: 'Sustain', text: 'We check the change has stuck and resolve remaining issues.' },
        ],
        benefits: [
          { title: 'Less disruption', text: 'Day-to-day work continues while changes are introduced.' },
          { title: 'Better engagement', text: 'Staff understand the reasons for change and what it means for them.' },
          { title: 'Lasting results', text: 'New ways of working are adopted rather than quietly abandoned.' },
        ],
        whoItIsFor: [
          'Organisations introducing a new structure or new systems',
          'Businesses going through a merger or change of ownership',
          'Leaders who have struggled to make previous changes stick',
          'Teams adapting to new regulations or customer demands',
        ],
        faqs: [
          {
            q: 'Can you help if the change has already started?',
            a: 'Yes. We can review progress so far, identify where things are stuck and put a recovery plan in place.',
          },
          {
            q: 'Do you deliver staff training?',
            a: 'We can design and deliver training on new processes and ways of working, or support your own trainers.',
          },
          {
            q: 'Do you advise on employment law?',
            a: 'No. Where changes affect contracts or roles, we recommend you take advice from an employment law specialist, and we can work alongside them.',
          },
        ],
      },
      {
        slug: 'organizational-development',
        icon: 'network',
        image: 'subOrganisation',
        title: 'Organizational Development',
        shortDescription: 'Structures, roles and ways of working that help your teams perform at their best.',
        overview: [
          'As a business grows, the structure that once worked can start to cause confusion, duplication and bottlenecks. We help you design an organisation that fits where the business is now and where it is going.',
          'We look at structure, roles, responsibilities, decision-making and team working, and recommend practical improvements that make it easier for people to do their best work.',
        ],
        whatsIncluded: [
          'A review of your current structure, roles and reporting lines',
          'Staff and manager interviews or short surveys',
          'Recommendations on structure and responsibilities',
          'Clear role descriptions and decision-making responsibilities',
          'Support with team development and leadership capability',
          'An implementation plan for any changes',
        ],
        process: [
          { title: 'Review', text: 'We understand how the organisation works today and where it struggles.' },
          { title: 'Design', text: 'We propose structure and role changes and test them with you.' },
          { title: 'Implement', text: 'We help introduce changes and support managers and teams.' },
        ],
        benefits: [
          {
            title: 'Clear responsibilities',
            text: 'Everyone knows what they are responsible for and who decides what.',
          },
          { title: 'Fewer bottlenecks', text: 'Work flows without waiting on a single person for every decision.' },
          { title: 'Room to grow', text: 'A structure that can take on more people and more work.' },
        ],
        whoItIsFor: [
          'Growing businesses where the owner is involved in every decision',
          'Organisations with unclear roles or overlapping responsibilities',
          'Teams preparing for a period of growth or restructuring',
          'Leaders who want to strengthen their management team',
        ],
        faqs: [
          {
            q: 'Will this mean redundancies?',
            a: 'Not necessarily. Most organisational development work is about clarity and better ways of working. If role changes are proposed, we explain the options openly.',
          },
          {
            q: 'Do you speak to our staff directly?',
            a: 'With your agreement, yes. Confidential conversations with staff often reveal what is really getting in the way.',
          },
          {
            q: 'Can you help develop our managers?',
            a: 'Yes. We can provide coaching and practical development sessions for new and existing managers.',
          },
        ],
      },
      {
        slug: 'business-process-re-engineering',
        icon: 'workflow',
        image: 'subProcess',
        title: 'Business Process Re-engineering',
        shortDescription: 'Redesigning core processes to remove waste, reduce delays and improve quality.',
        overview: [
          'Processes that grew over time often involve unnecessary steps, duplicated effort and manual workarounds. We map how work really flows through your business and redesign it to be simpler and faster.',
          'We focus on the processes that matter most to your customers and costs, and design changes that your team can realistically introduce, including where technology can help.',
        ],
        whatsIncluded: [
          'Selection of the processes with the biggest impact',
          'Mapping of current processes with the people who run them',
          'Identification of delays, errors, duplication and waste',
          'Redesigned processes with clear steps and responsibilities',
          'Recommendations on supporting tools and automation',
          'A plan for introducing the new processes and measuring results',
        ],
        process: [
          { title: 'Map', text: 'We document how the process works today, step by step.' },
          { title: 'Analyse', text: 'We find where time, money and quality are being lost.' },
          { title: 'Redesign', text: 'We design a simpler process with your team.' },
          { title: 'Introduce', text: 'We help roll out the new process and track the improvement.' },
        ],
        benefits: [
          { title: 'Faster turnaround', text: 'Fewer steps and hand-offs mean work is completed sooner.' },
          { title: 'Fewer errors', text: 'Clear, consistent processes reduce mistakes and rework.' },
          { title: 'Lower costs', text: 'Less time spent on tasks that add no value.' },
        ],
        whoItIsFor: [
          'Businesses where customers complain about delays or mistakes',
          'Teams relying on spreadsheets, email and manual workarounds',
          'Companies planning a new system and wanting to fix processes first',
          'Organisations whose processes have not kept pace with growth',
        ],
        faqs: [
          {
            q: 'Which processes should we start with?',
            a: 'Usually those that affect customers most directly or take up the most staff time. We help you choose during the first stage.',
          },
          {
            q: 'Do you recommend software?',
            a: 'Where it helps, yes. We are independent, so our recommendations are based on what suits your process and budget.',
          },
          {
            q: 'Will our team be involved?',
            a: 'Yes. The people who run the process every day know it best, and involving them makes the new process far more likely to work.',
          },
        ],
      },
      {
        slug: 'project-management',
        icon: 'clipboardList',
        image: 'subProject',
        title: 'Project Management',
        shortDescription: 'Planning, coordinating and delivering projects on time, within scope and within budget.',
        overview: [
          'Important projects such as an office move, a system implementation or a new service launch often compete with day-to-day work. We provide structured project management so they are delivered without overloading your team.',
          'We plan the work, coordinate the people and suppliers involved, track progress and risks, and keep you informed with clear, regular updates.',
        ],
        whatsIncluded: [
          'A project plan with scope, milestones and budget',
          'Coordination of internal teams and external suppliers',
          'A risk and issue log with agreed actions',
          'Regular progress reports and status meetings',
          'Change control so scope and cost stay under control',
          'A project close-out review and handover',
        ],
        process: [
          { title: 'Define', text: 'We agree objectives, scope, budget and success measures.' },
          { title: 'Plan', text: 'We build the schedule, assign responsibilities and identify risks.' },
          { title: 'Deliver', text: 'We coordinate the work and report progress regularly.' },
          { title: 'Close', text: 'We confirm everything is complete and record lessons learned.' },
        ],
        benefits: [
          { title: 'Predictable delivery', text: 'Clear milestones and early warning when anything slips.' },
          { title: 'Controlled costs', text: 'Changes to scope are agreed before they affect the budget.' },
          {
            title: 'Less pressure on your team',
            text: 'Your staff can focus on their own roles while the project runs.',
          },
        ],
        whoItIsFor: [
          'Businesses with an important project but no project manager',
          'Teams managing several suppliers on one project',
          'Organisations whose projects regularly overrun',
          'Leaders who want clear visibility of progress and risk',
        ],
        faqs: [
          {
            q: 'What kinds of projects do you manage?',
            a: 'Business projects such as system implementations, office moves, service launches and internal improvement programmes.',
          },
          {
            q: 'Can you take over a project that is already under way?',
            a: 'Yes. We start by reviewing where the project stands, then agree a realistic plan to complete it.',
          },
          {
            q: 'How will we be kept informed?',
            a: 'Through a regular written status report and meetings at a frequency that suits you, with immediate notice of any significant issue.',
          },
        ],
      },
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
        a: 'Yes, if you would like us to. We can hand over a plan for your team to deliver, or stay involved and manage the changes alongside you.',
      },
    ],
    related: ['digital-marketing', 'web-development'],
  },
  {
    slug: 'web-development',
    icon: 'code',
    image: 'webdev',
    detailImage: 'webdevDetail',
    title: 'Web Development Services',
    summary: 'Professional websites, mobile app designs and user interfaces.',
    overview: [
      'From a company website to the design of a mobile app, we create clear, professional digital products that are easy to use and easy to manage.',
      'Every project is planned around what your visitors need to do and how your brand should look. We design for mobile, tablet and desktop from the start, and hand over work that you fully own.',
    ],
    whyChooseUs: [
      {
        icon: 'smartphone',
        title: 'Mobile first',
        text: 'Every design is planned for phones, tablets and desktops from day one.',
      },
      {
        icon: 'messageSquare',
        title: 'You see it early',
        text: 'Designs and previews to review before anything is finalised.',
      },
      { icon: 'badgeCheck', title: 'You own it', text: 'Your designs, files and accounts are handed over to you.' },
    ],
    subServices: [
      {
        slug: 'website-design',
        icon: 'monitor',
        image: 'subWebsite',
        title: 'Website Design',
        shortDescription:
          'Responsive websites that present your business professionally and turn visitors into enquiries.',
        overview: [
          'Your website is often the first impression a customer has of your business. We design and build websites that look professional, load quickly, work on every device and make it easy for visitors to get in touch.',
          'We plan the structure and content around what your customers are looking for, then design pages that reflect your brand. Where it suits the project, you can update the content yourself.',
        ],
        whatsIncluded: [
          'A planning session covering goals, audience and page structure',
          'Wireframes and visual designs for you to approve',
          'Responsive build for mobile, tablet and desktop',
          'Contact forms and clear calls to action',
          'Basic on-page search engine set-up and analytics',
          'Testing, launch and a handover session for your team',
        ],
        process: [
          { title: 'Plan', text: 'We agree goals, pages and content in a short written specification.' },
          { title: 'Design', text: 'We create wireframes and visual designs for your review.' },
          { title: 'Build', text: 'We build the site and share previews as it progresses.' },
          { title: 'Launch', text: 'We test across devices, go live and show your team how to use it.' },
        ],
        benefits: [
          { title: 'A professional first impression', text: 'A modern site that builds trust with new customers.' },
          { title: 'More enquiries', text: 'Clear calls to action that make it easy to contact you.' },
          { title: 'Works on every device', text: 'Pages that read well on phones as well as desktops.' },
          { title: 'Easy to update', text: 'Change text and images without needing a developer.' },
        ],
        whoItIsFor: [
          'Businesses without a website or with an outdated one',
          'Companies whose site does not work well on mobile phones',
          'New businesses that need a professional online presence',
          'Organisations relaunching with a new brand or new services',
        ],
        faqs: [
          {
            q: 'How long does a new website take?',
            a: 'A small business website typically takes a few weeks, depending on the number of pages and how quickly content is ready.',
          },
          {
            q: 'Do you write the content?',
            a: 'We can. Many clients provide a first draft and we edit it for clarity, or we write the content from a briefing.',
          },
          {
            q: 'Can you host the website for us?',
            a: 'We can recommend reliable hosting and set it up in your name so you stay in control of your website and domain.',
          },
        ],
      },
      {
        slug: 'mobile-app-design',
        icon: 'smartphone',
        image: 'subMobileApp',
        title: 'Mobile App Design',
        shortDescription:
          'App screens and user journeys for iOS and Android, designed around how people use their phones.',
        overview: [
          'A successful app is simple to understand from the first screen. We design mobile apps around the tasks your users need to complete, following the conventions people already know from iOS and Android.',
          'We map the user journeys, sketch and test the key screens, then produce polished, consistent designs ready for your development team.',
        ],
        whatsIncluded: [
          'A discovery session on users, goals and core features',
          'User journey maps and a screen list',
          'Wireframes for the key screens and flows',
          'A clickable prototype to review on your phone',
          'Final screen designs for iOS and Android',
          'A design hand-off pack for developers',
        ],
        process: [
          { title: 'Discover', text: 'We define who the app is for and what it must help them do.' },
          { title: 'Wireframe', text: 'We sketch the screens and flows and test them with you.' },
          { title: 'Design', text: 'We create the final visual designs and a clickable prototype.' },
          { title: 'Hand off', text: 'We prepare everything your developers need to build the app.' },
        ],
        benefits: [
          { title: 'Fewer surprises in development', text: 'Problems are solved on screen before code is written.' },
          { title: 'Easy to use', text: 'Familiar patterns that help people get started quickly.' },
          { title: 'Consistent design', text: 'A clear visual system across every screen.' },
        ],
        whoItIsFor: [
          'Businesses planning their first mobile app',
          'Teams with an app idea that needs to be shaped before development',
          'Companies redesigning an existing app that users find confusing',
          'Developers who need professional screen designs',
        ],
        faqs: [
          {
            q: 'Do you build the app as well as design it?',
            a: 'This service covers design and the prototype. We can discuss development requirements and work with your chosen developers.',
          },
          {
            q: 'Will the design work on both iOS and Android?',
            a: 'Yes. We design for both platforms and note where each should follow its own conventions.',
          },
          {
            q: 'Can we test the design before development starts?',
            a: 'Yes. The clickable prototype lets you and your users try the main journeys on a real phone.',
          },
        ],
      },
      {
        slug: 'creative-design-ui-development',
        icon: 'palette',
        image: 'subUiDesign',
        title: 'Creative Design / User Interface Development',
        shortDescription: 'Visual design and polished, accessible interfaces built to match your brand.',
        overview: [
          'Good interface design combines clear layout, consistent styling and attention to detail. We create visual designs and build user interfaces that look right, feel responsive and are accessible to everyone.',
          'We can design new interfaces, refresh existing ones or create a reusable set of components so that every page and screen stays consistent with your brand.',
        ],
        whatsIncluded: [
          'Visual design concepts based on your brand',
          'A style guide covering colour, type, spacing and icons',
          'Reusable interface components such as buttons, forms and cards',
          'Accessible, responsive front-end development',
          'Checks against accessibility guidelines and colour contrast',
          'Design files and code handed over to you',
        ],
        process: [
          { title: 'Explore', text: 'We review your brand and agree the look and feel.' },
          { title: 'Design', text: 'We create concepts and refine the chosen direction.' },
          { title: 'Build', text: 'We develop the interface as clean, reusable components.' },
        ],
        benefits: [
          { title: 'A consistent brand', text: 'The same look and behaviour across every page and screen.' },
          { title: 'Accessible to all', text: 'Interfaces that work for people with a range of needs.' },
          { title: 'Faster future work', text: 'Reusable components make new pages quicker to produce.' },
        ],
        whoItIsFor: [
          'Businesses whose website or app looks inconsistent or dated',
          'Teams that need a style guide or component library',
          'Developers who need help with front-end design and build',
          'Organisations that want to improve accessibility',
        ],
        faqs: [
          {
            q: 'Can you work with our existing brand guidelines?',
            a: 'Yes. We build on your existing brand, and can extend it where guidance for digital use is missing.',
          },
          {
            q: 'What do you mean by user interface development?',
            a: 'Turning designs into working front-end code: the pages, buttons, forms and layouts people see and use in the browser.',
          },
          {
            q: 'Do you consider accessibility?',
            a: 'Yes. We design and build with accessibility guidelines in mind, including colour contrast, keyboard use and clear labels.',
          },
        ],
      },
    ],
    process: [
      { title: 'Scope', text: 'We define goals, pages, features and content in a written specification.' },
      { title: 'Design', text: 'Layouts and visual designs for you to review before anything is built.' },
      { title: 'Build', text: 'Development with regular previews so you can see progress and give feedback.' },
      { title: 'Launch', text: 'Testing across devices, go-live, and a handover to your team.' },
    ],
    faqs: [
      {
        q: 'Will I be able to update the website myself?',
        a: 'Yes. Where it suits the project we set up an easy way to edit pages, news and images, and show your team how to use it.',
      },
      {
        q: 'Do you design apps for both iOS and Android?',
        a: 'Yes. We design app screens and user journeys that work on both platforms, ready for development.',
      },
      {
        q: 'Can you improve our existing website rather than rebuild it?',
        a: 'Often, yes. We start by reviewing your current site and will recommend improvements or a redesign depending on which gives you better value.',
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
    summary: 'Content creation and social media management that keeps your brand active.',
    overview: [
      'We help businesses stay visible online with regular, well-made content and consistently managed social media channels.',
      'We plan content around your goals and your audience, keep your channels active and on-brand, and report back on what is working in plain English.',
    ],
    whyChooseUs: [
      { icon: 'penLine', title: 'Your voice', text: 'Content written to sound like your business, not a template.' },
      {
        icon: 'messageSquare',
        title: 'You approve first',
        text: 'Nothing is published until you have seen and approved it.',
      },
      { icon: 'chart', title: 'Clear reporting', text: 'A plain-English monthly summary of results and next steps.' },
    ],
    subServices: [
      {
        slug: 'marketing-content',
        icon: 'penLine',
        image: 'subContent',
        title: 'Marketing Content Creation and Management',
        shortDescription:
          'Posts, articles, images and campaign content planned, written, designed and kept up to date.',
        overview: [
          'Consistent, useful content keeps your business in front of customers and shows what you know. We plan, write and design content for your website, social channels, emails and campaigns.',
          'We work from a content calendar agreed with you, so you always know what is coming. We also keep existing content up to date so nothing on your channels looks neglected.',
        ],
        whatsIncluded: [
          'A content plan with themes, formats and a publishing calendar',
          'Written content such as articles, posts and email newsletters',
          'Branded graphics and simple images for each piece',
          'Editing and proofreading of your own drafts',
          'Regular reviews and updates of existing content',
          'A monthly summary of what was published and how it performed',
        ],
        process: [
          { title: 'Brief', text: 'We learn about your audience, tone of voice and goals.' },
          { title: 'Plan', text: 'We agree a content calendar for the coming weeks.' },
          { title: 'Create', text: 'We write and design content and send it for your approval.' },
          { title: 'Manage', text: 'We publish, review performance and refresh older content.' },
        ],
        benefits: [
          { title: 'Consistency', text: 'Regular content without it becoming a weekly scramble.' },
          { title: 'A professional voice', text: 'Well-written, on-brand content across every channel.' },
          { title: 'Time back', text: 'Your team focuses on the business while content keeps flowing.' },
        ],
        whoItIsFor: [
          'Businesses that know they should publish content but never have time',
          'Teams whose content is irregular or inconsistent in style',
          'Companies launching a new product or service',
          'Organisations with a website or blog that has not been updated',
        ],
        faqs: [
          {
            q: 'What types of content do you create?',
            a: 'Articles, social media posts, newsletters, website copy and simple graphics. We recommend the mix that suits your audience.',
          },
          {
            q: 'How do you learn about our business?',
            a: 'Through an initial briefing and regular short conversations with your team, plus any materials you can share.',
          },
          {
            q: 'Who owns the content?',
            a: 'You do. Content created for you is yours to use as you wish.',
          },
        ],
      },
      {
        slug: 'social-media-management',
        icon: 'share',
        image: 'subSocial',
        title: 'Social Media Management',
        shortDescription:
          'Day-to-day management of your social channels, from planning and scheduling to replying to comments.',
        overview: [
          'Active, well-managed social media channels help customers find you, trust you and stay in touch. We manage your accounts day to day so they stay active, consistent and on-brand.',
          'We plan and schedule posts, respond to comments and messages within agreed guidelines, and report back each month on what is working and what we will change.',
        ],
        whatsIncluded: [
          'A review of your current social media accounts',
          'Profile set-up or tidy-up with consistent branding',
          'A monthly posting plan for each platform',
          'Post scheduling and publishing',
          'Monitoring and replying to comments and messages',
          'A monthly performance report with recommendations',
        ],
        process: [
          { title: 'Audit', text: 'We review your accounts, audience and competitors.' },
          { title: 'Plan', text: 'We agree platforms, posting frequency and tone of voice.' },
          { title: 'Manage', text: 'We publish, monitor and respond day to day.' },
          { title: 'Report', text: 'We share results each month and refine the plan.' },
        ],
        benefits: [
          { title: 'Always active', text: 'Regular posting that shows your business is open and engaged.' },
          { title: 'Faster responses', text: 'Comments and messages answered promptly.' },
          { title: 'Clear insight', text: 'Know which posts work and why.' },
        ],
        whoItIsFor: [
          'Businesses whose social channels are quiet or inconsistent',
          'Owners who do not have time to post and reply every day',
          'Companies that want to build a local or specialist following',
          'Teams that need a more professional presence on social media',
        ],
        faqs: [
          {
            q: 'Which platforms do you manage?',
            a: 'Commonly Facebook, Instagram, LinkedIn and X. We recommend focusing on the platforms your customers actually use.',
          },
          {
            q: 'Do you run paid social media adverts?',
            a: 'This service focuses on organic posting and community management. Let us know if you are considering paid campaigns and we can discuss it.',
          },
          {
            q: 'How do you handle negative comments?',
            a: 'We agree response guidelines with you in advance and refer anything sensitive to you before replying.',
          },
        ],
      },
    ],
    process: [
      { title: 'Review', text: 'A look at your current channels, content, audience and competitors.' },
      { title: 'Plan', text: 'A content calendar with themes, formats and posting schedule.' },
      { title: 'Create', text: 'Content written and designed for your approval before it goes live.' },
      { title: 'Manage', text: 'Ongoing publishing, community management and monthly reporting.' },
    ],
    faqs: [
      {
        q: 'Which social media platforms do you manage?',
        a: 'We work with the platforms your customers use most, such as Facebook, Instagram, LinkedIn and X. We recommend where to focus based on your audience.',
      },
      {
        q: 'Do we approve content before it is posted?',
        a: 'Yes. We share content in advance so you can review and approve it, and agree how quickly you would like to respond to comments.',
      },
      {
        q: 'How will we know what is working?',
        a: 'We send a monthly report showing what was published, how people responded, and what we plan to change next.',
      },
    ],
    related: ['business-advertisement', 'web-development'],
  },
  {
    slug: 'business-advertisement',
    icon: 'megaphone',
    image: 'advertising',
    detailImage: 'advertisingDetail',
    title: 'Business Advertisement Services',
    summary: 'Logos, flyers, brochures and trademark support for your brand.',
    overview: [
      'We help businesses present themselves professionally, from the logo that identifies them to the printed materials that bring in customers.',
      'Every design is created around your brand and audience, prepared ready for print or digital use, and supplied in the formats you need.',
    ],
    whyChooseUs: [
      { icon: 'palette', title: 'Designed for you', text: 'Original designs created around your brand and audience.' },
      {
        icon: 'refresh',
        title: 'Revisions included',
        text: 'Agreed rounds of changes until you are happy with the result.',
      },
      { icon: 'fileText', title: 'Ready to use', text: 'Files supplied ready for print, web and social media.' },
    ],
    subServices: [
      {
        slug: 'logo-design',
        icon: 'shapes',
        image: 'subLogo',
        title: 'Logo Design',
        shortDescription:
          'A distinctive logo with variations for print, web and social media, supplied in all key formats.',
        overview: [
          'Your logo appears on everything from your website to your invoices, so it needs to be distinctive, memorable and work at any size. We design original logos that reflect your business and appeal to your customers.',
          'We start with a short brief, present a selection of concepts, and refine your chosen design until it is right. You receive a complete set of files and simple guidance on using your logo.',
        ],
        whatsIncluded: [
          'A design brief covering your business, audience and preferences',
          'A selection of original logo concepts',
          'Rounds of revisions on your chosen concept',
          'Colour, black and white, and reversed versions',
          'Files for print, web and social media profiles',
          'A one-page guide to colours, fonts and logo use',
        ],
        process: [
          { title: 'Brief', text: 'We learn about your business, competitors and style preferences.' },
          { title: 'Concepts', text: 'We present initial logo ideas with the thinking behind each.' },
          { title: 'Refine', text: 'We develop your chosen concept based on your feedback.' },
          { title: 'Deliver', text: 'We supply the final files and usage guide.' },
        ],
        benefits: [
          { title: 'Instant recognition', text: 'A logo customers can recognise and remember.' },
          { title: 'Works everywhere', text: 'Clear at small sizes, on screen and in print.' },
          { title: 'A professional image', text: 'A polished identity that builds confidence in your business.' },
        ],
        whoItIsFor: [
          'New businesses that need a logo before launch',
          'Established companies whose logo looks dated',
          'Businesses rebranding or adding a new product line',
          'Owners whose current logo does not work well online',
        ],
        faqs: [
          {
            q: 'Do we own the logo?',
            a: 'Yes. Once the project is complete and paid for, all rights to the final logo are transferred to you.',
          },
          {
            q: 'What file formats will we receive?',
            a: 'Vector files for print and scaling, plus PNG and SVG files for websites, documents and social media.',
          },
          {
            q: 'Can you check that our logo is not already in use?',
            a: 'We design original work and can carry out basic searches, and our trademark support service can help you go further.',
          },
        ],
      },
      {
        slug: 'flyer-design',
        icon: 'fileText',
        image: 'subFlyer',
        title: 'Flyer Design',
        shortDescription: 'Eye-catching flyers for promotions, events and launches, ready for print or sharing online.',
        overview: [
          'A good flyer gets one message across quickly and tells people exactly what to do next. We design flyers for promotions, events, openings and launches that stand out and stay on-brand.',
          'We prepare files ready for professional printing and versions sized for email and social media, so one design works across all your channels.',
        ],
        whatsIncluded: [
          'A short brief on the message, audience and call to action',
          'Copywriting support for headlines and key details',
          'Single or double-sided flyer design in common sizes',
          'Rounds of revisions to perfect the design',
          'Print-ready files with correct bleed and colour settings',
          'Digital versions for email and social media',
        ],
        process: [
          { title: 'Brief', text: 'We agree the purpose, audience, size and deadline.' },
          { title: 'Design', text: 'We create the layout and send a proof for review.' },
          { title: 'Deliver', text: 'We make your changes and supply print and digital files.' },
        ],
        benefits: [
          { title: 'A clear message', text: 'Designed to be understood at a glance.' },
          { title: 'Print-ready', text: 'Files your printer can use without further changes.' },
          { title: 'Quick turnaround', text: 'Ideal for time-sensitive promotions and events.' },
        ],
        whoItIsFor: [
          'Businesses promoting an offer, event or opening',
          'Local services distributing leaflets in their area',
          'Organisations exhibiting at trade shows and fairs',
          'Teams who need a flyer to share digitally as well as in print',
        ],
        faqs: [
          {
            q: 'Can you arrange printing?',
            a: 'Yes. We can coordinate printing for you, or supply files for your preferred printer.',
          },
          {
            q: 'What sizes can you design for?',
            a: 'Any standard size, including A4, A5 and DL, as well as custom sizes on request.',
          },
          {
            q: 'Can we reuse the design for future promotions?',
            a: 'Yes. We can set up the design so it is easy to update with new dates and offers.',
          },
        ],
      },
      {
        slug: 'brochure-design',
        icon: 'bookOpen',
        image: 'subBrochure',
        title: 'Brochure Design',
        shortDescription: 'Clear, well-structured brochures that explain your products and services professionally.',
        overview: [
          'A brochure gives customers something to keep, share and refer back to. We design brochures that explain what you offer clearly, look professional and reflect the quality of your business.',
          'We help organise your content into a logical structure, design each page for easy reading, and prepare it for print and as a PDF for your website and emails.',
        ],
        whatsIncluded: [
          'Content planning and page structure',
          'Editing support to make copy clear and concise',
          'Layout design for folded or multi-page brochures',
          'Image sourcing or use of your own photography',
          'Print-ready files and an interactive PDF',
          'Coordination with your printer if required',
        ],
        process: [
          { title: 'Plan', text: 'We agree the purpose, format, page count and content.' },
          { title: 'Design', text: 'We lay out the pages and send proofs for review.' },
          { title: 'Refine', text: 'We make your changes and check every detail.' },
          { title: 'Deliver', text: 'We supply print-ready files and a digital PDF.' },
        ],
        benefits: [
          { title: 'Easy to understand', text: 'Your products and services explained in a clear order.' },
          { title: 'Long-lasting', text: 'A piece customers keep and pass on to others.' },
          { title: 'Print and digital', text: 'One design that works on paper and on screen.' },
        ],
        whoItIsFor: [
          'Businesses with a range of products or services to explain',
          'Companies attending meetings, events or exhibitions',
          'Organisations whose current brochure is out of date',
          'Sales teams who need professional materials to leave with clients',
        ],
        faqs: [
          {
            q: 'What formats do you design?',
            a: 'Bi-fold and tri-fold leaflets, multi-page brochures and digital PDF brochures.',
          },
          {
            q: 'Can you write the content?',
            a: 'We can edit your existing content or write new copy from a briefing.',
          },
          {
            q: 'Can we update the brochure later?',
            a: 'Yes. We keep the design files so updates can be made quickly when your services or prices change.',
          },
        ],
      },
      {
        slug: 'trademark',
        icon: 'badgeCheck',
        image: 'subTrademark',
        title: 'Trademark',
        shortDescription: 'Help preparing a trademark application to protect your business name and logo.',
        overview: [
          'A registered trademark can help protect your business name, logo or slogan. We help you understand the application process and prepare the information you need to apply.',
          'We help you gather and organise the details of your mark, identify the relevant goods and services categories, and check your application is complete before you submit it.',
        ],
        // TODO(client): confirm scope. We describe preparation support only; legal advice on
        // trademark availability or disputes should come from a qualified trademark attorney.
        whatsIncluded: [
          'An explanation of the trademark application process',
          'Help preparing clear images and descriptions of your mark',
          'Help identifying the relevant goods and services classes',
          'Basic searches of existing published trademarks',
          'A check of your application for completeness before submission',
          'Guidance on next steps after the application is filed',
        ],
        process: [
          { title: 'Discuss', text: 'We talk through what you want to protect and where.' },
          { title: 'Prepare', text: 'We help gather the details and documents for the application.' },
          { title: 'Check', text: 'We review the application with you before you submit it.' },
        ],
        benefits: [
          { title: 'A clearer process', text: 'Understand each step and what information is needed.' },
          { title: 'Fewer mistakes', text: 'A complete, well-prepared application.' },
          { title: 'Joined-up branding', text: 'Support that connects naturally with your logo design.' },
        ],
        whoItIsFor: [
          'New businesses that want to protect their name and logo',
          'Companies launching a new brand or product name',
          'Owners applying for a trademark for the first time',
        ],
        faqs: [
          {
            q: 'Does trademark support guarantee registration?',
            a: 'No. Registration is decided by the relevant intellectual property office. We help you prepare a clear, complete application.',
          },
          {
            q: 'Are you trademark attorneys?',
            a: 'No. We provide practical preparation support. If your case involves legal questions or a dispute, we recommend speaking to a qualified trademark attorney.',
          },
          {
            q: 'Are there official fees?',
            a: 'Yes. The intellectual property office charges an application fee, which is paid directly to them and is separate from our fee.',
          },
        ],
      },
    ],
    process: [
      { title: 'Brief', text: 'We agree your audience, message, style and deadlines.' },
      { title: 'Concepts', text: 'Initial design ideas for you to review and choose from.' },
      { title: 'Refine', text: 'Revisions based on your feedback until the design is right.' },
      { title: 'Deliver', text: 'Final files prepared for print and digital use.' },
    ],
    faqs: [
      {
        q: 'What files will we receive for our logo?',
        a: 'You receive your logo in formats suitable for print, web and social media, including versions for light and dark backgrounds.',
      },
      {
        q: 'Can you arrange printing?',
        a: 'Yes. We can prepare print-ready files for your own printer or coordinate printing for you.',
      },
      {
        q: 'Does trademark support guarantee registration?',
        a: 'No. Registration is decided by the relevant intellectual property office. We help you prepare a clear, complete application.',
      },
    ],
    related: ['digital-marketing', 'web-development'],
  },
  {
    slug: 'general-services',
    icon: 'layers',
    image: 'general',
    detailImage: 'generalDetail',
    title: 'General Services',
    summary: 'Passport and travel documentation support for the US, UK and India.',
    overview: [
      'Applying for a passport or preparing travel documents can be time-consuming and confusing. We help you understand what is needed and prepare your paperwork carefully.',
      'We guide you through the forms, check your documents before submission, and explain each step, so you can apply with confidence.',
    ],
    whyChooseUs: [
      {
        icon: 'clipboardList',
        title: 'Careful checking',
        text: 'Forms and documents checked before you submit them.',
      },
      { icon: 'messageSquare', title: 'Clear guidance', text: 'Each step explained in plain English.' },
      { icon: 'users', title: 'Families welcome', text: 'Help preparing applications for several people at once.' },
    ],
    // TODO(client): confirm the exact scope. In the UK, advising on visas or immigration is
    // regulated (OISC), so keep this copy to document preparation unless the company is registered.
    subServices: [
      {
        slug: 'passport-assistance',
        icon: 'bookUser',
        image: 'subPassport',
        title: 'Passport Assistance (New and Renewal of Applications)',
        shortDescription: 'Help completing and checking new passport and renewal applications before you submit them.',
        overview: [
          'Mistakes on a passport application, such as a missing document or an unsuitable photo, can cause delays. We help you complete new and renewal applications correctly the first time.',
          'We explain what is required, help you fill in the forms, and check your photos and supporting documents before you submit the application to the issuing authority.',
        ],
        whatsIncluded: [
          'An explanation of the application requirements for your situation',
          'A checklist of the forms, photos and supporting documents needed',
          'Help completing the application form, online or on paper',
          'A check of photos against the published requirements',
          'A final review of the full application before submission',
          'Guidance on submitting, tracking and next steps',
        ],
        process: [
          { title: 'Consult', text: 'We confirm whether you need a new passport or a renewal.' },
          { title: 'Prepare', text: 'We help complete the forms and gather documents.' },
          { title: 'Check', text: 'We review everything before you submit the application.' },
        ],
        benefits: [
          { title: 'Fewer delays', text: 'Common mistakes are spotted before submission.' },
          { title: 'Peace of mind', text: 'Know your application is complete and correct.' },
          { title: 'Time saved', text: 'Clear guidance instead of searching for answers.' },
        ],
        whoItIsFor: [
          'First-time applicants, including children',
          'People renewing an expired or damaged passport',
          'Families applying for several passports at once',
          'Anyone unsure which documents they need',
        ],
        faqs: [
          {
            q: 'Are you a government office?',
            a: 'No. We are an independent company that helps you prepare your application. Decisions are made by the issuing authority, and official fees are paid to them directly.',
          },
          {
            q: 'Which passports can you help with?',
            a: 'We can help prepare applications for US, UK and Indian passports. Contact us to check your specific situation.',
          },
          {
            q: 'Can you speed up my application?',
            a: 'No. Processing times are set by the issuing authority, but a complete and correct application helps avoid avoidable delays.',
          },
        ],
      },
      {
        slug: 'travel-documentation-support',
        icon: 'plane',
        image: 'subTravel',
        title: 'Travel Documentation Support (US, UK, India)',
        shortDescription:
          'Help gathering, organising and checking the documents needed for travel to the US, UK and India.',
        overview: [
          'Travel paperwork often involves several documents, each with its own requirements. We help you understand which documents the published guidance asks for and organise them before you travel or apply.',
          'We provide practical help with forms, checklists and document preparation for trips to the United States, the United Kingdom and India, so you can approach your application in an organised way.',
        ],
        whatsIncluded: [
          'A review of your travel plans and the documents you hold',
          'A checklist based on the official published guidance',
          'Help completing application forms accurately',
          'Organising and checking supporting documents',
          'Reminders about validity dates and appointment preparation',
          'A final check of your document pack before you submit',
        ],
        process: [
          { title: 'Review', text: 'We look at where you are travelling and what you already have.' },
          { title: 'Organise', text: 'We prepare a checklist and help gather your documents.' },
          { title: 'Check', text: 'We review your forms and documents before you submit them.' },
        ],
        benefits: [
          { title: 'Organised paperwork', text: 'All your documents in order and easy to find.' },
          { title: 'Fewer mistakes', text: 'Forms checked for missing or inconsistent details.' },
          { title: 'Less stress', text: 'Clear steps so you know what to do and when.' },
        ],
        whoItIsFor: [
          'Travellers to the US, UK or India preparing their paperwork',
          'Families travelling together with several sets of documents',
          'Business travellers with limited time to prepare',
          'People who find official forms confusing',
        ],
        faqs: [
          {
            q: 'Do you give visa or immigration advice?',
            a: 'No. We help with forms and document preparation only. For advice on visa or immigration eligibility, please consult a regulated adviser or the official government guidance.',
          },
          {
            q: 'Can you guarantee my application will be approved?',
            a: 'No. Decisions are made by the relevant authorities. We help you submit a complete and well-organised application.',
          },
          {
            q: 'Are official fees included in your price?',
            a: 'No. Official fees are paid directly to the relevant authority and are separate from our service fee.',
          },
        ],
      },
    ],
    process: [
      { title: 'Consult', text: 'We find out what you need, where you are travelling and your timescales.' },
      { title: 'Checklist', text: 'A clear list of the forms, photos and supporting documents required.' },
      { title: 'Prepare', text: 'We help you complete the forms and check everything before submission.' },
      { title: 'Follow up', text: 'We stay available to answer questions while your application is processed.' },
    ],
    faqs: [
      {
        q: 'Are you a government office?',
        a: 'No. We are an independent company that helps you prepare your application. Decisions are made by the issuing authority, and official fees are paid to them directly.',
      },
      {
        q: 'Can you speed up my application?',
        a: 'Processing times are set by the issuing authority. We help make sure your application is complete and correct, which avoids delays caused by mistakes.',
      },
      {
        q: 'What should I bring to our first meeting?',
        a: 'Your current passport if you have one, and any documents you already hold. We will send you a full checklist after our first conversation.',
      },
    ],
    related: ['management-consultancy', 'business-advertisement'],
  },
];

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug);
}

export function getSubService(service, subSlug) {
  return service?.subServices.find((sub) => sub.slug === subSlug);
}

// Every routable service URL, used by the sitemap and the route check script.
export const serviceRoutes = services.flatMap((service) => [
  `/services/${service.slug}`,
  ...service.subServices.map((sub) => `/services/${service.slug}/${sub.slug}`),
]);
