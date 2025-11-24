import {
  Book, Brain, Code2, Users, Laptop, Database, Shield, Zap, Coffee, FileUser, Github, Globe, Heart, Layout, Linkedin, Mail, Microscope, Music, Palette, PenTool, Puzzle, Repeat, Rocket, Search, Store, Target, Trophy,
  Code,
  AlertCircle,
  Smartphone,
  LayoutDashboard,
  Terminal,
  Gamepad,
  PencilRuler,
  Microchip,
  BrainCircuit,
  Clock
} from "lucide-react";
import localFont from "next/font/local";

const skills = {
  specialized: [
    // Core Frontend
    'TypeScript',
    'JavaScript (ES6+)',
    'React & Next.js',
    'Redux & Redux Toolkit',
    'Vue.js & Nuxt.js',
    'React Native',
    // Backend
    'Node.js & Express',
    'NestJS',
    'REST APIs',
    'GraphQL',
    'Microservices',
    // Databases
    'MongoDB',
    'PostgreSQL',
    'MSSQL',
    // Architecture
    'System Design',
    'Design Patterns',
    'Clean Architecture',
    // Leadership
    'Technical Leadership',
    'Project Management',
    'Team Mentorship'
  ],
  comfortable: [
    // DevOps & Cloud
    'Docker',
    'Kubernetes',
    'AWS (EC2, S3, Lambda, CloudFront)',
    'CI/CD Pipelines',
    'GitLab CI/CD',
    // Backend Tools
    'RabbitMQ',
    'Redis',
    'WebSockets',
    'Message Queues',
    // Databases
    'MySQL',
    'Sequelize ORM',
    // Testing
    'Jest',
    'React Testing Library',
    'Unit Testing',
    // Frontend
    'Tailwind CSS',
    'Material UI',
    'shadcn/ui',
    'Flutter',
    'Webpack',
    'Vite',
    // API Design
    'OpenAPI/Swagger',
    'API Security',
    // AI/ML
    'AI Model Integration',
    'OpenAI API',
    'Machine Learning Basics'
  ],
  tools: [
    // Version Control
    'Git',
    'GitHub/GitLab',
    // Project Management
    'Jira',
    'Trello',
    'Agile/Scrum',
    // Development
    'VS Code',
    'Postman',
    'Insomnia',
    // Design
    'Figma',
    'Adobe XD',
    // AI Tools
    'ChatGPT',
    'GitHub Copilot',
    'Claude AI',
    // Build Tools
    'npm/yarn/pnpm',
    'ESBuild',
    // Security
    'JWT',
    'OAuth 2.0',
    'RBAC',
    // Migration Tools
    'Legacy System Migration',
    'Database Migration',
    'VB.NET to Web Migration'
  ]
};
export const yearsOfExperince = 5
const experiences = [
  {
    "company": "Mediusware",
    "companyLogo": "https://media.licdn.com/dms/image/v2/D560BAQF2PifV7yh-oQ/company-logo_200_200/B56ZU23g_LGQAI-/0/1740382278023/mediusware_ltd_logo?e=1755734400&v=beta&t=25cZvVjpSbGc1BbrNdgfds1PbDgaufvUBql66gae5qo",
    "positions": [
      {
        "title": "Senior Software Engineer",
        "duration": "May 2025 - Present",
        "period": "Ongoing",
      }
    ],
    "duration": "May 2025 - Present (7 months)",
    "type": "Full-time",
    "location": "Mohammadpur, Dhaka - On-site",
    "description": "Leading development of enterprise-level applications using cutting-edge technologies. Responsible for system architecture, team mentorship, and delivering high-quality solutions for complex business requirements.",
    "keyTechnologies": ['React Native', 'React JS', 'Next.js', 'Node JS', 'Flutter', 'AI/ML Integration', 'Web Scraping', 'Docker', 'AWS CloudFront', 'AWS Lambda', 'AWS S3', 'AWS EC2', 'System Design']
  },
  {
    "company": "All Generation Tech",
    "companyLogo": "https://media.licdn.com/dms/image/v2/D4D0BAQHoOVFxddbjLg/company-logo_200_200/company-logo_200_200/0/1727288301001/all_generation_tech_logo?e=1751500800&v=beta&t=MsVnceDiYQkwvKlLtw4gUmXAMLFSs_BnKAqVai3c2-M",
    "positions": [
      {
        "title": "Software Engineer",
        "duration": "Dec 2024 - May 2025",
        "period": "5 months",
      }
    ],
    "duration": "December 2024 - May 2025 (5 months)",
    "type": "Full-time",
    "location": "New York, United States - Remote",
    "description": "Developed scalable web applications and mobile solutions for international clients. Specialized in real-time applications using modern JavaScript frameworks and cloud technologies.",
    "keyTechnologies": ['React Native', 'React JS', 'Next.js', 'Node JS', 'WebSocket', 'Web Scraping', 'Docker', 'AWS CloudFront', 'AWS Lambda', 'AWS S3', 'AWS EC2', 'Microservices']
  },
  {
    "company": "Masleap Plc",
    "companyLogo": "https://media.licdn.com/dms/image/v2/C4D0BAQEn0kE51pSFMw/company-logo_200_200/company-logo_200_200/0/1635880649194?e=1751500800&v=beta&t=0cxYxrqbei2-eFEHrt_aD5J5FG_2w9vTJLYsJT-eqkE",
    "duration": "1 year 7 months",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh - On-site",
    "description": "During my tenure at Masleap Plc., I progressed from Lead Developer to Project Manager, leading transformative projects for international clients. Spearheaded the modernization of legacy systems and developed scalable enterprise solutions.\n\nKey achievements include:\n• Led the complete migration of Grimm Scientific's legacy VB.NET system to modern web architecture using Nuxt.js, Vue 3, and MSSQL\n• Developed 8 critical modules including accounting, engineering management (CAPA), vendor management, and customer relations\n• Architected and delivered Bodhisys property management system with React Native mobile app\n• Currently leading Falcon Snap document management system for streamlining business processes\n• Managed cross-functional teams and implemented agile methodologies\n• Delivered projects with 95% client satisfaction rate",
    "positions": [
      {
        "title": "Project Manager cum Developer",
        "duration": "Oct 2024 - Dec 2024",
        "period": "3 months",
      },
      {
        "title": "Lead Developer",
        "duration": "May 2023 - Oct 2024",
        "period": "1 yr 5 months",
        "location": "Mohammadpur, Dhaka",
      },
    ],
    keyTechnologies: ['Nuxt.js', 'Vue.js', 'H3', 'VB.NET Migration', 'MSSQL', 'MySQL', 'React Native', 'React.js', 'Next.js', 'Node.js', 'WebSocket', 'Web Scraping', 'Docker', 'AWS CloudFront', 'AWS Lambda', 'AWS S3', 'AWS EC2', 'Project Management']
  },
  {
    "company": "IshQool",
    "companyLogo": "https://media.licdn.com/dms/image/v2/D4D0BAQGdwOuHisFr3g/company-logo_100_100/company-logo_100_100/0/1680240340779?e=1751500800&v=beta&t=frj3w-icnTZhx3i4Mc5RkczDwZzNzTplydMoH9IbMhM",
    "duration": "1 yr 6 mos",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh · Remote",
    "positions": [
      {
        "title": "Full-stack Developer",
        "duration": "Jan 2023 - april 2023",
        "period": "4 months",
      },
      {
        "title": "Web Developer",
        "duration": "Nov 2021 - Jan 2023",
        "period": "1 yr 3 months",
      }
    ],
    'description': `At Ishqool, I played a core role in developing their Learning Management System (LMS), aimed at providing accessible and engaging digital learning solutions for students and educators. Ishqool, a Bangladeshi edtech startup, is aligned with the growing edtech sector driven by increasing internet penetration and a tech-savvy youth demographic in the country.\n\nI developed key LMS functionalities such as student management (enrollment, attendance, and progress tracking), interactive learning modules, and custom dashboards for real-time insights, tailored to both educators and students.\n\n Using the MERN stack, along with tools like Docker and Redis, I ensured the platform’s robustness, scalability, and efficiency. I built backend solutions that handled data securely, supporting assignments, assessments, and analytics.\n\n I contributed to designing user-friendly interfaces, ensuring the platform was responsive and accessible on mobile devices, an important feature for Bangladesh's digital ecosystem. I focused on the needs of students, educators, and administrators to create an intuitive experience.\n\n I implemented solutions to ensure the LMS could handle a growing user base without compromising on performance. Security was also a key priority, and I followed best practices to protect user data and maintain platform integrity.\n\n I helped position Ishqool as a competitive player in Bangladesh’s edtech market by providing innovative features that addressed local educational needs. Understanding industry trends, such as skills development and exam preparation, allowed me to scale the LMS for both institutional and individual learners.\n\nIshqool operates in a rapidly growing edtech market in Bangladesh, with competitors like 10 Minute School and Shikho making strides. The LMS I developed played a key role in digitizing education and supporting both urban and rural learners. This experience has deepened my expertise in building scalable, impactful educational solutions, and addressing challenges in emerging markets.`,
    "keyTechnologies": ['React JS', 'Redux', 'Next Js', 'Node JS', 'Express JS', 'Postgre SQL', 'Socket IO', 'Firebase', 'ERD', 'Jest', 'Redis']

  }
];
const achievements = [
  {
    title: 'Enterprise System Migration',
    description: 'Successfully migrated legacy VB.NET enterprise system to modern web architecture, serving 500+ enterprise users with 99.9% uptime.',
    icon: Layout
  },
  {
    title: 'Team Leadership',
    description: 'Led development teams across 5+ projects, mentored 25+ junior developers, and delivered solutions with 95% client satisfaction rate.',
    icon: Users
  },
  {
    title: 'Scalable Architecture Design',
    description: 'Architected microservices-based systems handling 10K+ concurrent users with optimized performance and reliability.',
    icon: Database
  },
  {
    title: 'International Client Success',
    description: 'Delivered 15+ projects for clients in USA, Bangladesh, and EU, Middle Eastern markets with focus on scalable, maintainable solutions.',
    icon: Trophy
  },
  {
    title: "AI/ML Integration Leadership",
    description: "Pioneered AI model integration in production applications, enhancing user experience and business automation capabilities.",
    icon: Brain
  },
  {
    title: "Technical Innovation",
    description: "Implemented cutting-edge solutions using modern frameworks, cloud technologies, and industry best practices for optimal results.",
    icon: Rocket
  },
];
const projects = [
  {
    id: 'ishqool',
    title: "Learning Management System",
    description: "Ishqool is an emerging edtech startup in Bangladesh focusing on digital education solutions. It aims to transform how education is delivered in the country by leveraging technology to create engaging and accessible learning experiences.",
    image: "/ishqool.png",
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Redis'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Full Stack Application',
    metrics: {
      users: '3,000+',
      satisfaction: '95%',
      performance: '99.9%'
    },
    timeline: '8 months',

  },
  {
    id: 'gobadi',
    title: "Gobadi",
    description: "Gobadi is a mobile application designed to empower local farmers and livestock owners by providing a comprehensive platform for livestock management, veterinary support, and productivity enhancement. The app enables users to monitor their livestock’s health, schedule vaccinations, and connect with veterinarians. A unique AI-powered analyzer allows users to upload ...",
    image: "/gobadi.png",
    technologies: ['React', 'Redux', 'Express', 'PostgreSQL'],
    liveUrl: 'https://gobadi-admin.vercel.app/',
    githubUrl: '#',
    category: 'Web & Mobile Application',
  },
  {
    id: 'gsm',
    title: "Grimm Scientific Management (GSM)",
    description: "A comprehensive management software for Grimm Scientific, covering payroll, employee management, logistics, and more. Migrated a legacy VB.NET application to Nuxt.js for scalability while optimizing a massive, unstructured MSSQL database.",
    image: "/gsm.png",
    technologies: ['Nuxt.js', 'Node.js', 'MSSQL', 'Sequelize', 'Tailwind CSS'],
    liveUrl: 'https://gmssystem.paradynamix.com/login',
    githubUrl: '#',
    category: 'Enterprise Application',
    timeline: '3 months'
  },

  {
    id: 'gadgets-heaven',
    title: "Gadgets Heaven",
    description: "A comprehensive management software for Grimm Scientific, covering payroll, employee management, logistics, and more. Migrated a legacy VB.NET application to Nuxt.js for scalability while optimizing a massive, unstructured MSSQL database.",
    image: "/gadgets-heaven.png",
    technologies: ['Next.js', 'Shadcn UI', 'Tailwind CSS', "framer-motion", "zustand"],
    liveUrl: 'https://gadgets-heaven-rho.vercel.app/',
    githubUrl: 'https://github.com/un-earthly/gadgets-heaven-client',
    category: 'Enterprise Application',
    timeline: '3 months'
  },

];
const categories = ['All Projects', 'Full Stack', 'Mobile Apps', 'E-Commerce', 'Enterprise'];

