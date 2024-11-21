import { Code2, Database, Laptop, Layout, Microscope, Palette, PenTool, Repeat, Rocket, Search, Store, Trophy, Users } from "lucide-react";

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
    title: "Project Manager",
    company: "Masleap Plc",
    period: "August 2024 - Present",
    responsibilities: [
      "Leading two system management projects for USA-based clients",
      "Designing ERDs and system architecture for scalable solutions",
      "Mentoring junior developers and conducting Scrum ceremonies",
      "Creating Low-Level and High-Level Designs for efficient development"
    ]
  },
  {
    title: "Software Engineer",
    company: "TNC Global Limited",
    period: "November 2023 - July 2024",
    responsibilities: [
      "Led frontend team in developing ERP management prototype",
      "Developed and maintained applications using React JS and Next.js",
      "Deployed applications to AWS EC2 for scalable cloud solutions",
      "Mentored junior developers and resolved complex UI challenges"
    ]
  },
  {
    title: "Front-End Developer",
    company: "Premium Solutions Limited",
    period: "March 2023 - June 2024",
    responsibilities: [
      "Implemented frontend for 5 e-commerce projects",
      "Developed using Flutter, Vue.js, and Next.js for diverse client needs",
      "Specialized in responsive and user-friendly interfaces",
      "Integrated frontend with backend APIs for seamless functionality"
    ]
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
export {
  developmentProcess,
  achievements,
  experiences,
  projects,
  services,
  tags,
  skills,
  categories
}