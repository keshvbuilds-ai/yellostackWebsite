export type BlogPost = {
  slug: string; title: string; date: string; category: string;
  summary: string; paragraphs: string[]; source: string;
};

// Original titles, dates and paths are retained from the published archive.
// Local article text is an editorial summary, never a fabricated original body.
const entries: [string, string, string, string][] = [
  ['from-hype-to-reality-ai-in-2025', 'From Hype to Reality: AI in 2025', '2025-09-24', 'AI'],
  ['cloud-based-mobile-app-development-in-saudi-arabia', 'Cloud Based Mobile App Development in Saudi Arabia', '2022-02-17', 'Cloud'],
  ['best-web-development-company-in-saudi-arabia-2022', 'Best Web Development Company in Saudi Arabia 2022', '2022-02-02', 'Web development'],
  ['top-10-blog-publishing-platforms-in-2022', 'Top 10 Blog Publishing Platforms in 2022', '2022-01-18', 'Digital marketing'],
  ['software-technologies-in-demand-2022', 'Software Technologies In-Demand 2022', '2022-01-04', 'Software'],
  ['why-small-businesses-cant-ignore-mobile-apps-anymore', 'Why Small Businesses Can’t Ignore Mobile Apps Anymore?', '2021-12-16', 'Mobile apps'],
  ['15-free-seo-tools-to-increase-website-traffic-in-saudi-arabia-2022', '15 Free SEO Tools to Increase Website Traffic in Saudi Arabia 2022', '2021-12-01', 'Digital marketing'],
  ['best-software-development-company-in-saudi-arabia', 'Best Software Development Company in Saudi Arabia', '2021-11-16', 'Software'],
  ['why-is-it-necessary-to-launch-mobile-app-for-your-restaurant-food-business', 'Why is it necessary to launch mobile app for your restaurant & food business', '2021-11-01', 'Mobile apps'],
  ['top-trends-of-voice-ai-in-mobile-app-development', 'Top Trends of Voice & AI in Mobile App Development', '2021-10-18', 'AI'],
  ['reasons-why-your-app-needs-an-efficient-ui-ux-design', 'Reasons why your app needs an efficient UI UX design', '2021-10-01', 'Design'],
  ['best-practices-to-improve-the-quality-of-nearby-messages-api', 'Best practices to improve the quality of Nearby Messages API', '2021-09-16', 'Mobile apps'],
  ['school-app-for-specially-abled-students', 'School App for Specially-abled Students', '2021-09-01', 'Mobile apps'],
  ['top-5-benefits-of-wireframe-design-in-mobile-app-development-in-saudi-arabia', 'Top 5 Benefits of Wireframe Design in Mobile App Development in Saudi Arabia', '2021-08-17', 'Design'],
  ['how-to-enable-multiple-gesture-recognizer', 'How to Enable Multiple Gesture Recognizer!', '2021-08-03', 'Mobile apps'],
  ['how-to-improve-website-loading-speed', 'How to improve Website Loading Speed?', '2021-07-19', 'Web development'],
  ['uber-like-app-development-in-saudi-arabia', 'How to Build Uber-like App in Saudi Arabia', '2021-07-02', 'Mobile apps'],
  ['own-your-on-demand-delivery-application-like-hungerstation-in-saudi-arabia', 'Food Delivery App like Hunger Station in Saudi Arabia', '2021-06-17', 'Mobile apps'],
  ['how-to-add-google-analytics-tracking-code-to-your-website', 'How to Add Google Analytics Tracking Code to Your Website?', '2021-06-02', 'Digital marketing'],
  ['kotlin-the-future-of-app-development-framework-in-2021', 'Kotlin – The future of App Development Framework in 2021', '2021-05-15', 'Mobile apps'],
  ['6-steps-to-market-your-mobile-app', '6 Steps to Market Your Mobile APP', '2021-05-07', 'Digital marketing'],
  ['yellostack-the-best-mobile-app-development-company-in-saudi-arabia-2022', 'YelloStack – The Best Mobile App Development Company in Saudi Arabia – 2022', '2021-04-21', 'Mobile apps'],
  ['how-to-setup-video-calling-in-ios-app-using-agora-io', 'How to Setup Video Calling in iOS App using Agora.io?', '2021-04-01', 'Mobile apps'],
  ['how-yellostack-developed-online-doctor-consultation-app-in-saudi-arabia-2021', 'How YelloStack Developed Online Doctor Consultation App in Saudi Arabia 2021?', '2021-03-15', 'Healthcare'],
  ['how-yellostack-is-rated-as-the-top-app-development-company-in-saudi-arabia', 'How YelloStack is rated as the Top App Development Company in Saudi Arabia?', '2021-03-01', 'Mobile apps'],
  ['top-5-hybrid-mobile-app-development-companies-in-saudi-arabia', 'Top 5 Hybrid Mobile App Development Companies in Saudi Arabia', '2021-02-16', 'Mobile apps'],
  ['best-tools-to-boost-e-commerce-business', 'Best Tools to Boost E-Commerce Business', '2021-02-03', 'E-commerce'],
  ['top-10-mobile-app-development-company-in-saudi-arabia', 'Top 10 Mobile App Development Company in Saudi Arabia', '2021-01-20', 'Mobile apps'],
  ['how-to-increase-organic-traffic-with-clutch-co', 'How to increase Organic traffic with Clutch', '2021-01-04', 'Digital marketing'],
  ['best-erp-service-consultant-in-saudi-arabia', 'Best ERP Service Consultant in Saudi Arabia', '2020-12-15', 'Enterprise'],
  ['tips-to-create-new-mobile-app-development', 'Tips to Create New Mobile App Development', '2020-11-17', 'Mobile apps'],
];

