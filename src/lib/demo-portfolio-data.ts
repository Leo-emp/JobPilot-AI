/* ============================================================
   DEMO PORTFOLIO DATA
   ============================================================
   Rich sample data for template previews. Covers all 11 section
   types so users can see every section rendered before choosing
   a template. Used by the dashboard preview page.
   ============================================================ */

import type { PortfolioData, PortfolioSection, TemplateName } from "./portfolio-types";

/* # Comprehensive demo sections — realistic content for a senior full-stack engineer persona */
const DEMO_SECTIONS: PortfolioSection[] = [
  /* ---- About ---- */
  {
    type: "about",
    visible: true,
    bio: "Senior Full-Stack Engineer with 8+ years building high-performance web applications and distributed systems. Passionate about developer experience, design systems, and turning complex problems into elegant solutions. Led engineering teams at two YC-backed startups and contributed to open-source projects with 10K+ stars.",
    tagline: "Full-Stack Engineer & Technical Lead",
    avatarUrl: "",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexmorgan",
      github: "https://github.com/alexmorgan",
      twitter: "https://twitter.com/alexmorgan_dev",
    },
  },

  /* ---- Experience ---- */
  {
    type: "experience",
    visible: true,
    entries: [
      {
        title: "Senior Software Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        startDate: "2023",
        endDate: "Present",
        description: "Leading the Payments Infrastructure team building next-gen payment processing APIs.",
        achievements: [
          "Architected a real-time fraud detection pipeline processing 50K+ transactions per second with 99.99% uptime",
          "Reduced API latency by 40% through strategic caching layers and query optimization across 12 microservices",
          "Mentored 6 engineers across 2 teams, establishing code review standards adopted company-wide",
          "Led migration from monolith to event-driven microservices, reducing deployment time from 2 hours to 8 minutes",
        ],
      },
      {
        title: "Staff Engineer",
        company: "Vercel",
        location: "Remote",
        startDate: "2021",
        endDate: "2023",
        description: "Core contributor to the Next.js framework and Vercel's edge infrastructure.",
        achievements: [
          "Shipped incremental static regeneration v2, reducing build times by 60% for enterprise customers",
          "Built the Edge Functions runtime that now powers 200K+ deployments daily",
          "Designed and implemented the preview deployment system used by 50K+ teams globally",
        ],
      },
      {
        title: "Full-Stack Developer",
        company: "Notion",
        location: "San Francisco, CA",
        startDate: "2019",
        endDate: "2021",
        description: "Built collaborative editing features and real-time sync infrastructure.",
        achievements: [
          "Developed the real-time collaboration engine supporting 30M+ concurrent users",
          "Implemented offline-first architecture with CRDT-based conflict resolution",
          "Reduced page load time by 55% through code splitting and lazy loading optimizations",
        ],
      },
      {
        title: "Software Engineer",
        company: "Twilio",
        location: "San Francisco, CA",
        startDate: "2017",
        endDate: "2019",
        description: "Worked on communications APIs and developer SDKs.",
        achievements: [
          "Built the Video SDK used by 10K+ developers, handling 1M+ daily video calls",
          "Created automated testing framework that caught 30% more regressions pre-deployment",
        ],
      },
    ],
  },

  /* ---- Education ---- */
  {
    type: "education",
    visible: true,
    entries: [
      {
        degree: "M.S. Computer Science — Machine Learning",
        school: "Stanford University",
        location: "Stanford, CA",
        startDate: "2015",
        endDate: "2017",
        description: "Thesis on distributed systems optimization. Teaching assistant for CS229 Machine Learning.",
      },
      {
        degree: "B.S. Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2011",
        endDate: "2015",
        description: "Dean's List. President of the Hackathon Club. Undergraduate research in NLP.",
      },
    ],
  },

  /* ---- Skills ---- */
  {
    type: "skills",
    visible: true,
    groups: [
      {
        category: "Programming Languages",
        skills: [
          { name: "TypeScript" }, { name: "Python" }, { name: "Rust" },
          { name: "Go" }, { name: "SQL" }, { name: "Java" },
        ],
      },
      {
        category: "Frontend & Design",
        skills: [
          { name: "React" }, { name: "Next.js" }, { name: "Tailwind CSS" },
          { name: "Framer Motion" }, { name: "Figma" }, { name: "Vue.js" },
        ],
      },
      {
        category: "Backend & Infrastructure",
        skills: [
          { name: "Node.js" }, { name: "Docker" }, { name: "Kubernetes" },
          { name: "AWS" }, { name: "PostgreSQL" }, { name: "Redis" },
        ],
      },
      {
        category: "AI & Machine Learning",
        skills: [
          { name: "PyTorch" }, { name: "LangChain" }, { name: "OpenAI API" },
          { name: "TensorFlow" }, { name: "Prompt Engineering" },
        ],
      },
      {
        category: "Data & Analytics",
        skills: [
          { name: "Pandas" }, { name: "Apache Spark" }, { name: "Tableau" },
          { name: "BigQuery" },
        ],
      },
    ],
  },

  /* ---- Projects ---- */
  {
    type: "projects",
    visible: true,
    entries: [
      {
        title: "Aurora — AI Code Review Platform",
        description: "Open-source AI-powered code review tool that analyzes pull requests for bugs, security vulnerabilities, and performance issues. Integrates with GitHub, GitLab, and Bitbucket. Used by 500+ engineering teams globally.",
        techStack: ["TypeScript", "Next.js", "GPT-4", "PostgreSQL", "Docker"],
        liveUrl: "https://aurora.dev",
        repoUrl: "https://github.com/alexmorgan/aurora",
        imageUrl: "",
        videoUrl: "",
      },
      {
        title: "Velocity — Real-Time Analytics Dashboard",
        description: "High-performance analytics dashboard processing 1M+ events per minute. Features custom visualization engine with WebGL rendering and sub-100ms query times on billion-row datasets.",
        techStack: ["React", "Rust", "ClickHouse", "WebGL", "Redis"],
        liveUrl: "https://velocity.app",
        repoUrl: "https://github.com/alexmorgan/velocity",
        imageUrl: "",
        videoUrl: "",
      },
      {
        title: "Pulse — Developer Productivity Tracker",
        description: "VS Code extension and web dashboard that tracks coding patterns, suggests focus times, and provides team-level productivity insights without surveillance. 20K+ active users.",
        techStack: ["TypeScript", "Svelte", "Go", "SQLite", "Grafana"],
        liveUrl: "https://pulse.dev",
        repoUrl: "https://github.com/alexmorgan/pulse",
        imageUrl: "",
        videoUrl: "",
      },
      {
        title: "NexusDB — Distributed Key-Value Store",
        description: "Raft-based distributed key-value store built from scratch in Rust. Supports linearizable reads, automatic sharding, and sub-millisecond latency. Used as a learning resource by 3K+ developers.",
        techStack: ["Rust", "gRPC", "Raft", "Tokio"],
        liveUrl: "",
        repoUrl: "https://github.com/alexmorgan/nexusdb",
        imageUrl: "",
        videoUrl: "",
      },
    ],
  },

  /* ---- Certifications ---- */
  {
    type: "certifications",
    visible: true,
    entries: [
      { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", date: "2024", link: "" },
      { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", date: "2023", link: "" },
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2023", link: "" },
      { name: "Meta Front-End Developer Certificate", issuer: "Meta / Coursera", date: "2022", link: "" },
    ],
  },

  /* ---- Publications ---- */
  {
    type: "publications",
    visible: true,
    entries: [
      { title: "Optimizing Distributed Consensus for Low-Latency Systems", venue: "ACM SIGOPS Operating Systems Review", date: "2023", link: "" },
      { title: "A Framework for Real-Time Fraud Detection at Scale", venue: "IEEE International Conference on Big Data", date: "2022", link: "" },
      { title: "Incremental Static Regeneration: Architecture and Trade-offs", venue: "Vercel Engineering Blog", date: "2022", link: "" },
    ],
  },

  /* ---- Awards ---- */
  {
    type: "awards",
    visible: true,
    entries: [
      { title: "Engineer of the Year", issuer: "Stripe", date: "2024", description: "Recognized for outstanding technical leadership and impact on the Payments Infrastructure team." },
      { title: "Best Open Source Project", issuer: "GitHub Universe", date: "2023", description: "Aurora code review platform selected from 2,000+ nominations." },
      { title: "40 Under 40 in Tech", issuer: "Forbes", date: "2023", description: "Featured for contributions to open-source developer tooling." },
    ],
  },

  /* ---- Gallery ---- */
  {
    type: "gallery",
    visible: true,
    entries: [
      { title: "Aurora Dashboard", description: "Main analytics view of the Aurora platform", imageUrl: "", videoUrl: "", category: "Product", link: "" },
      { title: "Velocity Visualization", description: "Real-time data visualization with WebGL", imageUrl: "", videoUrl: "", category: "Product", link: "" },
      { title: "Conference Talk — Scale 2024", description: "Keynote on distributed systems at Scale Conference", imageUrl: "", videoUrl: "", category: "Speaking", link: "" },
      { title: "Team Hackathon", description: "Leading the Q3 engineering hackathon at Stripe", imageUrl: "", videoUrl: "", category: "Culture", link: "" },
    ],
  },

  /* ---- Testimonials ---- */
  {
    type: "testimonials",
    visible: true,
    entries: [
      {
        quote: "Alex is one of the most talented engineers I've worked with. Their ability to break down complex distributed systems problems into elegant solutions is remarkable. A true force multiplier for any team.",
        author: "Sarah Chen",
        role: "VP of Engineering",
        company: "Stripe",
      },
      {
        quote: "Working with Alex on the Edge Functions runtime was a masterclass in systems design. They brought both deep technical expertise and an exceptional eye for developer experience.",
        author: "Guillermo Rauch",
        role: "CEO",
        company: "Vercel",
      },
      {
        quote: "Alex transformed our frontend architecture and mentored our junior engineers along the way. The codebase they left behind is a joy to work in — clean, well-tested, and thoroughly documented.",
        author: "James Park",
        role: "Engineering Manager",
        company: "Notion",
      },
    ],
  },

  /* ---- Contact ---- */
  {
    type: "contact",
    visible: true,
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    calendarLink: "https://cal.com/alexmorgan",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexmorgan",
      github: "https://github.com/alexmorgan",
      twitter: "https://twitter.com/alexmorgan_dev",
    },
  },
];

/* # Build a complete PortfolioData object with the given template name */
export function getDemoPortfolioData(template: TemplateName): PortfolioData {
  return {
    id: "demo-preview",
    slug: "demo-preview",
    title: "Alex Morgan",
    tagline: "Full-Stack Engineer & Technical Lead",
    bio: DEMO_SECTIONS.find((s) => s.type === "about")
      ? (DEMO_SECTIONS.find((s) => s.type === "about") as { bio: string }).bio
      : "",
    template,
    themeColors: null,
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexmorgan",
      github: "https://github.com/alexmorgan",
      twitter: "https://twitter.com/alexmorgan_dev",
    },
    avatarUrl: null,
    published: false,
    sections: DEMO_SECTIONS,
    userName: "Alex Morgan",
    userImage: null,
  };
}
