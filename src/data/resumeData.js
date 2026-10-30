// Single Source of Truth for Mahmud al Hasan's Professional Curriculum Vitae

export const RESUME_META = {
  name: 'Mahmud al Hasan',
  headline: 'Senior Software Engineer (ASP.NET Core / Backend) · 8+ Years Production Experience',
  location: 'Bayazid, Chattogram, Bangladesh',
  phone: '+880 1727-328200',
  phoneRaw: '+8801727328200',
  email: 'mahmud.csem@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mahmud-al-hasan/',
  github: 'https://github.com/HasanCSE-IYI',
  whatsapp: 'https://wa.me/8801727328200',
  website: 'https://hasancse-iyi.github.io/portfolio-one/',
  lastUpdated: 'October 2026',
};

export const PROFESSIONAL_SUMMARY =
  'Senior Backend Software Engineer with 8+ years of experience architecting and deploying high-throughput REST APIs and distributed services. Proven track record leading backend architecture for a telemedicine platform (Doctor Dekhao, 99.9% uptime) with Laravel, MySQL, and AWS. Actively building enterprise-grade architectures in the modern .NET ecosystem with C#, ASP.NET Core Web API, and Entity Framework Core.';

export const TECHNICAL_SKILLS = [
  {
    category: '.NET & C#',
    items: 'C#, ASP.NET Core Web API, Entity Framework Core (Code First, migrations), LINQ, JWT authentication, RESTful APIs',
    highlight: false,
  },
  {
    category: 'Learning / Active Expansion',
    items: 'xUnit, SQL Server, Microsoft Azure, Docker Containerization',
    highlight: true,
  },
  {
    category: 'Backend Foundation',
    items: 'Laravel (PHP), NestJS, Node.js, Express, RESTful API Design, Microservices, Clean Architecture',
    highlight: false,
  },
  {
    category: 'Databases & Caching',
    items: 'MySQL, MongoDB, SQLite, PostgreSQL, Redis Task Queues',
    highlight: false,
  },
  {
    category: 'Cloud & Systems',
    items: 'AWS (EC2, S3, RDS), Linux (Ubuntu), Git, GitHub Actions CI/CD',
    highlight: false,
  },
  {
    category: 'Data & Automation',
    items: 'Python, Scrapy, Celery, Redis Queues',
    highlight: false,
  },
  {
    category: 'Frontend & UI',
    items: 'TypeScript, Next.js, React, ReactFlow, Shadcn UI',
    highlight: false,
  },
];

export const FEATURED_PROJECTS = [
  {
    title: 'Store API',
    tech: 'ASP.NET Core · EF Core · SQLite · JWT',
    subline: 'RESTful Product Inventory API & Architecture',
    url: 'https://github.com/HasanCSE-IYI/StoreApi',
    achievements: [
      'Built a production-style RESTful product inventory API with JWT authentication and role-based authorization (User/Admin).',
      'Implemented multi-parameter search, category filtering, pagination, and EF Core Code First migrations.',
      'Structured the codebase in Controller–Service–Repository layers with custom error-handling middleware.',
    ],
  },
];

