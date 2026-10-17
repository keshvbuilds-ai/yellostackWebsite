export type ContentSection = { title: string; body: string; items?: string[]; image?: string; imageAlt?: string };
export type InnerPage = {
  slug: string; title: string; eyebrow: string; intro: string;
  kind: 'company' | 'service' | 'directory' | 'contact' | 'portfolio';
  group?: string; source: string; sections: ContentSection[];
};

const service = (slug: string, title: string, group: string, intro: string, sections: ContentSection[]): InnerPage => ({
  slug, title, group, eyebrow: group, intro, sections, kind: 'service', source: `https://www.yellostack.com/${slug}`,
});

export const servicePages: InnerPage[] = [
  {"slug":"devops-services","title":"DevOps services","eyebrow":"Cloud","group":"Cloud","kind":"service","source":"","intro":"Connect your development and operations teams with repeatable delivery practices.","sections":[{"title":"From code to continuous delivery.","body":"Yellostack’s DevOps offering brings infrastructure as code, version control and continuous delivery into your software workflow. Build a foundation that can adapt as your product and operations change.","items":["Infrastructure as code","Continuous delivery","Version control","Flexible delivery workflows"]}]},
  {"slug":"startup-services","title":"Startup services","eyebrow":"Applications","group":"Applications","kind":"service","source":"","intro":"Turn an early idea into a focused product and a practical technology plan.","sections":[{"title":"Start with insight. Validate with a product.","body":"Industry research and IT consulting help align your technology choices with business objectives. Develop an MVP to test the concept, gather user feedback and guide the next iteration.","items":["Industry insight and research","IT consulting and strategy","MVP development","User feedback and iteration"]}]},
  {"slug":"communication-services","title":"Communication services","eyebrow":"Enterprise software","group":"Enterprise software","kind":"service","source":"","intro":"Connect your workplace with the communication and infrastructure services it needs.","sections":[{"title":"Support the connected workplace.","body":"The Yellostack company profile includes networking, CCTV, biometric systems and telecommunications. Discuss your site, existing infrastructure and operational requirements to define the appropriate scope.","items":["Networking","CCTV","Biometric systems","Telecommunications"]}]},
  service('mobile-application-development-company-saudi-arabia', 'Mobile app development', 'Applications', 'Bring your business closer to the people who use it. Mobile experiences for Android, iOS and the everyday moments that matter.', [
    { title: 'Built around your customers.', body: 'Yellostack develops native and hybrid applications with features shaped around your business requirements. From a first concept to an established service, the experience starts with understanding your users.', items: ['Android and iOS applications', 'Cross-platform experiences', 'Custom mobile solutions', 'E-commerce applications'] },
    { title: 'One connected product.', body: 'Connect the interface, business logic and supporting systems so customers can move through your service with less friction.' },
    {"title":"Built for your platform.","body":"Native iOS and Android development sits alongside hybrid delivery. We work with your team on business requirements, enterprise mobility and customer-facing shopping applications."},
  ]),
  service('sharepoint', 'SharePoint services', 'Applications', 'A more connected workspace for your people, documents and daily operations.', [
    { title: 'Make information work together.', body: 'SharePoint consulting, development, migration and support help bring scattered information into a shared working environment.', items: ['Company intranets', 'Client and internet portals', 'Document management', 'Correspondence management', 'Custom SharePoint solutions'] },
    { title: 'Support through change.', body: 'Plan your implementation around the way your teams collaborate, with migration and ongoing support considered from the outset.' },
    {"title":"Documents with a clear process.","body":"Organise metadata, permissions, search and document retention. Connect approval workflows, co-authoring and correspondence tracking with intranets and customer portals."},
  ]),
  service('ecommerce-website-development', 'E-commerce development', 'Applications', 'Turn browsing into a connected shopping experience, from the first product discovery to the next order.', [
    { title: 'Your storefront. Your workflow.', body: 'Yellostack builds responsive online stores and shopping applications with customer-facing experiences and tools to manage daily sales.', items: ['Product and offer management', 'Carts, wishlists and customer accounts', 'Payment gateway integration', 'Order tracking and refund management', 'Administration and database backups'] },
    { title: 'Room for your business to grow.', body: 'Choose the features your catalogue and operations need, with a shopping experience designed for both mobile and desktop.' },
    {"title":"From catalogue to checkout.","body":"Manage products, promotions, coupons and orders through an administration dashboard. Connect PayPal or Stripe payments with customer registration, wishlists, order tracking and refund workflows."},
  ]),
  service('website-design-company', 'Web design & development', 'Applications', 'A digital home for your business. Clear, useful and unmistakably yours.', [
    { title: 'A direct creative partnership.', body: 'Work closely with the design and development team to shape a website around your goals, brand and customers. The original Yellostack approach puts collaboration and a clearly defined scope at the centre.' },
    { title: 'Design meets delivery.', body: 'Bring visual identity, content and development together into an experience that is easy to navigate and built for the way people browse.', items: ['Business websites', 'Responsive interfaces', 'Custom web experiences', 'E-commerce websites'] },
    {"title":"A clear scope, a connected team.","body":"Define the project scope and cost before delivery. Work directly with designers and developers on your business website or WooCommerce storefront, from planning through implementation."},
  ]),
  service('custom-software-development', 'Custom software development', 'Applications', 'Software that fits the way your business works, with the flexibility to support what comes next.', [
    { title: 'Start with the right architecture.', body: 'We define business objectives and requirements before designing, developing, testing and integrating a solution. Clear system designs and documentation guide the implementation.', items: ['Business process digitisation', 'System integration', 'Reporting and delegation', 'Industry-specific applications'] },
    { title: 'Connect your operations.', body: 'Yellostack’s published capabilities span construction, manufacturing, education, healthcare, retail, hospitality and travel, including integrations with existing enterprise systems.' },
    {"title":"Work with your existing systems.","body":"Connect bespoke applications with Microsoft, Oracle or SAP enterprise software. Requirements, documented architecture, testing and integration help align the solution with your operations."},
    {"title":"Modernise what comes next.","body":"Modernise legacy applications with scalable technologies and build tailored software around your workflows. Connect web applications, business requirements and product design throughout delivery."},
  ]),
  service('erp-services', 'ERP services', 'Enterprise software', 'Bring people, processes and business information into a more connected enterprise.', [
    { title: 'From selection to support.', body: 'ERP consulting covers evaluation, implementation, enhancement, training and maintenance. Start by understanding your operations and choosing a platform suited to the business.', items: ['ERP audits and consulting', 'Implementation and integration', 'Enhancements and customisation', 'Training and maintenance'] },
    { title: 'An enterprise-wide view.', body: 'Yellostack’s published ERP offering includes Microsoft Dynamics solutions, bringing operational and financial information into connected business applications.' },
    {"title":"Connected business applications.","body":"Microsoft Dynamics 365 brings sales, finance, operations, customer service and marketing into a connected suite. Extend the implementation to field service, project workflows and retail where your business needs them."},
  ]),
  service('travel-dynamic', 'Travel Dynamics Plus', 'Enterprise software', 'Connect travel operations and back-office accounting in one industry-focused system.', [
    { title: 'From booking to reconciliation.', body: 'Travel Dynamics Plus supports travel and tourism workflows with invoicing, vouchers and integrated financial modules.', items: ['GDS, airline and travel-service invoicing', 'Customer and supplier accounts', 'Sales reports and analytics', 'Refund and payment management', 'Financial reporting'] },
    { title: 'A practical deployment.', body: 'The published platform uses Microsoft .NET and SQL Server, with on-premise and hosted deployment options, user training and support.' },
    {"title":"Accounting beyond the booking.","body":"Manage receivables, payables, bank reconciliation, budgets and fixed assets. Review ageing, outstanding invoices, cash flow and financial statements across branches, with hosted or on-premise deployment."},
  ]),
  service('freight-dynamic', 'Freight Dynamics Plus', 'Enterprise software', 'Give logistics teams a connected view of freight, warehouses and financial operations.', [
    { title: 'Keep operations moving.', body: 'FD Plus brings freight-forwarding workflows together with accounting for forwarders, supply-chain providers, couriers and warehouse operators.', items: ['Container freight station management', 'Ocean and air freight forwarding', 'Warehouse and inventory management', 'Dispatch and inland distribution', 'Fleet and asset management'] },
    { title: 'Visibility across the journey.', body: 'Track goods from receipt through storage and dispatch, with documentation, invoicing and operational reporting connected to the same workflow.' },
    {"title":"From arrival to dispatch.","body":"Coordinate container inspection, storage, loading plans and invoicing. Warehouse tools connect barcode inventory, shipment documents, order handling and multiple locations with financial operations."},
  ]),
  service('retail-dynamic', 'Retail Dynamics Plus', 'Enterprise software', 'Explore Yellostack’s retail software offering and discuss the needs of your stores and operations.', [
    { title: 'Built around your retail business.', body: 'Retail Dynamics Plus is listed in Yellostack’s enterprise software portfolio. Contact the team to discuss the product, your requirements and the available implementation options.' },
  ]),
  service('enterprise-dynamic-plus', 'Enterprise Dynamics Plus', 'Enterprise software', 'A connected ERP foundation for small and medium-sized businesses.', [
    { title: 'Connect the essential functions.', body: 'ED Plus is a Microsoft-platform ERP offering that can be tailored to different business models, including trading, construction and contracting.', items: ['Inventory and purchasing', 'Finance and accounting', 'HR and payroll', 'Project management and costing'] },
    { title: 'From transactions to decisions.', body: 'Bring stock movements, customer and supplier accounts, payroll and project reports together to support day-to-day management.' },
    {"title":"People, stock and projects.","body":"Connect purchase orders, stock transfers and valuation with payroll, leave and employee records. Track project quotations, labour, materials, expenses and invoices alongside financial reporting."},
  ]),
  service('facilities-management', 'Facility management software', 'Enterprise software', 'Manage buildings, assets and the services people rely on through a modular web platform.', [
    { title: 'One view of your facilities.', body: 'Coordinate facilities work, service requests and occupancy with modules designed around corporate buildings and their users.', items: ['Assets and maintenance', 'Helpdesk and work orders', 'Space planning and facility bookings', 'Tenant billing', 'Projects and analytical reports'] },
    { title: 'Operations that stay connected.', body: 'The published offering includes building-management integration, energy dashboards, feedback and workflow tools.' },
    {"title":"Services around your occupants.","body":"Plan preventive and corrective maintenance, manage contracts and procurement, and route helpdesk requests. Floor plans, room bookings, tenant billing and canteen management support everyday facility services."},
  ]),
  service('digital-marketing-agency', 'Digital marketing', 'Growth', 'Connect your brand with the people who are looking for it.', [
    { title: 'A plan built around your audience.', body: 'Yellostack develops marketing strategies around consumer insights, brand needs and business objectives, bringing different channels into a coordinated plan.', items: ['Social media marketing', 'Content writing', 'Email marketing', 'Search engine optimisation'] },
    { title: 'Make each touchpoint count.', body: 'Extend your brand across the channels your customers use, with content and communication that work together.' },
    {"title":"One coordinated roadmap.","body":"Use consumer insights to shape a marketing plan around your brand and business objectives. Bring content, search, email and social channels together for a consistent online presence."},
  ]),
  service('search-engine-optimization', 'Search engine optimisation', 'Growth', 'Help the right audience discover your business through organic search.', [
    { title: 'Understand. Improve. Measure.', body: 'Begin with website analysis and keyword research, then improve the content and structure that help people and search engines understand your offering.', items: ['Website analysis', 'Keyword research', 'On-page optimisation', 'Link development', 'Reporting and analysis'] },
    { title: 'Visibility with a purpose.', body: 'Connect your search strategy with useful content and a clear path from discovery to enquiry.' },
    {"title":"Build on a website review.","body":"Review your content and linking structure, identify relevant search phrases and improve on-page organisation. Combine off-page work with reporting and analysis to guide the next improvements."},
  ]),
  service('cloud-migration', 'Cloud migration', 'Cloud', 'Move applications and infrastructure forward with a considered cloud strategy.', [
    { title: 'Plan the move. Support the environment.', body: 'Yellostack’s cloud services cover migration from on-premise infrastructure, resource optimisation and ongoing management.', items: ['Cloud readiness and migration', 'DevOps and release automation', 'Cloud resource management', 'Access and environment configuration'] },
    { title: 'Work across your cloud platforms.', body: 'The published technology offering includes AWS, Microsoft Azure, Google Cloud and VMware. Define the right deployment and management approach around your workloads.' },
    {"title":"From infrastructure to delivery.","body":"Move on-premise workloads to AWS, Azure or VMware environments. Support onboarding, resource optimisation and automated releases with cloud management and DevOps practices."},
    {"title":"CloudOps for everyday operations.","body":"Keep your environment aligned with demand through cloud monitoring, resource scaling, automation and cost optimisation. Migration and ongoing operations form one connected service."},
  ]),
  service('ui-ux-design', 'UI/UX design', 'Brand & experience', 'Interfaces that feel natural. Experiences that reflect your brand.', [
    { title: 'Design around people.', body: 'From new B2B products to existing enterprise platforms, Yellostack combines usability and brand expression across web, mobile and multi-platform experiences.', items: ['User research', 'Information architecture', 'Wireframes and prototypes', 'User testing', 'Design systems'] },
    { title: 'From insight to interface.', body: 'UX and visual design work together throughout the project, connecting how a product looks with how it helps people complete their tasks.' },
    {"title":"Improve the whole product journey.","body":"Modernise enterprise interfaces or shape new B2B products. Research, information architecture, prototypes and user testing connect to design systems and full-stack implementation."},
  ]),
  service('branding', 'Brand identity', 'Brand & experience', 'Give your business a recognisable voice and a coherent visual presence.', [
    { title: 'A lasting first impression.', body: 'Yellostack’s branding offering connects visual communication with how people perceive a business. Build a consistent identity across the moments where customers meet your brand.' },
    { title: 'Bring the identity into the experience.', body: 'Connect brand identity with interface design, responsive websites and promotional materials.', items: ['Visual identity', 'Digital brand expression', 'Promotional design'] },
    {"title":"An identity across every touchpoint.","body":"Bring your brand into logos, websites, brochures and social media graphics. The profile’s design services connect visual identity with UI/UX and digital product experiences."},
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
  {"slug":"about-us","title":"Building intelligent technology for the future.","eyebrow":"About Yellostack","kind":"company","source":"https://www.yellostack.com/about-us","intro":"YelloStack is a Saudi Arabia-based AI-driven software and technology company focused on building intelligent, scalable, and cost-effective digital solutions for businesses across industries.","sections":[{"title":"Our mission","body":"To build innovative, secure, and cost-effective technology solutions from Saudi Arabia for businesses worldwide. Through Artificial Intelligence, software development, mobile applications, healthcare technology, and intelligent automation, we aim to solve real-world challenges, enhance operational efficiency, and create lasting business value while contributing to the growth of Saudi Arabia’s digital ecosystem."},{"title":"Our vision","body":"To become a leading Saudi technology company driving the future of AI-powered innovation, developing intelligent digital solutions that empower businesses, accelerate digital transformation, and contribute to Saudi Arabia’s vision of a technology-driven economy."},{"title":"Practical technology. Lasting value.","body":"Our expertise spans custom software, mobile and web applications, AI-powered solutions, healthcare technology, medical coding and workflow automation. We connect technology with real business challenges to build scalable digital products."},{"title":"A partnership, from day one.","body":"Our team of skilled software engineers, AI professionals, designers, and technology specialists works closely with clients to understand their business challenges and deliver measurable value. From developing intelligent mobile applications and enterprise software to implementing AI-powered automation and healthcare solutions, we focus on creating technology that improves efficiency, accuracy, and business performance."},{"title":"Tailored solutions. Global reach.","body":"We build applications around each organisation’s requirements and support businesses across locations. Our approach combines practical innovation, direct collaboration and experience across enterprise and customer-facing products."},{"title":"AI as a business enabler.","body":"At YelloStack, we believe AI should not simply be a technology layer; it should be a business enabler. We integrate AI into applications and workflows to automate repetitive processes, improve decision-making, enhance customer experiences, and unlock new growth opportunities."},{"title":"From your vision to a scalable product.","body":"Whether you require a mobile application, custom software platform, AI-powered business solution, medical coding system, healthcare technology solution, or complete digital transformation, YelloStack provides the technical expertise and innovation needed to turn your vision into a scalable digital product."}]},
  { slug: 'team', title: 'Different minds. Shared ambition.', eyebrow: 'Our team', kind: 'company', source: 'https://www.yellostack.com/team', intro: 'A multidisciplinary team connecting business thinking, creative craft and technical delivery.', sections: [
    { title: 'Strategy & research', body: 'Strategists, researchers and information architects help turn a business challenge into a clear direction.' },
    { title: 'Design & communication', body: 'UI/UX, graphic design, illustration, motion and marketing disciplines shape the way your brand connects with people.' },
    { title: 'Engineering & delivery', body: 'Developers and project specialists connect the experience with the systems that make it work.' },
  ] },
  { slug: 'clients', title: 'Trusted across the Kingdom.', eyebrow: 'Our clients', kind: 'company', source: 'https://www.yellostack.com/clients', intro: 'Since 2017, businesses across Saudi Arabia have trusted Yellostack to design, build and run the technology behind their growth, from AI automation to enterprise software.', sections: [
    { title: 'Your goals shape the work.', body: 'Yellostack places customer service and long-term relationships at the centre of its approach. Every project begins with understanding the organisation and what it needs to achieve.' },
    { title: 'A partner through the process.', body: 'Bring your team into the conversation, align the priorities and maintain a direct relationship from planning to delivery.' },
  ] },
  { slug: 'products', title: 'Products built for your business.', eyebrow: 'Our products', kind: 'directory', source: '', intro: 'Explore connected software for travel, freight, retail, enterprise operations and facilities management.', sections: [] },
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