const summaries: Record<string, { summary: string; paragraphs: string[] }> = {
  'from-hype-to-reality-ai-in-2025': {
    summary: 'A perspective on AI moving from ambitious promises into everyday business workflows.',
    paragraphs: ['This 2025 article explores the shift from experimentation to practical uses of artificial intelligence. It discusses applications across business, education, healthcare and everyday digital experiences.', 'Its central argument is about helping people work with AI: automating repetitive tasks so there is more room for creative and strategic work. The article also identifies privacy, ethics and responsible use as considerations for adoption.'],
  },
  'cloud-based-mobile-app-development-in-saudi-arabia': {
    summary: 'Cloud infrastructure, connected applications and the decisions behind a scalable mobile experience.',
    paragraphs: ['The article considers cloud-backed applications that use remote services for processing and data storage. A mobile interface connects to those services through APIs, while selected data can be cached locally.', 'It introduces scalability, device access and infrastructure planning as reasons to consider this approach. It also discusses offline synchronisation, third-party integrations, backups and the differences between private, public and hybrid environments.', 'Published in 2022, it is an archive perspective on planning cloud applications, rather than a current comparison of cloud providers.'],
  },
  'best-web-development-company-in-saudi-arabia-2022': {
    summary: 'Connecting responsive design, business goals and the technical foundations of a website.',
    paragraphs: ['Yellostack’s 2022 article describes website development as a coordinated process across design, front-end engineering, back-end systems and search visibility.', 'It outlines responsive layouts, brand customisation, multilingual content, blogs and enquiry forms as parts of a business website. The planning process starts with what the organisation wants to accomplish and the services it needs to communicate.', 'The article also covers custom web applications, intranets and business portals, with usability and a clear customer journey as recurring themes.'],
  },
  'top-10-blog-publishing-platforms-in-2022': {
    summary: 'An archive guide to publishing tools and the different ways a business can share its ideas.',
    paragraphs: ['This 2022 overview compares hosted publishing, website builders and professional networks. It features Blogger, WordPress, Wix, Medium, LinkedIn, HubSpot, Squarespace, Weebly, Marketing 360 and Tumblr.', 'The article explores differences in customisation, built-in audiences, visual editing and marketing tools. Its platform details reflect the publication date; the original remains available for historical reference.'],
  },
  'why-small-businesses-cant-ignore-mobile-apps-anymore': {
    summary: 'How mobile applications can connect customer service, brand communication and repeat engagement.',
    paragraphs: ['This article explores the role of a dedicated app in a small business’s customer relationship. It considers loyalty, product discovery, promotions and access to customer service.', 'It also discusses using behaviour and engagement data to understand how people interact with an application. The perspective is from 2021 and reflects the business environment of that period.'],
  },
  '15-free-seo-tools-to-increase-website-traffic-in-saudi-arabia-2022': {
    summary: 'A historical collection of tools for search analysis, site audits and content discovery.',
    paragraphs: ['The original article groups SEO work around understanding visitors, researching keywords, checking a website and reviewing links. It includes analytics, search-console tools, sitemap generators and page-performance checks.', 'Published in 2021 for the following year, this is an archive overview. Product availability, free plans and technical instructions may have changed since publication.'],
  },
  'best-software-development-company-in-saudi-arabia': {
    summary: 'An overview of Yellostack’s application, enterprise, branding and cloud capabilities.',
    paragraphs: ['Yellostack describes a software approach that begins with the organisation’s needs and the people using the product. The article covers mobile and web applications, enterprise software, branding, marketing and cloud services.', 'It also discusses custom systems across sectors such as healthcare, education, commerce, manufacturing and logistics, bringing industry requirements together with technical delivery.'],
  },
  'why-is-it-necessary-to-launch-mobile-app-for-your-restaurant-food-business': {
    summary: 'The customer, restaurant and delivery workflows behind a food-service application.',
    paragraphs: ['The article separates a food application into customer ordering, restaurant administration and delivery operations. It discusses registration, menus, payments, promotions and order tracking.', 'It compares several business models, including ordering-only, delivery and multi-vendor services. The article also mentions Yellostack’s Line & Dine restaurant booking and food application work.'],
  },
  'reasons-why-your-app-needs-an-efficient-ui-ux-design': {
    summary: 'A look at the relationship between an application’s interface and the experience of using it.',
    paragraphs: ['The article introduces UI and UX as related but distinct parts of an application. It considers how thoughtful design can support usability and the way customers experience a business.', 'The original discussion places design within the broader process of creating mobile and web applications.'],
  },
  'best-practices-to-improve-the-quality-of-nearby-messages-api': {
    summary: 'An archived technical discussion of proximity-based communication between applications.',
    paragraphs: ['This 2021 article describes the Nearby Messages publish-subscribe model and its use of device proximity to coordinate small messages through a server.', 'It discusses project configuration, discovery and the scope of shared information. This is a historical technical article, not implementation guidance for current APIs.'],
  },
};

export const blogPosts: BlogPost[] = entries.map(([slug, title, date, category]) => ({
  slug, title, date, category,
  source: `https://www.yellostack.com/blog/${slug}/`,
  summary: summaries[slug]?.summary ?? `From the Yellostack ${category.toLowerCase()} archive.`,
  paragraphs: summaries[slug]?.paragraphs ?? [],
}));

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
