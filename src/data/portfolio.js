/**
 * Single source of truth for portfolio content.
 * Do not add, remove, embellish, or reword facts.
 */

export const isPlaceholder = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

const portfolioData = {
  profile: {
    name: "Md. Yasir Omar Fahim",
    shortName: "Fahim",
    role: "Software Engineer",
    tagline:
      "I build web applications with React on the frontend and Django, FastAPI, Node.js and Go on the backend, and ship them to the cloud.",
    location: null, // PLACEHOLDER: owner will add
    photo: null, // PLACEHOLDER: owner will add /public/profile.jpg
    resumeUrl: "/Resume_Md_Yasir_Omar_Fahim.pdf",
    email: "mdyasirofficial2001@gmail.com",
    phone: "+8801639607507",
    showPhone: false,
    socials: [
      { label: "GitHub", url: "https://github.com/Fahim-2001" },
      { label: "LinkedIn", url: "https://linkedin.com/in/fahim2001" },
    ],
  },

  about: [
    "I'm a Software Engineer currently working remotely as a Jr. Software Engineer at All In One Tech Solutions, an Australia-based technology company, where I work on TradeFlow, a workflow automation platform for international import-export, trading and sourcing businesses.",
    "My work spans ReactJS frontends integrated with Django REST and FastAPI backends, along with post-production work on AWS. Before this, I built a content management system with React, Node.js and PostgreSQL as a contract developer at Prionty Digitals.",
    "I hold a BSc in Computer Science and Engineering and enjoy competitive programming, with 350+ problems solved across online judges.",
  ],

  highlights: [
    { value: "350+", label: "Coding problems solved" },
    { value: "20+", label: "Programming contests" },
    { value: "2.5+", label: "Years of industry experience" },
    { value: "5+", label: "Built production grade softwares" },
  ],

  experience: [
    {
      company: "AIO Tech Solutions",
      role: "Jr. Software Engineer",
      type: "Remote",
      location: "Bankstown, NSW, Sydney, Australia",
      start: "Nov 2024",
      end: "Present",
      points: [
        "Working in a team of 4 on TradeFlow, a business workflow automation platform, focusing on the ReactJS frontend integrated with Django REST APIs.",
        "Handle post-development activities including AWS S3 and EC2 instance management and resolving post-production issues.",
        "Engineered an email automation system during my internship, integrating a ReactJS frontend with FastAPI backend services.",
      ],
      tech: ["ReactJS", "FastAPI", "Django", "PostgreSQL", "AWS"],
    },
    {
      company: "Prionty Digitals",
      role: "Software Developer",
      type: "Remote · Contract",
      location: "Banani, Dhaka, Bangladesh",
      start: "May 2024",
      end: "Oct 2024",
      points: [
        "Helped develop a feature-rich CMS, implementing core functionality with React, Node.js and PostgreSQL.",
        "Developed a server-side image compressor to improve backend efficiency and reduce storage usage.",
        "Configured in-memory caching with Redis, making API responses 2x faster.",
        "Deployed the product to a Hostinger VPS (KVM 2).",
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Redis", "Hostinger VPS"],
    },
  ],

  projects: [
    {
      title: "TradeFlow",
      role: "Frontend Developer",
      stack: ["ReactJS", "Django"],
      summary:
        "A platform built for international import-export, trading and sourcing businesses, with Orders, Buyers, Suppliers, Products, Freights and Accounting management modules.",
      points: [
        "Implemented interactive analytics dashboards, including country-wise buyer and supplier performance charts and trend reports, integrated with Django REST APIs.",
        "Developed reusable components and integrated APIs with frontend caching and lazy loading to improve performance.",
        "Collaborated with 2 backend developers to define API contracts for order management, document optimization and report exports within a 4-member cross-functional team.",
      ],
      liveUrl: "https://tradeflow-booking.vercel.app/",
      image: "/TradeFlow.png",
    },
    {
      title: "Zyxark",
      role: "Team Lead",
      stack: ["ReactJS", "Go (Gin)", "AWS Amplify", "AWS Elastic Beanstalk"],
      summary: "A luxury stays and experiences booking platform.",
      points: [
        "Led a 3-developer team, coordinating work across the React frontend and Go (Gin) backend services.",
        "Architected booking, search and reservation flows through RESTful Go APIs, designed for reliability and scalability under concurrent booking requests.",
        "Manage cloud services through AWS Amplify and Elastic Beanstalk with a CI/CD workflow.",
      ],
      liveUrl: "https://zyxark.com/", 
      image: "/Zyxark.png",
    },
  ],

  skills: [
    {
      group: "Languages",
      items: ["JS", "Node", "Python", "Go"],
    },
    {
      group: "Libraries & Frameworks",
      items: ["ReactJS", "Next.js", "Node.js", "Express.js", "FastAPI", "Gin"],
    },
    {
      group: "Databases",
      items: ["PostgreSQL", "MySQL", "MongoDB"],
    },
    {
      group: "Developer Tools",
      items: ["Git", "Postman", "Docker", "Prisma", "Jira"],
    },
    {
      group: "Cloud & DevOps",
      items: [
        "CI/CD",
        "AWS Elastic Beanstalk",
        "AWS EC2",
        "AWS Amplify",
        "AWS S3",
        "AWS Route53",
        "Hostinger Cloud",
      ],
    },
  ],

  competitiveProgramming: {
    summary:
      "Solved 350+ coding problems and competed in 20+ online and offline contests.",
    profiles: [
      { platform: "CodeChef", maxRating: 1355, url: null }, // PLACEHOLDER profile URL
      { platform: "Codeforces", maxRating: 1022, url: null }, // PLACEHOLDER profile URL
    ],
  },

  education: [
    {
      institution: "University of Information Technology and Sciences",
      degree: "Bachelor of Science in Computer Science and Engineering",
      cgpa: "3.50",
      graduation: "July 2025",
      courses: [
        "Structured Programming Language",
        "Object-Oriented Programming",
        "Data Structures",
        "Algorithms",
        "Database Management Systems",
        "Computer Architecture",
        "Software Project Design and Development",
      ],
    },
  ],

  languages: [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Comfortable" },
  ],
};

export default portfolioData;
