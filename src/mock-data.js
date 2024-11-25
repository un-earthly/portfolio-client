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
  BrainCircuit
} from "lucide-react";
import localFont from "next/font/local";

const skills = {
  specialized: ['React & Next.js', 'Redux', 'TypeScript', 'Node & Express JS', 'MongoDB', 'PostgreSQL', 'Vue & Nuxt.js'
  ],
  comfortable: ['Docker', 'React Native', 'Flutter', 'Web Socket', 'AWS EC2', 'S3', 'Redis', 'MSSQL', 'MySQL'
  ],
  tools: ['Git/Github', 'Firebase', 'Stripe', 'Figma', 'NPM', 'Trello', 'Postman', 'ChatGPT'
  ]
};
const experiences = [
  {
    "company": "Masleap Plc",
    "companyLogo": "https://media.licdn.com/dms/image/v2/C4D0BAQEn0kE51pSFMw/company-logo_100_100/company-logo_100_100/0/1635880649194",
    "duration": "4 months",
    "type": "Full-time",
    "location": "On-site",
    "description": "During my time at Masleap Plc., I began as a Lead Developer specializing in the PERN stack and was later promoted to Project Manager cum Developer due to my performance. My journey here has been marked by leading challenging and impactful projects for clients across diverse industries.\n\n One of my key contributions was transitioning a legacy VB.NET and MSSQL desktop- based system to a modern web architecture using Nuxt, Vue 3, Sequelize, and MSSQL.This project was for Grimm Scientific Industry, an internal company management system with 32 modules.I personally developed 8 critical modules, including accounting, engineering management(CAPA, vendors, purchase orders), and customer management.By creating a clean, maintainable architecture, documenting requirements, and coding meticulously, I ensured the system met and exceeded client expectations.\n\n Another milestone was leading the development of Bodhisys, a property and rental management system built with Node.js, Express.js, Docker, and MySQL.I focused on designing the architecture for the React Native application, implementing efficient background processing, and ensuring robust delivery pipelines through GitLab CI/ CD.I managed sprints, collaborated with stakeholders to understand and meet project requirements, and delivered a scalable, high - performance system.The project is now in the maintenance phase.\n\n Currently, I am leading Falcon Snap, a comprehensive document and project management system aimed at streamlining auction processes, project tracking, and document storage for businesses.Its Node.js backend is designed to eliminate manual document management challenges and improve operational efficiency.\n\n Throughout these projects, I have emphasized scalable architecture, sprint management, and delivering client - centric solutions.My role spans development, project management, and cross - functional collaboration, ensuring systems are not only functional but also maintainable and future - ready.",
    "positions": [
      {
        "title": "Project Manager",
        "duration": "Oct 2024 - Present",
        "period": "2 months",
      },
      {
        "title": "Project Lead Developer",
        "duration": "Aug 2024 - Oct 2024",
        "period": "3 months",
        "location": "Mohammadpur, Dhaka",
      }
    ],
    keyTechnologies: ['Nuxt js', 'Vue JS', 'H3 Event', 'VB.Net', 'MSSQL', 'MYSQL', 'React Native', 'React JS', 'Next Js', 'Node JS', 'Web Socket', 'Web Scrapping', 'Dcoker', 'AWS Cloudfront', 'AWS Lambda', 'AWS S3', 'AWS EC2']
  },
  {
    "company": "TNC Global Ltd",
    "duration": "9 months",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh · On-site",
    "positions": [
      {
        "title": "Front End Lead",
        "duration": "Feb 2024 - Jul 2024",
        "period": "6 months",
      },
      {
        "title": "Software Engineer",
        "duration": "Nov 2023 - Feb 2024",
        "period": "4 months",
      }
    ],
    description: "At TNC Global Limited, I began as a Full Stack Developer and was later promoted to Frontend Lead due to my contributions across multiple challenging projects. My role spanned technical development, team leadership, and stakeholder management, enabling me to make a significant impact on the company's key products.\m\nOne of the flagship projects I worked on was BanBox, a PHP- based e - commerce platform designed for order management, CRM purposes, delivery management, and related workflow control.I contributed to the development of its front - end features and worked on optimizing the platform's overall functionality to ensure seamless operations for both business owners and customers.\n\nAnother major project was a comprehensive ERP management system designed to support multitenant functionality with modules such as HRM, order management, company management, and accounting.This project transitioned from jQuery and HTML prototypes to a more modern stack involving Django and React, ensuring scalability and long - term maintainability.\n\nA pivotal moment in my journey was convincing stakeholders to transition from direct HTML / CSS prototyping to Figma for UI / UX design.Leveraging my prior frontend experience, I developed a Figma prototype to demonstrate its advantages.This decision not only streamlined the design process but also enabled better communication between designers and developers.\n\nI played a key role in laying the foundation for the ERP project alongside a backend developer, initially setting up the Django REST framework.As the project scaled, I led the frontend development team, which grew from two members to a team of 14, ensuring high performance and code quality through React and Redux.My responsibilities included building the architecture, maintaining performance metrics, managing workflows using Trello, and introducing QA processes for the client - facing application.\n\nAdditionally, I contributed to the development of iOS and Android applications for the ERP system, further expanding its reach.My experience at TNC Global taught me the importance of bridging the gap between technical and non - technical perspectives, effectively translating client requirements into functional, user - friendly solutions.",
    keyTechnologies: ['React Js', 'Next js', 'Jotai', 'Django', 'DRF', 'PostgreSQL', 'Django ORM', 'Figma', 'AWS EC2', 'AWS S3', 'Web Socket', 'Multi tenants', 'Micro services', 'Dcoker', 'sslcommerz']
  },
  {
    "company": "Premium Solutions Limited",
    "companyLogo": "https://media.licdn.com/dms/image/v2/C4D0BAQHv__l-6HAS9Q/company-logo_100_100/company-logo_100_100/0/1656110075472",
    "duration": "1 year 5 months",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh · Remote",
    "description": "Over the years, I've had the chance to work on some exciting projects for clients across the Middle East, Europe, Bangladesh, and China. One of the most interesting projects I worked on was a Node.js application integrated with Shopify. I built this system to make life easier for Shopify store owners by automating tasks like finding suppliers, managing shipping, and tracking orders—all from a single admin dashboard. It connected businesses with verified suppliers worldwide and streamlined the entire process, saving a lot of time and effort.\n\nAnother project I'm proud of is a Flutter mobile app I developed for an online fish store in the Middle East. This app made it easy for users to find the fish they needed by category, use advanced search options, and manage their orders without any hassle. It was all about creating a smooth and user-friendly shopping experience.\n\nI've also been part of teams working on multiple B2B e-commerce platforms, building features like product listings, order tracking, and supplier profiles. These projects focused on making business operations simpler and more efficient for clients.\n\nWhat I've learned through these experiences is the importance of delivering solutions that are not just technically sound but also practical and easy to use. I've always prioritized creating scalable and reliable systems while making sure everything is delivered on time. It's been a great journey, and I'm excited to keep building solutions that make a difference!",
    "positions": [
      {
        "title": "Full-stack Developer",
        "duration": "Sep 2023 - Jul 2024",
        "period": "11 months",
      },
      {
        "title": "Frontend Developer",
        "duration": "Mar 2023 - Aug 2024",
        "period": "6 months",
      }
    ],
    keyTechnologies: ['React Js', 'Svelte Kit', 'Redux', 'Next js', 'Node JS', 'Flutter', 'React Native', 'MongoDB', 'Shopify', 'Bubble', 'C Panel']

  },
  {
    "company": "Prolific Tech Solutions",
    "duration": "8 months",
    "type": "Part-time",
    "location": "Remote",
    "positions": [
      {
        "title": "React Native Developer",
        "duration": "Nov 2022 - Jun 2023",
        "period": "8 months",
      }
    ],
    description: `At Prolific Tech Solutions, I embarked on my journey as a Junior Developer, marking my second job in the industry. My primary role was to convert Figma designs into React Native UI components, focusing on delivering a seamless user experience for mobile applications. This was my introduction to mobile development, and I quickly learned how to optimize React Native code for performance, ensuring smooth and efficient mobile applications.\n\n In addition to my core responsibilities, I learned the importance of code organization, modularization, and maintaining a clean architecture for long-term maintainability. I developed an understanding of how to calculate the complexity of systems and algorithms, resolving potential issues through optimized solutions. My exposure to internationalization (i18n) using the I18React library allowed me to build applications that could easily support multiple languages and regions, further enhancing the app's global accessibility.\n\n I was also introduced to Know Your Customer (KYC) processes, which deepened my understanding of authentication, user management, and state management for performance optimization. Working on organizing users, contacts, and managing states helped me build a strong foundation in mobile app development.\n\n Being referred to Prolific Tech Solutions by the CTO of Ishqool, where I started my career, provided me with invaluable learning experiences. The role allowed me to grow as a developer, refining my skills in performance metrics, system complexity, and code readability while gaining hands-on experience with real-world applications.`,
    keyTechnologies: ['React Native', 'Socket IO', 'Redux', 'Firebase', 'Node JS', 'Express JS', 'Google Maps', 'Internationalization', 'Jest']

  },
  {
    "company": "IshQool",
    "companyLogo": "https://media.licdn.com/dms/image/v2/D4D0BAQGdwOuHisFr3g/company-logo_100_100/company-logo_100_100/0/1680240340779",
    "duration": "8 months",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh · Remote",
    "positions": [
      {
        "title": "Full-stack Developer",
        "duration": "Jan 2023 - Mar 2023",
        "period": "3 months",
      },
      {
        "title": "Web Developer",
        "duration": "Aug 2022 - Jan 2023",
        "period": "6 months",
      }
    ],
    'description': `At Ishqool, I played a core role in developing their Learning Management System (LMS), aimed at providing accessible and engaging digital learning solutions for students and educators. Ishqool, a Bangladeshi edtech startup, is aligned with the growing edtech sector driven by increasing internet penetration and a tech-savvy youth demographic in the country.\n\nI developed key LMS functionalities such as student management (enrollment, attendance, and progress tracking), interactive learning modules, and custom dashboards for real-time insights, tailored to both educators and students.\n\n Using the MERN stack, along with tools like Docker and Redis, I ensured the platform’s robustness, scalability, and efficiency. I built backend solutions that handled data securely, supporting assignments, assessments, and analytics.\n\n I contributed to designing user-friendly interfaces, ensuring the platform was responsive and accessible on mobile devices, an important feature for Bangladesh's digital ecosystem. I focused on the needs of students, educators, and administrators to create an intuitive experience.\n\n I implemented solutions to ensure the LMS could handle a growing user base without compromising on performance. Security was also a key priority, and I followed best practices to protect user data and maintain platform integrity.\n\n I helped position Ishqool as a competitive player in Bangladesh’s edtech market by providing innovative features that addressed local educational needs. Understanding industry trends, such as skills development and exam preparation, allowed me to scale the LMS for both institutional and individual learners.\n\nIshqool operates in a rapidly growing edtech market in Bangladesh, with competitors like 10 Minute School and Shikho making strides. The LMS I developed played a key role in digitizing education and supporting both urban and rural learners. This experience has deepened my expertise in building scalable, impactful educational solutions, and addressing challenges in emerging markets.`,
    keyTechnologies: ['React JS', 'Redux', 'Next Js', 'Node JS', 'Express JS', 'Postgre SQL', 'Socket IO', 'Firebase', 'ERD', 'Jest', 'Redis']

  }
];
const achievements = [
  {
    title: 'LMS Development',
    description: 'Developed and published an LMS serving 3,000+ users, showcasing scalability and user- centric design.',
    icon: Layout
  },
  {
    title: 'E-commerce Solutions',
    description: 'Delivered 8 e-commerce applications, including Flutter and React Native solutions for international clients.',
    icon: Store
  },
  {
    title: 'ERP Management',
    description: 'Led frontend team in developing and designing an ERP management prototype, demonstrating leadership and technical expertise.',
    icon: Users
  },
  {
    title: 'Project Leadership',
    description: 'Currently leading two system management projects for USA-based clients,And delivered a project with 95% success ratio, focusing on scalable and efficient solutions.',
    icon: Trophy
  }
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

  }
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
  role: "Full Stack Developer",
  mission: "To craft elegant solutions to complex problems while continuously learning and growing",
  characteristics: [
    {
      trait: "Problem Solver",
      description: "Thrives on tackling challenging technical puzzles",
      icon: Puzzle
    },
    {
      trait: "Continuous Learner",
      description: "Passionate about staying current with technology",
      icon: Book
    },
    {
      trait: "Team Player",
      description: "Values collaboration and knowledge sharing",
      icon: Heart
    }
  ],
  epics: [
    {
      title: "The Origin Story",
      description: "Started coding journey with a fascination for creating things",
      milestones: [
        "First 'Hello World' at age 16 with python inspired by Automate The Boring Stuff",
        "Built first website watching tutorials on yt",
        "Introduced with freecodecamp and started learning and udemy",

      ],
      icon: Rocket
    },
    {
      title: "The Learning Path",
      description: "Continuous pursuit of knowledge and excellence",
      milestones: [
        "A Selft thought journey started with 3 books",
        "Completed 20+ courses from Udemy, Linkedin, Programming hero",
        "Tought myself system design via books and industry expert developers"
      ],
      icon: Brain
    },
    {
      title: "The Professional Journey",
      description: "Growing through challenges and achievements",
      milestones: [
        "Led multiple successful projects",
        "Mentored junior developers",
        "Diverse Range of projects from basic static sites to erp"
      ],
      icon: Target
    }
  ]
};

const userStories = [
  {
    as: "A Developer",
    want: "To create scalable and maintainable solutions",
    so: "That I can help businesses grow and succeed",
    metrics: ["3+ years experience", "20+ successful projects", "2 Lead Roles"]
  },
  {
    as: "A Team Member",
    want: "To collaborate and share knowledge",
    so: "That the whole team can grow together",
    metrics: ["10+ developers mentored", "15+ code reviews weekly", "Collaboration with other developers"]
  },
  {
    as: "A Tech Enthusiast",
    want: "To stay current with technology trends",
    so: "That I can implement the best solutions",
    metrics: ["Daily learning routine", "Regular blog posts", "Research Papers"]
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
    href: 'https://drive.google.com/file/d/1aDJZf0X53e2rbY8kqUVouQLH01dmeIzI/view?usp=sharing'
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
  }, {
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