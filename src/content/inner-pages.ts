export type ContentSection = { title: string; body: string; items?: string[] };
export type InnerPage = {
  slug: string; title: string; eyebrow: string; intro: string;
  kind: 'company' | 'service' | 'directory' | 'contact' | 'portfolio';
  group?: string; source: string; sections: ContentSection[];
};

const service = (slug: string, title: string, group: string, intro: string, sections: ContentSection[]): InnerPage => ({
  slug, title, group, eyebrow: group, intro, sections, kind: 'service', source: `https://www.yellostack.com/${slug}`,
});

export const servicePages: InnerPage[] = [
  service('mobile-application-development-company-saudi-arabia', 'Mobile app development', 'Applications', 'Bring your business closer to the people who use it. Mobile experiences for Android, iOS and the everyday moments that matter.', [
    { title: 'Built around your customers.', body: 'Yellostack develops native and hybrid applications with features shaped around your business requirements. From a first concept to an established service, the experience starts with understanding your users.', items: ['Android and iOS applications', 'Cross-platform experiences', 'Custom mobile solutions', 'E-commerce applications'] },
    { title: 'One connected product.', body: 'Connect the interface, business logic and supporting systems so customers can move through your service with less friction.' },
  ]),
  service('sharepoint', 'SharePoint services', 'Applications', 'A more connected workspace for your people, documents and daily operations.', [
    { title: 'Make information work together.', body: 'SharePoint consulting, development, migration and support help bring scattered information into a shared working environment.', items: ['Company intranets', 'Client and internet portals', 'Document management', 'Correspondence management', 'Custom SharePoint solutions'] },
    { title: 'Support through change.', body: 'Plan your implementation around the way your teams collaborate, with migration and ongoing support considered from the outset.' },
  ]),
  service('ecommerce-website-development', 'E-commerce development', 'Applications', 'Turn browsing into a connected shopping experience, from the first product discovery to the next order.', [
    { title: 'Your storefront. Your workflow.', body: 'Yellostack builds responsive online stores and shopping applications with customer-facing experiences and tools to manage daily sales.', items: ['Product and offer management', 'Carts, wishlists and customer accounts', 'Payment gateway integration', 'Order tracking and refund management', 'Administration and database backups'] },
    { title: 'Room for your business to grow.', body: 'Choose the features your catalogue and operations need, with a shopping experience designed for both mobile and desktop.' },
  ]),
  service('website-design-company', 'Web design & development', 'Applications', 'A digital home for your business. Clear, useful and unmistakably yours.', [
    { title: 'A direct creative partnership.', body: 'Work closely with the design and development team to shape a website around your goals, brand and customers. The original Yellostack approach puts collaboration and a clearly defined scope at the centre.' },
    { title: 'Design meets delivery.', body: 'Bring visual identity, content and development together into an experience that is easy to navigate and built for the way people browse.', items: ['Business websites', 'Responsive interfaces', 'Custom web experiences', 'E-commerce websites'] },
  ]),
  service('custom-software-development', 'Custom software development', 'Applications', 'Software that fits the way your business works, with the flexibility to support what comes next.', [
    { title: 'Start with the right architecture.', body: 'We define business objectives and requirements before designing, developing, testing and integrating a solution. Clear system designs and documentation guide the implementation.', items: ['Business process digitisation', 'System integration', 'Reporting and delegation', 'Industry-specific applications'] },
    { title: 'Connect your operations.', body: 'Yellostack’s published capabilities span construction, manufacturing, education, healthcare, retail, hospitality and travel, including integrations with existing enterprise systems.' },
  ]),
  service('erp-services', 'ERP services', 'Enterprise software', 'Bring people, processes and business information into a more connected enterprise.', [
    { title: 'From selection to support.', body: 'ERP consulting covers evaluation, implementation, enhancement, training and maintenance. Start by understanding your operations and choosing a platform suited to the business.', items: ['ERP audits and consulting', 'Implementation and integration', 'Enhancements and customisation', 'Training and maintenance'] },
    { title: 'An enterprise-wide view.', body: 'Yellostack’s published ERP offering includes Microsoft Dynamics solutions, bringing operational and financial information into connected business applications.' },
  ]),
  service('travel-dynamic', 'Travel Dynamics Plus', 'Enterprise software', 'Connect travel operations and back-office accounting in one industry-focused system.', [
    { title: 'From booking to reconciliation.', body: 'Travel Dynamics Plus supports travel and tourism workflows with invoicing, vouchers and integrated financial modules.', items: ['GDS, airline and travel-service invoicing', 'Customer and supplier accounts', 'Sales reports and analytics', 'Refund and payment management', 'Financial reporting'] },
    { title: 'A practical deployment.', body: 'The published platform uses Microsoft .NET and SQL Server, with on-premise and hosted deployment options, user training and support.' },
  ]),
  service('freight-dynamic', 'Freight Dynamics Plus', 'Enterprise software', 'Give logistics teams a connected view of freight, warehouses and financial operations.', [
    { title: 'Keep operations moving.', body: 'FD Plus brings freight-forwarding workflows together with accounting for forwarders, supply-chain providers, couriers and warehouse operators.', items: ['Container freight station management', 'Ocean and air freight forwarding', 'Warehouse and inventory management', 'Dispatch and inland distribution', 'Fleet and asset management'] },
    { title: 'Visibility across the journey.', body: 'Track goods from receipt through storage and dispatch, with documentation, invoicing and operational reporting connected to the same workflow.' },
  ]),
  service('retail-dynamic', 'Retail Dynamics Plus', 'Enterprise software', 'Explore Yellostack’s retail software offering and discuss the needs of your stores and operations.', [
    { title: 'Built around your retail business.', body: 'Retail Dynamics Plus is listed in Yellostack’s enterprise software portfolio. Contact the team to discuss the product, your requirements and the available implementation options.' },
  ]),
  service('enterprise-dynamic-plus', 'Enterprise Dynamics Plus', 'Enterprise software', 'A connected ERP foundation for small and medium-sized businesses.', [
    { title: 'Connect the essential functions.', body: 'ED Plus is a Microsoft-platform ERP offering that can be tailored to different business models, including trading, construction and contracting.', items: ['Inventory and purchasing', 'Finance and accounting', 'HR and payroll', 'Project management and costing'] },
    { title: 'From transactions to decisions.', body: 'Bring stock movements, customer and supplier accounts, payroll and project reports together to support day-to-day management.' },
  ]),
  service('facilities-management', 'Facility management software', 'Enterprise software', 'Manage buildings, assets and the services people rely on through a modular web platform.', [
    { title: 'One view of your facilities.', body: 'Coordinate facilities work, service requests and occupancy with modules designed around corporate buildings and their users.', items: ['Assets and maintenance', 'Helpdesk and work orders', 'Space planning and facility bookings', 'Tenant billing', 'Projects and analytical reports'] },
    { title: 'Operations that stay connected.', body: 'The published offering includes building-management integration, energy dashboards, feedback and workflow tools.' },
  ]),
  service('digital-marketing-agency', 'Digital marketing', 'Growth', 'Connect your brand with the people who are looking for it.', [
    { title: 'A plan built around your audience.', body: 'Yellostack develops marketing strategies around consumer insights, brand needs and business objectives, bringing different channels into a coordinated plan.', items: ['Social media marketing', 'Content writing', 'Email marketing', 'Search engine optimisation'] },
    { title: 'Make each touchpoint count.', body: 'Extend your brand across the channels your customers use, with content and communication that work together.' },
  ]),
  service('search-engine-optimization', 'Search engine optimisation', 'Growth', 'Help the right audience discover your business through organic search.', [
    { title: 'Understand. Improve. Measure.', body: 'Begin with website analysis and keyword research, then improve the content and structure that help people and search engines understand your offering.', items: ['Website analysis', 'Keyword research', 'On-page optimisation', 'Link development', 'Reporting and analysis'] },
    { title: 'Visibility with a purpose.', body: 'Connect your search strategy with useful content and a clear path from discovery to enquiry.' },
  ]),
  service('cloud-migration', 'Cloud migration', 'Cloud', 'Move applications and infrastructure forward with a considered cloud strategy.', [
    { title: 'Plan the move. Support the environment.', body: 'Yellostack’s cloud services cover migration from on-premise infrastructure, resource optimisation and ongoing management.', items: ['Cloud readiness and migration', 'DevOps and release automation', 'Cloud resource management', 'Access and environment configuration'] },
    { title: 'Work across your cloud platforms.', body: 'The published technology offering includes AWS, Microsoft Azure, Google Cloud and VMware. Define the right deployment and management approach around your workloads.' },
  ]),
  service('ui-ux-design', 'UI/UX design', 'Brand & experience', 'Interfaces that feel natural. Experiences that reflect your brand.', [
    { title: 'Design around people.', body: 'From new B2B products to existing enterprise platforms, Yellostack combines usability and brand expression across web, mobile and multi-platform experiences.', items: ['User research', 'Information architecture', 'Wireframes and prototypes', 'User testing', 'Design systems'] },
    { title: 'From insight to interface.', body: 'UX and visual design work together throughout the project, connecting how a product looks with how it helps people complete their tasks.' },
  ]),
  service('branding', 'Brand identity', 'Brand & experience', 'Give your business a recognisable voice and a coherent visual presence.', [
    { title: 'A lasting first impression.', body: 'Yellostack’s branding offering connects visual communication with how people perceive a business. Build a consistent identity across the moments where customers meet your brand.' },
    { title: 'Bring the identity into the experience.', body: 'Connect brand identity with interface design, responsive websites and promotional materials.', items: ['Visual identity', 'Digital brand expression', 'Promotional design'] },
  ]),
  service('artificial-intelligence', 'AI & automation', 'Intelligence', 'Connect practical AI ideas with the everyday needs of your business.', [
    { title: 'Start with a useful problem.', body: 'Explore assistants, workflow automation and intelligent application features around your team’s needs. Define the use case, information sources and review process before implementation.', items: ['AI assistants', 'Workflow automation', 'Intelligent application experiences'] },
    { title: 'Keep people in the process.', body: 'Shape an experience that helps your team work with information and maintain oversight of important decisions.' },
  ]),
  service('medical-coding', 'Medical coding', 'Healthcare', 'Bring clarity to healthcare workflows with a focused conversation about your coding and technology needs.', [
    { title: 'Define your requirements.', body: 'Discuss the scope of your medical coding workflow, existing systems and operational needs with Yellostack. The engagement starts with understanding your organisation and the support you are looking for.' },
    { title: 'Connect healthcare and technology.', body: 'Explore how healthcare applications, structured workflows and integrations can support your team.', items: ['Workflow discovery', 'Healthcare application requirements', 'System integration planning'] },
  ]),
];