const services = [
  {
    id: 'full-stack-dev',
    icon: Code2,
    title: "Full Stack Development",
    shortDesc: "End-to-end web applications with modern technologies.",
    description: "Crafting scalable and maintainable applications using React, Next.js, Node.js, and more.",
    keyFeatures: [
      "Custom web application development",
      "RESTful API design and implementation",
      "Database architecture and optimization",
      "Performance optimization and scaling"
    ]
  },
  {
    id: 'ui-ux-design',
    icon: Palette,
    title: "UI/UX Design",
    shortDesc: "User-centered design solutions that engage and convert.",
    description: "Creating intuitive interfaces with a focus on user experience and conversion optimization.",
    keyFeatures: [
      "Responsive web design",
      "User interface prototyping",
      "Interaction design",
      "Usability testing"
    ]
  },
  {
    id: 'tech-consulting',
    icon: Database,
    title: "Technical Consulting",
    shortDesc: "Strategic technology guidance and solutions architecture.",
    description: "Providing expert advice on technology stack selection and architecture decisions.",
    keyFeatures: [
      "Technology stack assessment",
      "Architecture planning",
      "Performance optimization",
      "Security best practices"
    ]
  }
];

const developmentProcess = [
  {
    icon: Search,
    title: "Discovery & Planning",
    description: "Requirements gathering and project scope definition using Agile user stories.",
    details: [
      "As a [user type], I want to [action] so that [benefit]",
      "Story point estimation",
      "Sprint planning",
      "Acceptance criteria definition"
    ]
  },
  {
    icon: PenTool,
    title: "Design & Architecture",
    description: "System design and technical architecture planning.",
    details: [
      "High-level system design",
      "Database schema design",
      "API endpoint planning",
      "UI/UX wireframing"
    ]
  },
  {
    icon: Laptop,
    title: "Development",
    description: "Iterative development in sprints following Agile principles.",
    details: [
      "2-week sprint cycles",
      "Daily stand-ups",
      "Code reviews",
      "Continuous Integration"
    ]
  },
  {
    icon: Microscope,
    title: "Testing & QA",
    description: "Comprehensive testing and quality assurance.",
    details: [
      "Unit testing",
      "Integration testing",
      "User acceptance testing",
      "Performance testing"
    ]
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Smooth deployment and production release.",
    details: [
      "Automated deployment",
      "Environment configuration",
      "Performance monitoring",
      "Security checks"
    ]
  },
  {
    icon: Repeat,
    title: "Maintenance & Support",
    description: "Ongoing support and iterative improvements.",
    details: [
      "Bug fixes",
      "Feature enhancements",
      "Performance optimization",
      "Security updates"
    ]
  }
];
const tags = [
  "Web Development",
  "Mobile Apps",
  "Cloud Solutions",
  "DevOps",
  "API Development",
  "Database Design",
  "System Architecture",
  "Performance Optimization"
]
const links = [
  {
    href: '/',
    label: 'Home'
  },
  {
    href: "/portfolio",
    label: 'Portfolio'
  },
  {
    href: '/about',
    label: 'About'
  },
];
const codeSnippets = [
  { color: 'text-green-400', content: '<div>' },
  { color: 'text-blue-400', content: 'const dev =' },
  { color: 'text-yellow-400', content: 'function()' },
  { color: 'text-pink-400', content: '=> {' },
  { color: 'text-purple-400', content: 'return (' },
];
const persona = {
  role: "Senior Full Stack Developer & Technical Leader",
  mission: "To architect innovative solutions that drive digital transformation while mentoring the next generation of developers",
  characteristics: [
    {
      trait: "Solution Architect",
      description: "Designs enterprise-scale systems with modern architecture patterns",
      icon: Database
    },
    {
      trait: "Technical Leader",
      description: "Mentors teams and drives technical excellence in organizations",
      icon: Users
    },
    {
      trait: "Innovation Driver",
      description: "Integrates cutting-edge technologies like AI/ML into business solutions",
      icon: Brain
    }
  ],
  epics: [
    {
      title: "The Foundation Years",
      description: "Built strong fundamentals through self-directed learning and practical projects",
      milestones: [
        "Mastered MERN stack through hands-on project development",
        "Completed comprehensive courses in system design and architecture",
        "Built first production-ready LMS serving 5k+ users",
      ],
      icon: Rocket
    },
    {
      title: "The Leadership Journey",
      description: "Evolved from developer to technical leader driving complex projects",
      milestones: [
        "Led enterprise system migration from VB.NET to modern web architecture",
        "Managed cross-functional teams across multiple international projects",
        "Mentored 25+ developers while maintaining hands-on technical contribution"
      ],
      icon: Target
    },
    {
      title: "The Innovation Phase",
      description: "Pioneering AI integration and modern architecture patterns",
      milestones: [
        "Successfully integrated AI/ML models in production applications",
        "Architected microservices handling 10K+ concurrent users",
        "Delivered solutions for international clients with 95% satisfaction rate"
      ],
      icon: Brain
    }
  ]
};

