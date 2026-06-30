// Long-form career narrative — the "director's cut" of each role.
// Grounded in the experiences + projectsDetails data, expanded into stories,
// TL;DRs, and learnings for the in-depth /journey page.

export type IconKey =
  | "rocket"
  | "globe"
  | "layers"
  | "seedling"
  | "users"
  | "database"
  | "shield"
  | "zap"
  | "compass";

export interface JourneyHighlight {
  title: string;
  detail: string;
}

export interface JourneyRole {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  period: string;
  location: string;
  type: string;
  accent: string; // hex used for the section accent
  icon: IconKey;
  tldr: string[];
  story: string[];
  highlights: JourneyHighlight[];
  learnings: string[];
  tech: string[];
  stats: { label: string; value: string }[];
}

export const journey: JourneyRole[] = [
  {
    id: "mediusware",
    company: "Mediusware",
    companyLogo: "/mediusware-logo.jpeg",
    role: "Senior Software Engineer",
    period: "May 2025 — Present",
    location: "Mohammadpur, Dhaka · On-site",
    type: "Full-time",
    accent: "#22d3ee",
    icon: "rocket",
    tldr: [
      "Leading enterprise app development end-to-end — architecture, delivery, and mentorship.",
      "Pushing AI/ML integration and web-scraping infrastructure into production systems.",
      "Owning system design across React Native, Next.js, Flutter and an AWS-backed stack.",
    ],
    story: [
      "Stepping into a Senior Software Engineer role at Mediusware meant the centre of gravity shifted from “how do I build this feature” to “how should this whole thing be built, and who builds it with me.” I came in to lead development of enterprise-grade applications, which in practice means living at the intersection of architecture decisions, delivery pressure, and the people doing the work.",
      "A big part of the mandate has been bringing AI/ML capabilities into products that were never designed with them in mind — wiring model inference into existing flows, building the data and scraping pipelines that feed them, and doing it without turning the codebase into a science experiment. The interesting engineering problem is rarely the model; it's the plumbing, the failure modes, and the cost of getting it wrong in front of a real user.",
      "On the platform side I work across a deliberately broad stack — React Native and Flutter for mobile, Next.js on the web, Node services behind them, and AWS (EC2, Lambda, S3, CloudFront) underneath. Owning system design across that surface forces a discipline of keeping interfaces clean so the teams on either side of a boundary can move independently.",
      "The part I didn't expect to enjoy as much as I do is mentorship. Reviewing code, unblocking people, and quietly raising the floor on how the team writes and ships software turns out to be the highest-leverage thing a senior engineer does. Shipping a feature helps once; helping five people ship better features compounds.",
    ],
    highlights: [
      { title: "AI/ML in production", detail: "Integrated model inference into live products with the surrounding data and scraping pipelines to support it." },
      { title: "Cross-platform delivery", detail: "Owned features spanning React Native, Flutter, and Next.js against a shared Node + AWS backend." },
      { title: "System architecture", detail: "Set the architectural direction for enterprise apps and kept service boundaries clean as teams scaled." },
      { title: "Team mentorship", detail: "Drove code reviews and engineering standards that raised overall delivery quality." },
    ],
    learnings: [
      "The hard part of AI features is the plumbing and failure handling, not the model.",
      "Clean boundaries let teams move in parallel — architecture is mostly about who can ignore whom.",
      "Mentorship compounds; senior leverage comes from the people you make better, not the tickets you close.",
      "Breadth across platforms is only sustainable if you ruthlessly standardise the shared layer.",
    ],
    tech: ["React Native", "Next.js", "Flutter", "Node.js", "AI/ML Integration", "Web Scraping", "Docker", "AWS EC2", "AWS Lambda", "AWS S3", "AWS CloudFront", "System Design"],
    stats: [
      { label: "Role", value: "Senior SSE" },
      { label: "Focus", value: "AI + Architecture" },
      { label: "Scope", value: "Enterprise" },
    ],
  },
  {
    id: "all-generation-tech",
    company: "All Generation Tech",
    companyLogo: "/agt-logo.jpeg",
    role: "Software Engineer",
    period: "Dec 2024 — May 2025",
    location: "New York, USA · Remote",
    type: "Full-time",
    accent: "#a78bfa",
    icon: "globe",
    tldr: [
      "Built scalable, real-time web & mobile apps for international (US) clients.",
      "Worked in a microservices architecture with WebSocket-driven features.",
      "Shipped across timezones — async-first collaboration on a UTC-5 schedule.",
    ],
    story: [
      "All Generation Tech was my first fully remote, fully international role — a New York company with me building from Dhaka. The work itself was squarely in my wheelhouse: scalable web applications and mobile solutions for clients who expected things to be fast and to stay up. But the context changed everything about how I worked.",
      "Technically, the centre of the job was real-time. A lot of what I built leaned on WebSocket-driven features inside a microservices architecture, which means you stop thinking about a single request/response and start thinking about connection lifecycles, reconnection storms after a deploy, and what happens to in-flight state when one service blinks. Those are the problems that don't show up in a demo and absolutely show up in production.",
      "AWS was the backbone again — Lambda, S3, CloudFront, EC2 — and the microservices framing pushed me to care more about contracts between services than about any one service's internals. When you can't tap someone on the shoulder, a clear API boundary is worth more than clever code.",
      "The quieter lesson was operating async across a ~10-hour offset. You learn to write things down, to make your PRs and messages self-explanatory, and to leave the codebase in a state where someone waking up on the other side of the planet can pick it up without you. Remote-international work is a communication discipline that happens to involve code.",
    ],
    highlights: [
      { title: "Real-time systems", detail: "Built WebSocket-driven features and handled reconnection / in-flight state across service restarts." },
      { title: "Microservices", detail: "Worked within a service-oriented architecture, prioritising clean contracts over shared internals." },
      { title: "Cloud delivery", detail: "Used AWS Lambda, S3, CloudFront and EC2 to keep apps fast and resilient for US clients." },
      { title: "Async collaboration", detail: "Delivered reliably across a 10-hour timezone offset with documentation-first habits." },
    ],
    learnings: [
      "Real-time bugs live in lifecycles and reconnects, not in the happy path.",
      "Across a timezone gap, written clarity is a feature — your PR is your stand-up.",
      "Service contracts age better than service internals; design the seams first.",
      "Resilience is a product requirement, not a nice-to-have, when the client is in another country.",
    ],
    tech: ["React Native", "React.js", "Next.js", "Node.js", "WebSocket", "Microservices", "Web Scraping", "Docker", "AWS Lambda", "AWS S3", "AWS CloudFront", "AWS EC2"],
    stats: [
      { label: "Clients", value: "US / Intl" },
      { label: "Model", value: "Remote" },
      { label: "Edge", value: "Real-time" },
    ],
  },
  {
    id: "masleap",
    company: "Masleap Plc",
    companyLogo: "/masleap-logo.jpeg",
    role: "Lead Developer → Project Manager cum Developer",
    period: "May 2023 — Dec 2024",
    location: "Dhaka, Bangladesh · On-site",
    type: "Full-time",
    accent: "#34d399",
    icon: "layers",
    tldr: [
      "Led the zero-downtime migration of Grimm Scientific's legacy VB.NET system to Nuxt.js + MSSQL.",
      "Delivered 8 enterprise modules — accounting, CAPA, vendor & customer management — plus the Bodhisys property platform.",
      "Grew from Lead Developer into Project Manager, running cross-functional teams to a 95% satisfaction rate.",
    ],
    story: [
      "Masleap is where I went from “senior on a team” to “the person the project leans on.” Over roughly a year and a half I moved from Lead Developer to Project Manager cum Developer, and the projects were the kind that don't forgive hand-waving — they were real businesses running on the software I was responsible for.",
      "The flagship was Grimm Scientific's modernization: a slow, ageing VB.NET desktop application that an entire company depended on, which we migrated to a modern Nuxt.js + Vue 3 front end backed by a massive, unstructured MSSQL database. The hard constraint was that we couldn't break what was already in use — so we retained the original database structure, ran the new system in shadow alongside the old one, and cut over without downtime. I built or led eight critical modules along the way: accounting, engineering management (CAPA), vendor management, customer relations, and more.",
      "In parallel I architected and delivered Bodhisys, a property management platform with a React Native mobile app, and later led Falcon Snap, a document management system for streamlining business processes. Different domains, same underlying job: take a messy real-world process and give it a backbone that scales.",
      "The transition into project management was the real growth. Suddenly the bottleneck wasn't my code — it was estimates, scope, morale under deadline pressure, and keeping international clients confident. I learned to run agile cadences that protected the team's focus while still giving stakeholders the visibility they needed, and we delivered at a 95% client satisfaction rate. That number is really a proxy for “we said what we'd do and then did it.”",
    ],
    highlights: [
      { title: "Zero-downtime migration", detail: "Moved Grimm Scientific off legacy VB.NET to Nuxt.js + MSSQL via shadow-running and a clean cutover." },
      { title: "8 enterprise modules", detail: "Built accounting, CAPA engineering management, vendor and customer relations modules end-to-end." },
      { title: "Bodhisys platform", detail: "Architected a property management system with a React Native mobile app." },
      { title: "Led delivery & people", detail: "Ran cross-functional teams and agile cadences to a 95% client satisfaction rate." },
    ],
    learnings: [
      "Legacy migrations are won by shadow-running and respecting the existing data, not by rewrites.",
      "You can modernize the surface without touching the schema — and often you should.",
      "As PM, your job is to remove ambiguity faster than it accumulates.",
      "Client trust is just predictability: commit, deliver, repeat.",
    ],
    tech: ["Nuxt.js", "Vue 3", "H3", "VB.NET Migration", "MSSQL", "MySQL", "React Native", "React.js", "Next.js", "Node.js", "WebSocket", "Docker", "AWS", "Project Management"],
    stats: [
      { label: "Migration", value: "Zero-downtime" },
      { label: "Modules", value: "8" },
      { label: "Satisfaction", value: "95%" },
    ],
  },
  {
    id: "ishqool",
    company: "IshQool",
    companyLogo: "/ishqool.jpeg",
    role: "Web Developer → Full-stack Developer",
    period: "Nov 2021 — Apr 2023",
    location: "Dhaka, Bangladesh · Remote",
    type: "Full-time",
    accent: "#fbbf24",
    icon: "seedling",
    tldr: [
      "My first professional role — learned full-stack development building an edtech LMS under senior mentorship.",
      "Built student management, interactive learning modules, and real-time dashboards on the MERN stack.",
      "Helped scale the platform to 3,000+ learners with 99.9% uptime in a competitive market.",
    ],
    story: [
      "IshQool was the beginning — my first professional role, where the goal was as much to learn how software is built in a team as it was to ship features. I joined as a junior web developer on their Learning Management System and, under the guidance of senior developers, learned to build React components, write APIs, and work with databases for real users instead of for a tutorial.",
      "The product mattered: an LMS for a Bangladeshi edtech startup trying to make education more accessible in a market with rising internet penetration and a young, tech-hungry population. I worked on the things that make a learning platform actually usable — student management (enrollment, attendance, progress tracking), interactive learning modules, and custom dashboards that gave educators and students real-time insight into how things were going.",
      "Technically I lived in the MERN stack, with Docker and Redis in the mix to keep the platform robust and responsive. A lot of my early growth came from the unglamorous stuff: Git workflows, code reviews, following coding standards, and learning the MVC pattern and client-server communication well enough that they stopped being mysterious. Mobile responsiveness was a first-class concern — for a lot of our users, the phone was the only device.",
      "By the time I moved on I'd grown from fixing CSS bugs to owning features end-to-end, and the platform was serving thousands of learners reliably. More than any single feature, IshQool taught me what “production” actually means: other people are depending on this, so security, performance, and uptime aren't optional extras — they're the job.",
    ],
    highlights: [
      { title: "LMS core features", detail: "Built student management, interactive modules, and real-time educator/student dashboards." },
      { title: "MERN foundations", detail: "Learned full-stack JS — React, Node/Express, MongoDB — plus Docker and Redis in production." },
      { title: "Mobile-first UX", detail: "Made the platform responsive and accessible for users whose only device was a phone." },
      { title: "Reliability at scale", detail: "Contributed to a platform serving 3,000+ learners at 99.9% uptime." },
    ],
    learnings: [
      "“Production” means people depend on it — security, performance, and uptime are the job, not extras.",
      "Mentorship and code review are how you actually learn to write software, not docs alone.",
      "In emerging markets, mobile-first isn't a preference — it's the entire user base.",
      "Fundamentals (Git, MVC, client-server) stop being scary once you ship with them.",
    ],
    tech: ["React.js", "Redux Toolkit", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "Socket.IO", "Redis", "Docker", "JWT", "Jest"],
    stats: [
      { label: "First role", value: "2021" },
      { label: "Learners", value: "3,000+" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
];

export const journeyMeta = {
  years: "5+",
  companies: journey.length,
  span: "2021 — Present",
};