export const companyPages: InnerPage[] = [
  { slug: 'about-us', title: 'Ideas into experiences.', eyebrow: 'About Yellostack', kind: 'company', source: 'https://www.yellostack.com/about-us', intro: 'Strategy, design and technology. A team working closely with yours to build digital products around people.', sections: [
    { title: 'A partnership, from day one.', body: 'Yellostack brings business strategy and emerging technology together through close collaboration. Clear communication and thoughtful project management form the foundation of the relationship.' },
    { title: 'Direct access to the people building it.', body: 'Work with a multidisciplinary team across design and development. A focused project approach gives your goals the attention they deserve.' },
    { title: 'Designed for the long term.', body: 'From defining the challenge to developing the solution, the aim is to support your business beyond a single launch.', items: ['Discover the opportunity', 'Define a clear strategy', 'Design and develop', 'Launch and evolve'] },
  ] },
  { slug: 'team', title: 'Different minds. Shared ambition.', eyebrow: 'Our team', kind: 'company', source: 'https://www.yellostack.com/team', intro: 'A multidisciplinary team connecting business thinking, creative craft and technical delivery.', sections: [
    { title: 'Strategy & research', body: 'Strategists, researchers and information architects help turn a business challenge into a clear direction.' },
    { title: 'Design & communication', body: 'UI/UX, graphic design, illustration, motion and marketing disciplines shape the way your brand connects with people.' },
    { title: 'Engineering & delivery', body: 'Developers and project specialists connect the experience with the systems that make it work.' },
  ] },
  { slug: 'clients', title: 'Built on relationships.', eyebrow: 'Our clients', kind: 'company', source: 'https://www.yellostack.com/clients', intro: 'Close collaboration, considered solutions and a commitment to the people behind each business.', sections: [
    { title: 'Your goals shape the work.', body: 'Yellostack places customer service and long-term relationships at the centre of its approach. Every project begins with understanding the organisation and what it needs to achieve.' },
    { title: 'A partner through the process.', body: 'Bring your team into the conversation, align the priorities and maintain a direct relationship from planning to delivery.' },
  ] },
  { slug: 'services', title: 'Every capability. Connected.', eyebrow: 'What we do', kind: 'directory', source: 'https://www.yellostack.com/services', intro: 'Explore applications, enterprise software, branding, cloud and digital growth, with AI and healthcare capabilities alongside them.', sections: [] },
  { slug: 'portfolio', title: 'Possibility, put into practice.', eyebrow: 'Application areas', kind: 'portfolio', source: 'https://www.yellostack.com/', intro: 'Explore the application areas featured by Yellostack, from everyday commerce to healthcare and education.', sections: [
    { title: 'Grocery & delivery', body: 'Mobile shopping and delivery experiences connecting customers with products and services.' },
    { title: 'Education', body: 'Applications that connect learners, educators and the information they need.' },
    { title: 'Healthcare', body: 'Doctor and healthcare application experiences built around service access.' },
    { title: 'Custom web applications', body: 'Digital tools shaped around your organisation and its workflows.' },
    { title: 'Booking & on-demand services', body: 'Applications that bring service discovery and booking into a connected experience.' },
  ] },
  { slug: 'contact', title: 'Let’s make something great.', eyebrow: 'Get in touch', kind: 'contact', source: 'https://www.yellostack.com/contact', intro: 'Have a project in mind? Tell us where you want to go. We’ll start with a conversation.', sections: [] },
];

export const innerPages = [...companyPages, ...servicePages];
export const routeAliases: Record<string, string> = {
  about: 'about-us', work: 'portfolio', applications: 'portfolio',
  'branding/projects.html': 'portfolio', 'branding/index.html': 'branding',
  'UI-UX-design': 'ui-ux-design',
  'mobile-app-development-company-in-saudi-arabia': 'mobile-application-development-company-saudi-arabia',
  career: 'careers', 'career.php': 'careers', 'careers.php': 'careers',
  ...Object.fromEntries(innerPages.map(page => [`${page.slug}.php`, page.slug])),
};

export const companyLinks = [
  ['About', '/about-us'], ['Services', '/services'], ['Applications', '/portfolio'],
  ['Team', '/team'], ['Clients', '/clients'], ['Careers', '/careers'], ['Blog', '/blog'], ['Contact', '/contact'],
] as const;