const userStories = [
  {
    as: "A Senior Developer",
    want: "To architect and deliver enterprise-scale solutions",
    so: "That businesses can achieve digital transformation and growth",
    metrics: ["5+ years experience", "30+ successful projects", "Multiple Lead Roles"]
  },
  {
    as: "A Technical Leader",
    want: "To mentor teams and drive technical excellence",
    so: "That organizations can build robust, scalable systems",
    metrics: ["25+ developers mentored", "5+ teams led", "95% project success rate"]
  },
  {
    as: "A Solution Architect",
    want: "To design cutting-edge systems with modern technologies",
    so: "That clients receive future-proof, maintainable solutions",
    metrics: ["Enterprise migrations", "Microservices design", "AI/ML integration"]
  }
];
const skillCategories = [
  {
    title: "Frontend Technologies",
    icon: "🎨",
    skills: [
      "React, Next.js, Remix, Redux/RTK",
      "Vue, Nuxt, Vuex, Pinia",
      "Svelte, SvelteKit, Qwik",
      "React Native, Flutter, Ionic",
      "TypeScript, JavaScript, WebAssembly"
    ]
  },
  {
    title: "Backend & APIs",
    icon: "⚡",
    skills: [
      "Node.js, Express, NestJS, Fastify",
      "Django, DRF, FastAPI, Flask",
      "GraphQL, REST, gRPC, WebSockets",
      "OAuth2, JWT, API Gateway",
      "Message Queues (RabbitMQ, Kafka)"
    ]
  },
  {
    title: "Data & Storage",
    icon: "💾",
    skills: [
      "PostgreSQL, MySQL, MSSQL",
      "MongoDB, Cassandra, Redis",
      "Elasticsearch, Clickhouse",
      "Data Modeling & Normalization",
      "Query Optimization & Indexing"
    ]
  },
  {
    title: "System Architecture",
    icon: "🏗️",
    skills: [
      "Microservices, Event-Driven",
      "Monolithic, Layered, Hexagonal",
      "CQRS, Event Sourcing",
      "Serverless, FaaS, BaaS",
      "Domain-Driven Design (DDD)"
    ]
  },
  {
    title: "Core CS Concepts",
    icon: "🧮",
    skills: [
      "DSA, Time/Space Complexity",
      "Design Patterns, SOLID, Clean Code",
      "Concurrency, Threading, Async",
      "Distributed Systems, CAP Theorem",
      "System Design & Scalability"
    ]
  },
  {
    title: "DevOps & Infrastructure",
    icon: "🔧",
    skills: [
      "Docker, Kubernetes",
      "CI/CD, GitOps, Infrastructure as Code",
      "AWS S3, Ec2, Cloudefront, RDS, Amplify,EFS ",
      "Monitoring, Logging, Tracing",
      "Security Best Practices, OWASP"
    ]
  }
];
const personalInterests = [
  {
    icon: Microchip,
    title: "IoT & Custom Rigs",
    description: "Building smart home automation systems and custom PC setups for optimal performance"
  },
  {
    icon: BrainCircuit,
    title: "Generative AI",
    description: "Exploring and developing AI models for creative problem-solving and automation"
  },
  {
    icon: Music,
    title: "Music Lover",
    description: "Finding inspiration in melodies while coding and creating playlists for different programming moods"
  },
];
const geistSans = localFont({
  src: "./app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const socialLinks = [
  {
    label: "GitHub",
    icon: Github,
    href: 'https://github.com/un-earthly'
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/alamin-md/"
  },

  {
    label: "Email",
    icon: Mail,
    href: 'mailto:vijayalamin@gmail.com'
  },
  {
    label: "Resume",
    icon: FileUser,
    href: '/resume.pdf'
  }

];
const projectsDetails = [
  {
    id: 'ishqool',
    title: 'IshQool Ed-tech',
    subtitle: "My first professional project where I learned full-stack development by building an education platform under senior mentorship.",
    thumbnail: 'https://i.ibb.co.com/Kz7sJv9/image.png',
    timeline: '8 months',
    role: 'Web Developer → Full Stack Developer',
    client: 'EdTech Startup',
    overview: `In my first professional role at Ishqool, I started as a junior developer working on their Learning Management System (LMS). Under the guidance of senior developers, I learned to build React components, implement APIs, and work with databases. This hands-on experience at a Bangladeshi edtech startup taught me practical web development while contributing to a platform that makes education more accessible.`,
    challenges: [
      {
        title: 'Learning Curve',
        description: 'Mastering Git workflows, code review processes, and the MERN stack',
        icon: Users
      },
      {
        title: 'Complex Architecture',
        description: 'Understanding MVC pattern and client-server communication',
        icon: Zap
      },
      {
        title: 'Team Collaboration',
        description: 'Following coding standards and documentation requirements',
        icon: Shield
      }
    ],
    solutions: [
      {
        title: 'Guided Learning of MERN Stack',
        description: 'Built features using Node.js, Express, MongoDB, and React under senior guidance',
        icon: Database,
        details: [
          'Created REST APIs using Express for user authentication and course management',
          'Built React components for student dashboard and course viewer',
          'Wrote MongoDB queries for user data and course content storage',
          'Connected React components to backend APIs using Axios',
          'Used Git for version control and pull request workflows'
        ]
      },
      {
        title: 'Real-time Feature Implementation',
        description: 'Built WebSocket features with mentor support',
        icon: Laptop,
        details: [
          'Implemented course progress tracking updates',
          'Built WebSocket connection for live quiz participation',
          'Created real-time notification system for course updates'
        ]
      },
      {
        title: 'Security Implementation',
        description: 'Learned and applied security measures under senior supervision',
        icon: Shield,
        details: [
          'Implemented JWT tokens for user session management',
          'Set up role-based permissions for students and teachers',
          'Applied input validation and sanitization'
        ]
      }
    ],
    techStack: {
      frontend: ['React.js', 'TypeScript', 'Scss', 'Redux Toolkit'],
      backend: ['Node.js', 'Express', 'WebSocket', 'RESTful APIs', 'JWT', 'RBAC', 'Postman'],
      database: ['PostgreSQL', 'Redis', 'MongoDB'],
      devops: ['Docker', 'AWS', 'Github Actions', 'AWS S3']
    },
    keyFeatures: [
      'Course content player with video and text lessons',
      'Student progress tracking dashboard',
      'Teacher analytics for course performance',
      'User management system',
      'Automated quiz grading system',
      'Video lecture streaming'
    ],
    metrics: {
      users: '3,000+',
      satisfaction: '95%',
      performance: '99.9%',
      uptime: '99.99%'
    },
    developmentPhases: [
      {
        title: 'Initial Learning Phase',
        duration: '4 weeks',
        activities: [
          'Studied the existing React component structure',
          'Learned Express routing and middleware concepts',
          'Practiced MongoDB CRUD operations',
          'Set up local development environment',
          'Completed assigned Udemy courses on MERN stack'
        ]
      },
      {
        title: 'Guided Development',
        duration: '8 weeks',
        activities: [
          'Built login and registration forms in React',
          'Created APIs for user authentication',
          'Set up MongoDB schemas for users and courses',
          'Participated in daily code reviews',
          'Fixed CSS styling issues and UI bugs'
        ]
      },
      {
        title: 'Growing Responsibilities',
        duration: '12 weeks',
        activities: [
          'Built course viewer component in React',
          'Created APIs for course management',
          'Added WebSocket for real-time features',
          'Implemented user roles and permissions',
          'Optimized frontend performance'
        ]
      },
      {
        title: 'Independent Contribution',
        duration: '4 weeks',
        activities: [
          'Built quiz module frontend and backend',
          'Created student progress tracking system',
          'Added real-time notifications',
          'Implemented error logging system',
          'Helped with AWS S3 integration'
        ]
      }
    ],
    results: [
      {
        metric: 'Technical Skills',
        value: 'MERN',
        description: 'Learned full-stack JavaScript development'
      },
      {
        metric: 'Features Built',
        value: '4',
        description: 'Auth, Courses, Quiz, Progress tracking modules'
      },
      {
        metric: 'Code Quality',
        value: '90%',
        description: 'Pull request approval rate'
      }
    ],
    href: 'https://www.ishqool.com/',
    responsibilities: [
      {
        role: 'Junior Web Developer (Initial Phase)',
        icon: Code,
        tasks: [
          'Built login and registration pages in React',
          'Connected authentication APIs to frontend forms',
          'Created course listing and detail pages from Figma designs',
          'Fixed browser compatibility issues in Chrome and Firefox'
        ]
      },
      {
        role: 'Growing Full-Stack Developer (Later Phase)',
        icon: Database,
        tasks: [
          'Created MongoDB schemas for quiz and progress tracking',
          'Built REST APIs for quiz submission and grading',
          'Added JWT authentication to protect admin routes',
          'Implemented WebSocket for live quiz participation',
          'Optimized image loading with lazy loading'
        ]
      }
    ]
  },
  {
    id: 'gobadi',
    title: 'Gobadi',
    subtitle: 'Technical architect and lead developer for an AI-powered livestock healthcare platform',
    thumbnail: 'https://i.ibb.co.com/N3fxDvN/image.png',
    timeline: '4 months',
    role: 'Technical Architect & Lead Developer',
    client: 'Internal Product',
    overview: `Gobadi is our startup's livestock management platform that revolutionizes veterinary care through AI-powered diagnostics and telemedicine. As the technical architect and lead developer, I designed and implemented both the mobile application and admin dashboard, focusing on creating a robust architecture that handles AI-based disease detection, automated pricing systems, and real-time vet consultations. Working closely with product management, I established the technical foundation for scaling our platform.`,

    challenges: [
      {
        title: 'System Architecture',
        description: 'Designing a scalable architecture to handle AI processing, real-time communication, and automated pricing',
        icon: Database
      },
      {
        title: 'AI Integration',
        description: 'Creating reliable image processing pipeline for livestock disease detection and automated price calculation',
        icon: Brain
      },
      {
        title: 'Performance at Scale',
        description: 'Implementing advanced caching and state management for optimal user experience',
        icon: Zap
      },
      {
        title: 'Error Handling',
        description: 'Developing comprehensive error handling and logging system for better debugging and monitoring',
        icon: AlertCircle
      }
    ],

    solutions: [
      {
        title: 'Robust Architecture Design',
        description: 'Implemented scalable architecture with advanced error handling and logging',
        icon: Database,
        details: [
          'Designed modular architecture separating AI processing, user management, and consultation systems',
          'Implemented comprehensive error handling with detailed logging',
          'Created efficient caching strategies using Redis',
          'Built automated failover systems for critical services',
          'Developed optimized database schemas for quick data retrieval'
        ]
      },
      {
        title: 'Mobile App Development',
        description: 'Built React Native app with optimized state management and offline capabilities',
        icon: Smartphone,
        details: [
          'Implemented efficient Redux state management architecture',
          'Created optimized image processing pipeline for AI analysis',
          'Built real-time consultation feature with WebSocket',
          'Developed robust offline mode with data synchronization',
          'Implemented automated price calculation system'
        ]
      },
      {
        title: 'Admin Dashboard',
        description: 'Developed comprehensive admin interface with real-time monitoring',
        icon: LayoutDashboard,
        details: [
          'Built scalable React admin dashboard using shadcn/ui',
          'Implemented real-time monitoring of system metrics',
          'Created detailed analytics for disease detection patterns',
          'Developed vet consultation management system',
          'Added automated pricing oversight tools'
        ]
      },
      {
        title: 'AI Integration',
        description: 'Implemented robust AI processing pipeline for disease detection',
        icon: Brain,
        details: [
          'Created optimized image processing pipeline for OpenAI integration',
          'Implemented automated disease detection system',
          'Built dynamic pricing algorithm based on AI analysis',
          'Developed caching system for AI responses',
          'Added failure handling for AI processing'
        ]
      }
    ],

    techStack: {
      frontend: [
        'React',
        'React Native',
        'Redux Toolkit',
        'Tailwind CSS',
        'shadcn/ui',
        'Socket.io Client'
      ],
      backend: [
        'Node.js',
        'Express',
        'JWT',
        'Socket.io',
        'OpenAI API'
      ],
      database: [
        'PostgreSQL',
        'Redis',
        'Sequelize ORM'
      ],
      monitoring: [
        'Winston Logger',
        'Error Tracking',
        'Performance Monitoring'
      ]
    },

    keyFeatures: [
      'AI-powered livestock disease detection',
      'Automated consultation pricing',
      'Real-time vet consultation system',
      'Advanced error tracking and logging',
      'Optimized state management',
      'Comprehensive admin dashboard',
      'Real-time system monitoring',
      'Robust caching implementation',
      'Automated failover systems',
      'Performance optimization'
    ],

    metrics: {
      processing_time: '2s',
      ai_accuracy: '95%',
      app_performance: '99%',
      uptime: '99.9%'
    },

    developmentPhases: [
      {
        title: 'Architecture Planning',
        duration: '2 weeks',
        activities: [
          'Designing system architecture for scalability',
          'Planning state management structure',
          'Creating error handling strategy',
          'Designing AI integration pipeline',
          'Planning caching implementation'
        ]
      },
      {
        title: 'Foundation Development',
        duration: '4 weeks',
        activities: [
          'Setting up base architecture',
          'Implementing core state management',
          'Creating error handling system',
          'Building logging infrastructure',
          'Implementing caching system'
        ]
      },
      {
        title: 'Feature Implementation',
        duration: '6 weeks',
        activities: [
          'Developing AI image processing pipeline',
          'Building consultation system',
          'Creating pricing algorithm',
          'Implementing real-time features',
          'Building admin dashboard'
        ]
      },
      {
        title: 'Optimization Phase',
        duration: '4 weeks',
        activities: [
          'Optimizing app performance',
          'Enhancing error handling',
          'Improving caching efficiency',
          'Refining AI processing',
          'Streamlining state management'
        ]
      }
    ],

    responsibilities: [
      {
        role: 'Technical Architect',
        icon: Code,
        tasks: [
          'Designed scalable system architecture for mobile and web applications',
          'Created efficient state management structure using Redux',
          'Implemented comprehensive error handling and logging system',
          'Designed AI integration pipeline for disease detection',
          'Developed automated pricing calculation system'
        ]
      },
      {
        role: 'Lead Developer',
        icon: Terminal,
        tasks: [
          'Built React Native mobile application with optimized performance',
          'Developed React admin dashboard with real-time monitoring',
          'Implemented advanced caching strategies',
          'Created robust error tracking and debugging systems',
          'Optimized application performance and state management'
        ]
      }
    ],

    href: 'https://gobadi-admin.vercel.app/'
  },
  {
    id: "gsm",
    title: "Grimm Scientific Management (GSM)",
    subtitle: "A high-stakes modernization project converting a legacy VB.NET desktop application into a scalable web and mobile solution.",
    thumbnail: "/grimm.png",
    timeline: "9 months",
    role: "Lead Developer",
    client: "Grimm Scientific",
    overview: `GSM is an all-encompassing management software for Grimm Scientific, covering payroll, payment processing, employee management, attendance, KPI, product management, supply chain logistics, and company-wide operations. The project involved migrating a slow, legacy VB.NET desktop application to a modern Nuxt.js-based solution with MSSQL while retaining the original database structure.`,
    challenges: [
      {
        title: "Legacy System Constraints",
        description: "Handling outdated VB.NET code with no documentation or optimization.",
        icon: Clock
      },
      {
        title: "Complex Database",
        description: "A massive database with millions of entries, lacking table relations or indexing.",
        icon: Database
      },
      {
        title: "Team Learning Curve",
        description: "Introducing developers to Nuxt.js, MSSQL, and working with legacy structures.",
        icon: Users
      },
      {
        title: "Tight Deadlines",
        description: "Delivering the first phase by November with minimal initial planning.",
        icon: Shield
      }
    ],
    solutions: [
      {
        title: "Robust Database Optimization",
        description: "Refactored and optimized the database for performance and scalability.",
        icon: Database,
        details: [
          "Introduced indexing for faster query execution on large datasets.",
          "Refactored inefficient multi-join queries using nested subqueries.",
          "Eliminated redundant and replicated queries for streamlined data retrieval.",
          "Guided the team in understanding and optimizing SQL queries.",
          "Improved database performance to handle millions of entries efficiently."
        ]
      },
      {
        title: "Scalable API Design",
        description: "Developed scalable and efficient APIs using Nuxt.js and H3.",
        icon: Laptop,
        details: [
          "Built modular, low-latency APIs to handle complex operations.",
          "Implemented horizontal scaling for future growth.",
          "Leveraged Nuxt H3 for high-performance server-side architecture.",
          "Streamlined backend development with Sequelize and MSSQL integration.",
          "Hosted and deployed solutions on AWS using GitLab CI/CD pipelines."
        ]
      },
      {
        title: "Developer Mentorship and Management",
        description: "Led a team of developers while ensuring technical excellence.",
        icon: Users,
        details: [
          "Conducted code reviews and guided team members on SQL and Nuxt.js.",
          "Introduced efficient tools like ChatGPT and Claude for productivity.",
          "Managed sprints, task assignments, and workflows via Jira.",
          "Provided hands-on mentorship to bridge learning gaps in MSSQL and Nuxt.",
          "Maintained high team morale despite tight deadlines and project challenges."
        ]
      },
      {
        title: "Legacy Code Migration",
        description: "Converted legacy VB.NET functionalities into modern, web-based equivalents.",
        icon: Shield,
        details: [
          "Analyzed and documented legacy VB.NET code for smooth migration.",
          "Recreated core desktop application features in Nuxt.js for web and mobile.",
          "Ensured feature parity with the original system while improving performance.",
          "Implemented logging and error handling mechanisms for seamless user experience.",
          "Delivered a usable, scalable platform meeting all client requirements."
        ]
      }
    ],
    techStack: {
      frontend: ["Nuxt.js", "Vue.js", "Tailwind CSS"],
      backend: ["Node.js", "H3 APIs", "Sequelize", "JWT", "RBAC"],
      database: ["MSSQL", "Sequelize"],
      devops: ["AWS", "GitLab CI/CD", "Docker"]
    },
    keyFeatures: [
      "Modernized payroll and payment processing system.",
      "Optimized employee attendance and KPI management.",
      "Improved supply chain logistics tracking.",
      "Horizontal scalability for future growth.",
      "Enhanced database performance for large datasets."
    ]
  }

];
export {
  developmentProcess,
  achievements,
  experiences,
  projects,
  services,
  tags,
  skills,
  categories,
  links,
  skillCategories,
  userStories,
  persona,
  personalInterests,
  codeSnippets,
  geistSans,
  geistMono,
  projectsDetails,
  socialLinks
}