export const WORK_EXPERIENCE = [
  {
    role: 'IT Operations & Web Systems Engineer',
    company: 'EXONEXT & SourcingPi',
    workType: 'Hybrid',
    period: 'Feb 2025 – Present',
    bullets: [
      'Administer IT infrastructure, network configuration, and system security for hybrid business operations.',
      'Maintain and deploy updates for company websites, improving loading performance and responsiveness.',
      'Produce technical documentation and user guides for internal workflows.',
    ],
  },
  {
    role: 'Front-End Support & Content Developer',
    company: 'Independent Contractor',
    workType: 'Remote',
    period: 'Feb 2025 – Aug 2026',
    bullets: [
      'Monitored, tested, and resolved web platform defects, reducing recurring errors and downtime.',
      'Handled UI responsiveness fixes, cross-browser compatibility, and content updates.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'iGOT AI',
    period: 'Feb 2024 – Aug 2024',
    bullets: [
      'Developed core modules of a no-code virtual employee platform and AI chatbot solutions.',
      'Built node-based workflow interfaces with ReactFlow, Next.js, and TypeScript.',
      'Created reusable, accessible UI components with Shadcn UI.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'BeWeddy & BlessUp AI',
    period: 'Feb 2022 – Dec 2023',
    bullets: [
      'Developed and maintained features and modules using NestJS, MongoDB, and Next.js/React.',
      'Built and consumed RESTful APIs with JWT authentication, using a modular, dependency-injection-based architecture.',
      'Managed deployment and DevOps on AWS (EC2, S3), reducing release cycle times.',
      'Provided production support, resolving critical bugs and handling system incidents.',
    ],
  },
  {
    role: 'Software Engineer (Ex-Co-Founder)',
    company: 'Doctor Dekhao (Telemedicine Startup)',
    period: 'Jun 2019 – Sep 2021',
    bullets: [
      'Co-founded a telemedicine startup and led backend architecture for a 4-member software engineering team.',
      'Designed, deployed, and maintained RESTful APIs (Laravel, MySQL) serving mobile applications for real-time patient-doctor consultations.',
      'Modeled database schemas and optimized relational queries and API payloads, dramatically improving response times.',
      'Worked closely with mobile engineers to establish API contracts for real-time doctor-patient interactions.',
      'Deployed and maintained the backend infrastructure on cloud servers.',
    ],
  },
  {
    role: 'Software Engineer (R&D)',
    company: 'DataShall Analytics Ltd.',
    period: 'Sep 2018 – May 2019',
    bullets: [
      'Contributed to "Shuni Live", an AI-powered social listening and sentiment analytics platform.',
      'Integrated the Facebook Graph API for automated timeline data extraction and keyword discovery.',
      'Built data scraping pipelines and background task queues with Python, Scrapy, Celery, and Redis.',
      'Built the business analytics module for "Shuni 02", enabling client retargeting based on negative sentiment analysis.',
    ],
  },
  {
    role: 'Mobile Application Developer',
    company: 'Talha Soft',
    period: 'Apr 2018 – Aug 2018',
    bullets: [
      'Built cross-platform mobile app prototypes with Python and Kivy.',
      'Managed version control with SVN and configured Linux-based Android builds with Buildozer.',
    ],
  },
];

export const EDUCATION = {
  degree: 'B.Sc. in Computer Science and Engineering (CSE)',
  institution: 'Bangladesh University of Business and Technology',
  location: 'Dhaka, Bangladesh',
  status: 'Graduated',
};

export const LANGUAGES = [
  { name: 'Bangla', proficiency: 'Native / Fluent' },
  { name: 'English', proficiency: 'Professional Working Proficiency' },
];

export const ADDITIONAL_ACTIVITIES = [
  'Firefox Student Ambassador (Volunteer)',
  'Professional PHP with Laravel Training · BASIS BITM',
  'Intra-University Programming Contests Participant',
];

export const REFERENCES = [
  {
    name: 'Habibur Rahman',
    role: 'Professional Mentor & Industry Trainer',
    designations: [
      { role: 'Trainer', org: 'BASIS BITM (PHP with Laravel Framework)' },
      { role: 'Head of IT Department', org: 'Sorejomin Barta' },
    ],
    phone: '+880 1711-805110',
    phoneRaw: '+8801711805110',
    email: 'habib2498922@gmail.com',
    web: 'www.sorejominbarta.com',
    webUrl: 'https://www.sorejominbarta.com',
  },
  {
    name: 'IFTEKHAR UDDIN MD. TANVIR',
    role: 'MSc in Computer Science, MBA',
    designations: [
      { role: 'Head of IT (Ex)', org: 'Island Securities Ltd.' },
    ],
    phone: '+880 1919-316231',
    phoneRaw: '+8801919316231',
    email: 'eng.iftekhar@gmail.com',
  },
];

export const getPlainTextResume = () => {
  return `MAHMUD AL HASAN
Senior Backend Software Engineer (ASP.NET Core & C# · 8+ Years Experience)
${RESUME_META.location}
${RESUME_META.phone} | ${RESUME_META.email}
LinkedIn: ${RESUME_META.linkedin} | GitHub: ${RESUME_META.github}

PROFESSIONAL SUMMARY
${PROFESSIONAL_SUMMARY}

TECHNICAL SKILLS
${TECHNICAL_SKILLS.map((s) => `- ${s.category}: ${s.items}`).join('\n')}

WORK EXPERIENCE
${WORK_EXPERIENCE.map(
  (job, idx) =>
    `${idx + 1}. ${job.role} | ${job.company} (${job.period}${job.workType ? ' | ' + job.workType : ''})\n` +
    job.bullets.map((b) => `   - ${b}`).join('\n')
).join('\n\n')}

EDUCATION
${EDUCATION.degree}
${EDUCATION.institution}

LANGUAGES
${LANGUAGES.map((l) => `${l.name} (${l.proficiency})`).join(', ')}

ADDITIONAL
${ADDITIONAL_ACTIVITIES.join('; ')}.

PROFESSIONAL REFERENCES
${REFERENCES.map(
  (ref, idx) =>
    `${idx + 1}. ${ref.name}\n` +
    `${ref.role}\n` +
    ref.designations.map((d) => `${d.role} | ${d.org}`).join('\n') +
    (ref.web ? `\n${ref.web}` : '') +
    `\nPhone: ${ref.phone} | Email: ${ref.email}`
).join('\n\n')}`;
};
