import {
  Book, Brain, Code2, Users, Laptop, Database, Shield, Zap, Coffee, FileUser, Github, Globe, Heart, Layout, Linkedin, Mail, Microscope, Music, Palette, PenTool, Puzzle, Repeat, Rocket, Search, Store, Target, Trophy
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
    keyTechnologies: ['React Js', 'Next js', 'Jotai', 'Django', 'DRF', 'PostgreSQL', 'Django ORM', 'Figma', 'AWS EC2', 'AWS S3', 'Web Socket', 'Multi tenants', 'Micro services', 'Dcoker']
  },
  {
    "company": "Premium Solutions Limited",
    "companyLogo": "https://media.licdn.com/dms/image/v2/C4D0BAQHv__l-6HAS9Q/company-logo_100_100/company-logo_100_100/0/1656110075472",
    "duration": "1 year 5 months",
    "type": "Full-time",
    "location": "Dhaka, Bangladesh · Remote",
    "positions": [
      {
        "title": "Full-stack Developer",
        "duration": "Sep 2023 - Jul 2024",
        "period": "11 months",
        "description": "Over the years, I've had the chance to work on some exciting projects for clients across the Middle East, Europe, Bangladesh, and China. One of the most interesting projects I worked on was a Node.js application integrated with Shopify. I built this system to make life easier for Shopify store owners by automating tasks like finding suppliers, managing shipping, and tracking orders—all from a single admin dashboard. It connected businesses with verified suppliers worldwide and streamlined the entire process, saving a lot of time and effort.\n\nAnother project I'm proud of is a Flutter mobile app I developed for an online fish store in the Middle East. This app made it easy for users to find the fish they needed by category, use advanced search options, and manage their orders without any hassle. It was all about creating a smooth and user-friendly shopping experience.\n\nI've also been part of teams working on multiple B2B e-commerce platforms, building features like product listings, order tracking, and supplier profiles. These projects focused on making business operations simpler and more efficient for clients.\n\nWhat I've learned through these experiences is the importance of delivering solutions that are not just technically sound but also practical and easy to use. I've always prioritized creating scalable and reliable systems while making sure everything is delivered on time. It's been a great journey, and I'm excited to keep building solutions that make a difference!"
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
    keyTechnologies: ['React JS', 'Redux', 'Next Js', 'Node JS', 'Express JS', 'Postgre SQL', 'Socket IO', 'Firebase', 'ERD', 'Jest']

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
    description: 'Delivered 5 e-commerce applications, including Flutter and React Native solutions for international clients.',
    icon: Store
  },
  {
    title: 'ERP Management',
    description: 'Led frontend team in developing and designing an ERP management prototype, demonstrating leadership and technical expertise.',
    icon: Users
  },
  {
    title: 'Project Leadership',
    description: 'Currently leading two system management projects for USA-based clients, focusing on scalable and efficient solutions.',
    icon: Trophy
  }
];
const projects = [
  {
    id: 'lms-platform',
    title: "Learning Management System",
    description: "A comprehensive LMS platform serving 3,000+ users with features like course management, progress tracking, and interactive assessments.",
    image: "/api/placeholder/600/400",
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB'
    ],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Full Stack Application',
    metrics: {
      users: '3,000+',
      satisfaction: '95%',
      performance: '99.9%'
    },
    timeline: '4 months',

  },
  {
    id: 'erp-system',
    title: "Enterprise Resource Planning System",
    description: "A full-featured ERP solution for managing business operations, including inventory, HR, and financial management modules.",
    image: "/api/placeholder/600/400",
    technologies: ['React', 'Redux', 'Express', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Full Stack Application',
    metrics: {
      users: '3,000+',
      satisfaction: '95%',
      performance: '99.9%'
    },
    timeline: '4 months',

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
  {
    href: '/contact',
    label: 'Contact'
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
        "First 'Hello World' at age 12",
        "Built first website for school project",
        "Won regional coding competition"
      ],
      icon: Rocket
    },
    {
      title: "The Learning Path",
      description: "Continuous pursuit of knowledge and excellence",
      milestones: [
        "Computer Science Degree",
        "Multiple tech certifications",
        "Regular conference speaker"
      ],
      icon: Brain
    },
    {
      title: "The Professional Journey",
      description: "Growing through challenges and achievements",
      milestones: [
        "Led multiple successful projects",
        "Mentored junior developers",
        "Contributed to open source"
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
    metrics: ["5+ years experience", "20+ successful projects", "3 tech talks delivered"]
  },
  {
    as: "A Team Member",
    want: "To collaborate and share knowledge",
    so: "That the whole team can grow together",
    metrics: ["10+ developers mentored", "15+ code reviews weekly", "5+ team workshops conducted"]
  },
  {
    as: "A Tech Enthusiast",
    want: "To stay current with technology trends",
    so: "That I can implement the best solutions",
    metrics: ["Daily learning routine", "Regular blog posts", "Open source contributions"]
  }
];

const sprints = [
  {
    title: "Technical Expertise",
    velocity: "High",
    skills: [
      { name: "Frontend Development", level: 90 },
      { name: "Backend Development", level: 85 },
      { name: "DevOps & Cloud", level: 80 }
    ]
  },
  {
    title: "Soft Skills",
    velocity: "Consistent",
    skills: [
      { name: "Team Collaboration", level: 95 },
      { name: "Problem Solving", level: 90 },
      { name: "Communication", level: 85 }
    ]
  }
];
const personalInterests = [
  {
    icon: Coffee,
    title: "Coffee Enthusiast",
    description: "Perfect brew for perfect code"
  },
  {
    icon: Globe,
    title: "World Explorer",
    description: "Discovering new perspectives"
  },
  {
    icon: Music,
    title: "Music Lover",
    description: "Coding with rhythm"
  }
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
    href: ''
  }

];
const lms = {
  id: 'lms-platform',
  title: 'Learning Management System',
  subtitle: 'A comprehensive e-learning platform revolutionizing online education',
  thumbnail: '/api/placeholder/1200/600',
  timeline: '4 months',
  role: 'Lead Developer',
  client: 'EdTech Startup',
  overview: 'Developed a scalable LMS platform that handles 3,000+ concurrent users, featuring real-time analytics, interactive content delivery, and comprehensive progress tracking.',
  challenges: [
    {
      title: 'Scalability',
      description: 'Handling large-scale concurrent user sessions and real-time data updates',
      icon: Users
    },
    {
      title: 'Performance',
      description: 'Optimizing content delivery and reducing loading times across devices',
      icon: Zap
    },
    {
      title: 'Security',
      description: 'Ensuring data privacy and implementing robust authentication',
      icon: Shield
    }
  ],
  solutions: [
    {
      title: 'Microservices Architecture',
      description: 'Implemented a scalable microservices architecture using Node.js and Docker',
      icon: Database,
      details: [
        'Service isolation for better scaling',
        'Load balancing across services',
        'Containerized deployments'
      ]
    },
    {
      title: 'Real-time Features',
      description: 'WebSocket implementation for live updates and progress tracking',
      icon: Laptop,
      details: [
        'Real-time progress updates',
        'Live collaboration features',
        'Instant notifications'
      ]
    },
    {
      title: 'Security Measures',
      description: 'Comprehensive security implementation with multiple layers',
      icon: Shield,
      details: [
        'JWT-based authentication',
        'Role-based access control',
        'Data encryption'
      ]
    }
  ],
  techStack: {
    frontend: ['Next.js', 'TypeScript', 'TailwindCSS', 'Redux Toolkit'],
    backend: ['Node.js', 'Express', 'WebSocket', 'GraphQL'],
    database: ['PostgreSQL', 'Redis', 'MongoDB'],
    devops: ['Docker', 'AWS', 'Github Actions', 'Terraform']
  },
  keyFeatures: [
    'Interactive course content delivery',
    'Real-time progress tracking',
    'Advanced analytics dashboard',
    'Multi-tenant architecture',
    'Automated assessment system',
    'Interactive video lectures'
  ],
  metrics: {
    users: '3,000+',
    satisfaction: '95%',
    performance: '99.9%',
    uptime: '99.99%'
  },
  developmentPhases: [
    {
      title: 'Discovery & Planning',
      duration: '2 weeks',
      activities: [
        'Requirement analysis and documentation',
        'System architecture design',
        'Technology stack selection',
        'Sprint planning and story pointing'
      ]
    },
    {
      title: 'Development',
      duration: '12 weeks',
      activities: [
        'Frontend development with Next.js',
        'Backend API development',
        'Database schema design',
        'Real-time features implementation'
      ]
    },
    {
      title: 'Testing & Optimization',
      duration: '2 weeks',
      activities: [
        'Performance testing and optimization',
        'Security testing and auditing',
        'User acceptance testing',
        'Load testing and scaling'
      ]
    }
  ],
  results: [
    {
      metric: 'User Engagement',
      value: '300%',
      description: 'Increase in average user session duration'
    },
    {
      metric: 'Course Completion',
      value: '50%',
      description: 'Reduction in average course completion time'
    },
    {
      metric: 'System Performance',
      value: '99.9%',
      description: 'Uptime with sub-second response times'
    }
  ],
  testimonial: {
    quote: "The platform has transformed how we deliver educational content to our users. The performance and user experience are exceptional.",
    author: "Sarah Johnson",
    role: "CEO, EdTech Startup"
  }
};
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
  sprints,
  userStories,
  persona,
  personalInterests,
  codeSnippets,
  geistSans,
  geistMono,
  lms as project,
  socialLinks
}