/* ============================================================
   DEMO PORTFOLIO DATA — Per-Template Personas
   ============================================================
   Each template gets a unique professional persona with
   industry-relevant demo data. Gallery/project images use
   copyright-free Unsplash URLs via their free CDN.
   ============================================================ */

import type { PortfolioData, PortfolioSection, TemplateName } from "./portfolio-types";

/* # Unsplash copyright-free image URLs (free to use, no attribution required in apps) */
const img = {
  /* # Developer / Tech */
  code1: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  code2: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  code3: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  terminal: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
  /* # Design / Creative */
  design1: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  design2: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  design3: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
  branding: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80",
  /* # Corporate / Business */
  office1: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  meeting: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  strategy: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  /* # Photography */
  landscape1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  landscape2: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  portrait1: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
  street1: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
  street2: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
  nature1: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
  astro1: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
  wildlife1: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80",
  /* # Architecture */
  arch1: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
  arch2: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80",
  arch3: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
  arch4: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  interior1: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  interior2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  /* # Video / Film */
  film1: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  film2: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
  film3: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80",
  drone1: "https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&q=80",
  /* # Modern / SaaS */
  dashboard1: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  app1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  /* # Academic */
  lab1: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  research1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
};

/* # Copyright-free video URLs from Pexels (embed-friendly) */
const vid = {
  city: "https://player.vimeo.com/video/194276412",
  nature: "https://player.vimeo.com/video/245040289",
  drone: "https://player.vimeo.com/video/301316754",
  wedding: "https://player.vimeo.com/video/182773160",
};

/* ================================================================
   TEMPLATE-SPECIFIC DEMO DATA GENERATORS
   ================================================================ */

/* # 1. MINIMAL — UX/Product Designer */
function minimalSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Product Designer with 7 years crafting intuitive digital experiences for millions of users. I believe great design is invisible — it solves problems before people know they exist. Specializing in design systems, interaction design, and user research that drives measurable business outcomes.",
      tagline: "Product Designer & Design Systems Lead",
      avatarUrl: "", socialLinks: { linkedin: "https://linkedin.com/in/example", dribbble: "https://dribbble.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Senior Product Designer", company: "Airbnb", location: "San Francisco, CA", startDate: "2022", endDate: "Present", description: "Lead designer for the Trips experience team.", achievements: ["Redesigned the booking flow, increasing conversion by 23% across mobile and web", "Built and maintained the Airbnb Design Language System used by 40+ designers", "Led user research studies across 12 markets to inform the Experiences redesign", "Mentored 4 junior designers through Airbnb's design fellowship program"] },
        { title: "Product Designer", company: "Figma", location: "San Francisco, CA", startDate: "2020", endDate: "2022", description: "Designed core editing and collaboration features.", achievements: ["Shipped auto-layout v2, the most requested feature with 500K+ daily users", "Designed the commenting system that reduced design review cycles by 40%", "Created prototyping interaction patterns now used as industry standard"] },
        { title: "UX Designer", company: "Spotify", location: "Stockholm, Sweden", startDate: "2017", endDate: "2020", description: "Designed personalization and discovery features.", achievements: ["Led the Discover Weekly redesign that increased playlist saves by 35%", "Designed the collaborative playlist experience used by 20M+ users", "Established accessibility guidelines adopted across all mobile surfaces"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.F.A. Interaction Design", school: "School of Visual Arts", location: "New York, NY", startDate: "2015", endDate: "2017", description: "Thesis on emotionally responsive interfaces. IxDA Student Award Winner." },
        { degree: "B.A. Graphic Design", school: "Rhode Island School of Design", location: "Providence, RI", startDate: "2011", endDate: "2015", description: "Minor in Computer Science. Senior project selected for RISD Museum exhibition." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Design Tools", skills: [{ name: "Figma" }, { name: "Sketch" }, { name: "Adobe Creative Suite" }, { name: "Framer" }, { name: "Principle" }] },
        { category: "UX Research", skills: [{ name: "User Interviews" }, { name: "Usability Testing" }, { name: "A/B Testing" }, { name: "Journey Mapping" }, { name: "Card Sorting" }] },
        { category: "Frontend", skills: [{ name: "HTML/CSS" }, { name: "React" }, { name: "Tailwind CSS" }, { name: "Framer Motion" }] },
        { category: "Strategy", skills: [{ name: "Design Systems" }, { name: "Design Thinking" }, { name: "Accessibility (WCAG)" }, { name: "Design Ops" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Harmony Design System", description: "A comprehensive design system with 200+ components, accessibility-first tokens, and automated documentation. Powers 8 products across the organization.", techStack: ["Figma", "React", "Storybook", "Tailwind"], liveUrl: "", repoUrl: "", imageUrl: img.design1, videoUrl: "" },
        { title: "MindfulApp — Meditation Redesign", description: "Complete UX redesign of a meditation app that increased daily active users by 45% and session duration by 60%. Featured on the App Store.", techStack: ["Figma", "Principle", "User Research"], liveUrl: "", repoUrl: "", imageUrl: img.design2, videoUrl: "" },
        { title: "FinFlow — Banking Dashboard", description: "Enterprise banking dashboard designed for financial advisors. Simplified complex data into actionable insights, reducing task completion time by 50%.", techStack: ["Figma", "D3.js", "Accessibility"], liveUrl: "", repoUrl: "", imageUrl: img.design3, videoUrl: "" },
      ],
    },
    {
      type: "certifications", visible: true,
      entries: [
        { name: "Google UX Design Professional Certificate", issuer: "Google", date: "2023", link: "" },
        { name: "Certified Accessibility Specialist (CPAC)", issuer: "IAAP", date: "2022", link: "" },
        { name: "Design Thinking Certification", issuer: "IDEO", date: "2021", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "Red Dot Design Award — Best of the Best", issuer: "Red Dot", date: "2024", description: "Harmony Design System recognized for outstanding design quality." },
        { title: "Webby Award — Best User Interface", issuer: "The Webby Awards", date: "2023", description: "Airbnb Trips experience redesign." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "An exceptional design thinker who brings both empathy and rigor to every project. Their design system work set a new bar for our entire organization.", author: "Lisa Wang", role: "VP of Design", company: "Airbnb" },
        { quote: "The rare designer who can go from user research to pixel-perfect prototypes to front-end code. A true full-stack designer.", author: "Dylan Field", role: "Co-Founder", company: "Figma" },
        { quote: "Their redesign of Discover Weekly wasn't just beautiful — it fundamentally changed how our users engage with music.", author: "Anna Nilsson", role: "Product Lead", company: "Spotify" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "hello@example.com", phone: "+1 (555) 234-5678", location: "San Francisco, CA",
      calendarLink: "https://cal.com/example", socialLinks: { linkedin: "https://linkedin.com/in/example", dribbble: "https://dribbble.com/example" },
    },
  ];
}

/* # 2. DEVELOPER — Full-Stack Software Engineer */
function developerSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Senior Full-Stack Engineer with 8+ years building high-performance web applications and distributed systems. Passionate about developer experience, design systems, and turning complex problems into elegant solutions. Led engineering teams at two YC-backed startups and contributed to open-source projects with 10K+ stars.",
      tagline: "Full-Stack Engineer & Open Source Contributor",
      avatarUrl: "", socialLinks: { github: "https://github.com/example", linkedin: "https://linkedin.com/in/example", twitter: "https://twitter.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Senior Software Engineer", company: "Stripe", location: "San Francisco, CA", startDate: "2023", endDate: "Present", description: "Payments Infrastructure team.", achievements: ["Architected a real-time fraud detection pipeline processing 50K+ transactions/sec with 99.99% uptime", "Reduced API latency by 40% through strategic caching and query optimization across 12 microservices", "Led migration from monolith to event-driven microservices, reducing deploy time from 2hrs to 8min", "Mentored 6 engineers, establishing code review standards adopted company-wide"] },
        { title: "Staff Engineer", company: "Vercel", location: "Remote", startDate: "2021", endDate: "2023", description: "Next.js framework and edge infrastructure.", achievements: ["Shipped incremental static regeneration v2, reducing build times by 60% for enterprise customers", "Built the Edge Functions runtime powering 200K+ deployments daily", "Designed preview deployment system used by 50K+ teams globally"] },
        { title: "Full-Stack Developer", company: "Notion", location: "San Francisco, CA", startDate: "2019", endDate: "2021", description: "Collaborative editing and real-time sync.", achievements: ["Built real-time collaboration engine supporting 30M+ concurrent users", "Implemented offline-first architecture with CRDT-based conflict resolution"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.S. Computer Science — Distributed Systems", school: "Stanford University", location: "Stanford, CA", startDate: "2015", endDate: "2017", description: "Thesis on consensus algorithms. TA for CS229 Machine Learning." },
        { degree: "B.S. Computer Science", school: "UC Berkeley", location: "Berkeley, CA", startDate: "2011", endDate: "2015", description: "Dean's List. President of Hackathon Club." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Programming Languages", skills: [{ name: "TypeScript" }, { name: "Python" }, { name: "Rust" }, { name: "Go" }, { name: "SQL" }] },
        { category: "Frontend & Design", skills: [{ name: "React" }, { name: "Next.js" }, { name: "Tailwind CSS" }, { name: "Framer Motion" }, { name: "Vue.js" }] },
        { category: "Backend & Infrastructure", skills: [{ name: "Node.js" }, { name: "Docker" }, { name: "Kubernetes" }, { name: "AWS" }, { name: "PostgreSQL" }, { name: "Redis" }] },
        { category: "AI & Machine Learning", skills: [{ name: "PyTorch" }, { name: "LangChain" }, { name: "OpenAI API" }, { name: "TensorFlow" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Aurora — AI Code Review Platform", description: "Open-source AI-powered code review tool analyzing PRs for bugs, security vulnerabilities, and performance issues. Used by 500+ engineering teams.", techStack: ["TypeScript", "Next.js", "GPT-4", "PostgreSQL"], liveUrl: "", repoUrl: "", imageUrl: img.code1, videoUrl: "" },
        { title: "Velocity — Real-Time Analytics", description: "High-performance dashboard processing 1M+ events/min with WebGL rendering and sub-100ms queries on billion-row datasets.", techStack: ["React", "Rust", "ClickHouse", "WebGL"], liveUrl: "", repoUrl: "", imageUrl: img.dashboard1, videoUrl: "" },
        { title: "NexusDB — Distributed KV Store", description: "Raft-based distributed key-value store built from scratch. Linearizable reads, auto-sharding, sub-ms latency.", techStack: ["Rust", "gRPC", "Raft", "Tokio"], liveUrl: "", repoUrl: "", imageUrl: img.terminal, videoUrl: "" },
      ],
    },
    {
      type: "certifications", visible: true,
      entries: [
        { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", date: "2024", link: "" },
        { name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2023", link: "" },
        { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", date: "2023", link: "" },
      ],
    },
    {
      type: "publications", visible: true,
      entries: [
        { title: "Optimizing Distributed Consensus for Low-Latency Systems", venue: "ACM SIGOPS Operating Systems Review", date: "2023", link: "" },
        { title: "A Framework for Real-Time Fraud Detection at Scale", venue: "IEEE International Conference on Big Data", date: "2022", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "Engineer of the Year", issuer: "Stripe", date: "2024", description: "Recognized for outstanding technical leadership." },
        { title: "Best Open Source Project", issuer: "GitHub Universe", date: "2023", description: "Aurora code review platform selected from 2,000+ nominations." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "One of the most talented engineers I've worked with. Their ability to break down complex distributed systems problems into elegant solutions is remarkable.", author: "Sarah Chen", role: "VP of Engineering", company: "Stripe" },
        { quote: "A masterclass in systems design. Deep technical expertise and exceptional developer experience instincts.", author: "Guillermo Rauch", role: "CEO", company: "Vercel" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "dev@example.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA",
      calendarLink: "https://cal.com/example", socialLinks: { github: "https://github.com/example", linkedin: "https://linkedin.com/in/example" },
    },
  ];
}

/* # 3. CREATIVE — Brand & Visual Designer */
function creativeSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Award-winning Creative Director blending bold visual storytelling with strategic brand thinking. From Nike campaigns to indie startups, I create identities that resonate, provoke, and endure. My work lives at the intersection of art direction, motion design, and brand strategy.",
      tagline: "Creative Director & Brand Strategist",
      avatarUrl: "", socialLinks: { instagram: "https://instagram.com/example", behance: "https://behance.net/example", dribbble: "https://dribbble.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Creative Director", company: "Pentagram", location: "New York, NY", startDate: "2022", endDate: "Present", description: "Leading brand identity and campaign work for global clients.", achievements: ["Directed the rebrand for a Fortune 500 tech company, increasing brand recognition by 40%", "Won 3 D&AD Pencils and 2 Cannes Lions in a single award season", "Built and led a team of 12 designers, animators, and strategists", "Launched a design-for-good initiative creating pro-bono work for 5 nonprofits"] },
        { title: "Senior Art Director", company: "Wieden+Kennedy", location: "Portland, OR", startDate: "2019", endDate: "2022", description: "Art direction for Nike and other global brands.", achievements: ["Led art direction for Nike's 'Move to Zero' sustainability campaign", "Created visual identity systems adopted across 30+ global markets", "Directed 15+ commercial shoots and motion design projects"] },
        { title: "Visual Designer", company: "Spotify", location: "Stockholm, Sweden", startDate: "2017", endDate: "2019", description: "Visual design for marketing campaigns and brand experiences.", achievements: ["Designed Spotify Wrapped 2018, seen by 100M+ users worldwide", "Created the visual system for Spotify's podcast launch campaign"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.F.A. Graphic Design", school: "Yale School of Art", location: "New Haven, CT", startDate: "2015", endDate: "2017", description: "Graduate thesis on kinetic typography and emotional design." },
        { degree: "B.F.A. Visual Communication", school: "Parsons School of Design", location: "New York, NY", startDate: "2011", endDate: "2015", description: "Study abroad at Central Saint Martins, London." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Design & Art Direction", skills: [{ name: "Brand Identity" }, { name: "Art Direction" }, { name: "Typography" }, { name: "Layout Design" }, { name: "Color Theory" }] },
        { category: "Motion & 3D", skills: [{ name: "After Effects" }, { name: "Cinema 4D" }, { name: "Blender" }, { name: "Lottie" }] },
        { category: "Tools", skills: [{ name: "Figma" }, { name: "Photoshop" }, { name: "Illustrator" }, { name: "InDesign" }, { name: "Premiere Pro" }] },
        { category: "Strategy", skills: [{ name: "Brand Strategy" }, { name: "Campaign Planning" }, { name: "Creative Direction" }, { name: "Client Presentation" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Solaris — Brand Identity", description: "Complete brand identity for a climate tech startup including logo, type system, color palette, motion guidelines, and 200-page brand book.", techStack: ["Figma", "Illustrator", "After Effects"], liveUrl: "", repoUrl: "", imageUrl: img.branding, videoUrl: "" },
        { title: "Neon Nights — Exhibition Design", description: "Immersive multimedia exhibition at the MoMA Design Store exploring light, color, and digital art. 50,000+ visitors in 3 months.", techStack: ["Cinema 4D", "TouchDesigner", "Projection Mapping"], liveUrl: "", repoUrl: "", imageUrl: img.design1, videoUrl: "" },
        { title: "Typeform Rebrand", description: "Led the visual rebrand including new logo, illustration system, motion language, and marketing site redesign. 60% increase in brand recall.", techStack: ["Figma", "After Effects", "Webflow"], liveUrl: "", repoUrl: "", imageUrl: img.design3, videoUrl: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "D&AD Yellow Pencil — Branding", issuer: "D&AD", date: "2024", description: "Solaris brand identity system." },
        { title: "Cannes Lions Gold — Design", issuer: "Cannes Lions", date: "2023", description: "Nike 'Move to Zero' campaign visual identity." },
        { title: "Type Directors Club Award", issuer: "TDC", date: "2022", description: "Custom typeface design for Spotify Podcasts." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "A visionary creative who pushes boundaries while staying deeply rooted in strategic thinking. Every project becomes a defining moment for the brand.", author: "Paula Scher", role: "Partner", company: "Pentagram" },
        { quote: "Their art direction elevated our entire campaign. Bold, surprising, and unmistakably on-brand.", author: "Mark Thompson", role: "Global Brand Director", company: "Nike" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "studio@example.com", phone: "+1 (555) 345-6789", location: "New York, NY",
      calendarLink: "", socialLinks: { instagram: "https://instagram.com/example", behance: "https://behance.net/example" },
    },
  ];
}

/* # 4. CORPORATE — Management Consultant / Executive */
function corporateSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Senior Partner at a leading management consultancy with 15+ years driving transformational strategy for Fortune 500 companies. Expertise in digital transformation, M&A integration, and operational excellence. Board advisor to three public companies and published thought leader on organizational resilience.",
      tagline: "Senior Partner — Strategy & Transformation",
      avatarUrl: "", socialLinks: { linkedin: "https://linkedin.com/in/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Senior Partner", company: "McKinsey & Company", location: "London, UK", startDate: "2020", endDate: "Present", description: "Leading the Digital & Analytics Practice for EMEA.", achievements: ["Led $2B+ digital transformation for a top-5 European bank, delivering 35% cost reduction", "Built and scaled a 60-person practice from greenfield to $120M annual revenue", "Advised 3 FTSE 100 boards on AI strategy and organizational readiness", "Published 12 articles in Harvard Business Review and McKinsey Quarterly"] },
        { title: "Partner", company: "Bain & Company", location: "New York, NY", startDate: "2016", endDate: "2020", description: "M&A and post-merger integration practice.", achievements: ["Managed due diligence for 8 acquisitions totaling $15B+ in deal value", "Developed integration playbook now used as firm-wide standard", "Named to Consulting Magazine's 'Top 25 Consultants' list"] },
        { title: "Engagement Manager", company: "McKinsey & Company", location: "Chicago, IL", startDate: "2011", endDate: "2016", description: "Operations and supply chain transformation.", achievements: ["Delivered $500M+ in operational savings across 6 client engagements", "Led cross-functional teams of 15-20 consultants across 4 continents"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "MBA — Baker Scholar (Top 5%)", school: "Harvard Business School", location: "Boston, MA", startDate: "2009", endDate: "2011", description: "Concentrated in Strategy and Finance. Case competition winner." },
        { degree: "B.A. Economics (First Class Honours)", school: "University of Oxford", location: "Oxford, UK", startDate: "2005", endDate: "2009", description: "President of the Economics Society. Awarded the Gibbs Prize." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Strategy", skills: [{ name: "Digital Transformation" }, { name: "M&A Strategy" }, { name: "Market Entry" }, { name: "Competitive Analysis" }, { name: "Growth Strategy" }] },
        { category: "Leadership", skills: [{ name: "Executive Advisory" }, { name: "Board Governance" }, { name: "Change Management" }, { name: "P&L Management" }, { name: "Team Building" }] },
        { category: "Analytics", skills: [{ name: "Financial Modeling" }, { name: "Data Analytics" }, { name: "AI Strategy" }, { name: "Scenario Planning" }] },
        { category: "Industry Expertise", skills: [{ name: "Financial Services" }, { name: "Healthcare" }, { name: "Technology" }, { name: "Private Equity" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "European Bank Digital Transformation", description: "Led the largest digital transformation in European banking — 5-year program across 12 countries, 40,000 employees. Delivered new mobile platform, AI-powered risk models, and 35% cost reduction.", techStack: ["Strategy", "AI", "Change Management"], liveUrl: "", repoUrl: "", imageUrl: img.office1, videoUrl: "" },
        { title: "Global Pharma M&A Integration", description: "Managed post-merger integration of two top-20 pharmaceutical companies. $8B deal, 60,000 employees, completed 6 months ahead of schedule.", techStack: ["M&A", "PMI", "Operations"], liveUrl: "", repoUrl: "", imageUrl: img.meeting, videoUrl: "" },
      ],
    },
    {
      type: "publications", visible: true,
      entries: [
        { title: "The Resilient Organization: Leading Through Uncertainty", venue: "Harvard Business Review", date: "2024", link: "" },
        { title: "AI at the Boardroom Table: A Director's Guide", venue: "McKinsey Quarterly", date: "2023", link: "" },
        { title: "Post-Merger Integration: The First 100 Days", venue: "Bain Insights", date: "2021", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "Top 25 Consultants", issuer: "Consulting Magazine", date: "2023", description: "Recognized for exceptional client impact and practice leadership." },
        { title: "Digital Transformation Leader of the Year", issuer: "Financial Times", date: "2022", description: "For the European bank digital program." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "A rare strategic mind who combines rigorous analysis with genuine leadership presence. Their work transformed not just our operations, but our culture.", author: "Sir James Thornton", role: "CEO", company: "Barclays" },
        { quote: "The most impactful advisor I've worked with in 20 years. They don't just give recommendations — they build the organizational capability to execute.", author: "Maria Rodriguez", role: "Board Chair", company: "Novartis" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "partner@example.com", phone: "+44 20 7946 0958", location: "London, UK",
      calendarLink: "", socialLinks: { linkedin: "https://linkedin.com/in/example" },
    },
  ];
}

/* # 5. ACADEMIC — Research Professor */
function academicSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Associate Professor of Computational Neuroscience at MIT, directing the Neural Dynamics Lab. My research bridges machine learning and neuroscience to understand how the brain processes information. PI on $4M+ in NIH and NSF grants. 45+ peer-reviewed publications with 3,000+ citations.",
      tagline: "Associate Professor — Computational Neuroscience",
      avatarUrl: "", socialLinks: { linkedin: "https://linkedin.com/in/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Associate Professor", company: "MIT — Brain & Cognitive Sciences", location: "Cambridge, MA", startDate: "2020", endDate: "Present", description: "Director of the Neural Dynamics Lab.", achievements: ["PI on 3 active NIH R01 grants totaling $4.2M", "Published 18 papers in Nature Neuroscience, Science, and PNAS", "Supervising 6 PhD students and 3 postdoctoral researchers", "Developed novel neural decoding algorithms with 95% accuracy"] },
        { title: "Assistant Professor", company: "Stanford University", location: "Stanford, CA", startDate: "2016", endDate: "2020", description: "Department of Bioengineering.", achievements: ["Received NSF CAREER Award for early-career research excellence", "Established computational neuroscience curriculum adopted by 8 universities", "Published foundational work on attention mechanisms in biological neural networks"] },
        { title: "Postdoctoral Fellow", company: "Harvard Medical School", location: "Boston, MA", startDate: "2014", endDate: "2016", description: "Neurobiology department, studying sensory processing.", achievements: ["First-author paper in Nature selected as 'Article of the Year'", "Developed open-source neural imaging pipeline used by 200+ labs worldwide"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "Ph.D. Computational Neuroscience", school: "University College London", location: "London, UK", startDate: "2010", endDate: "2014", description: "Gatsby Computational Neuroscience Unit. Thesis: 'Bayesian Models of Sensory Integration in Cortical Circuits'. Advisor: Prof. Peter Dayan." },
        { degree: "B.Sc. Mathematics & Physics (First Class)", school: "Imperial College London", location: "London, UK", startDate: "2006", endDate: "2010", description: "Awarded the Governor's Medal for academic excellence." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Research Methods", skills: [{ name: "Computational Modeling" }, { name: "Statistical Analysis" }, { name: "Experimental Design" }, { name: "Neural Imaging (fMRI, EEG)" }] },
        { category: "Programming", skills: [{ name: "Python" }, { name: "MATLAB" }, { name: "R" }, { name: "Julia" }, { name: "C++" }] },
        { category: "Machine Learning", skills: [{ name: "Deep Learning" }, { name: "Bayesian Inference" }, { name: "Reinforcement Learning" }, { name: "Neural Network Architecture" }] },
        { category: "Academic", skills: [{ name: "Grant Writing" }, { name: "Peer Review" }, { name: "Curriculum Development" }, { name: "PhD Supervision" }] },
      ],
    },
    {
      type: "publications", visible: true,
      entries: [
        { title: "Attention as Bayesian Inference in Hierarchical Cortical Circuits", venue: "Nature Neuroscience", date: "2024", link: "" },
        { title: "Real-Time Neural Decoding Using Transformer Architectures", venue: "Science", date: "2023", link: "" },
        { title: "A Unified Framework for Sensory Integration and Decision Making", venue: "PNAS", date: "2022", link: "" },
        { title: "Biologically Plausible Backpropagation in Deep Neural Networks", venue: "NeurIPS (Spotlight)", date: "2022", link: "" },
        { title: "The Geometry of Neural Population Codes", venue: "Nature Methods", date: "2021", link: "" },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "NeuroPy — Open Source Neural Analysis Toolkit", description: "Python library for neural data analysis used by 200+ research labs. 2,500+ GitHub stars. Includes spike sorting, population decoding, and connectivity analysis.", techStack: ["Python", "NumPy", "SciPy", "GPU Computing"], liveUrl: "", repoUrl: "", imageUrl: img.lab1, videoUrl: "" },
        { title: "BrainBridge — Neural Prosthetics Interface", description: "Real-time brain-computer interface achieving 95% accuracy in motor intention decoding. NIH-funded project in collaboration with MGH.", techStack: ["Python", "C++", "TensorFlow", "Real-Time Systems"], liveUrl: "", repoUrl: "", imageUrl: img.research1, videoUrl: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "NSF CAREER Award", issuer: "National Science Foundation", date: "2019", description: "Five-year award for research on computational models of attention." },
        { title: "McKnight Scholar Award", issuer: "McKnight Foundation", date: "2021", description: "Recognizing innovative neuroscience research." },
        { title: "Nature Article of the Year", issuer: "Nature Publishing Group", date: "2015", description: "For work on sensory integration in cortical circuits." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "A brilliantly creative scientist whose work is reshaping our understanding of neural computation. Their mentorship has launched a generation of computational neuroscientists.", author: "Prof. Peter Dayan", role: "Director", company: "Max Planck Institute" },
        { quote: "The rare researcher who makes fundamental contributions to both neuroscience and AI simultaneously.", author: "Prof. Yoshua Bengio", role: "Professor", company: "Mila / Université de Montréal" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "professor@example.edu", phone: "+1 (617) 555-0142", location: "Cambridge, MA",
      calendarLink: "", socialLinks: { linkedin: "https://linkedin.com/in/example" },
    },
  ];
}

/* # 6. MODERN — Product Manager / Startup Founder */
function modernSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Product leader and startup founder obsessed with building tools that make developers more productive. Took two products from 0 to 1M users. Currently building the future of AI-powered development at a Series B startup. Previously PM at GitHub and Google.",
      tagline: "Product Leader & Startup Founder",
      avatarUrl: "", socialLinks: { linkedin: "https://linkedin.com/in/example", twitter: "https://twitter.com/example", github: "https://github.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Co-Founder & CPO", company: "DevFlow AI", location: "San Francisco, CA", startDate: "2023", endDate: "Present", description: "AI-powered developer productivity platform.", achievements: ["Raised $18M Series A from a16z and Sequoia", "Grew from 0 to 50K developers in 10 months", "Built and led product team of 15 across 3 continents", "Achieved 85% week-over-week retention — top 1% for dev tools"] },
        { title: "Senior Product Manager", company: "GitHub", location: "Remote", startDate: "2020", endDate: "2023", description: "Led GitHub Copilot and code review products.", achievements: ["Launched Copilot to 1M+ users in the first year, GitHub's fastest-growing product", "Redesigned code review workflow, reducing review time by 30%", "Managed $50M+ annual product line with 20-person cross-functional team"] },
        { title: "Product Manager", company: "Google", location: "Mountain View, CA", startDate: "2018", endDate: "2020", description: "Cloud developer tools and APIs.", achievements: ["Shipped Cloud Run, growing to 100K+ active projects within 18 months", "Led developer experience research across 15 markets"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "MBA — Arjay Miller Scholar", school: "Stanford GSB", location: "Stanford, CA", startDate: "2016", endDate: "2018", description: "Concentrated in Entrepreneurship and Technology. Startup Garage alum." },
        { degree: "B.S. Computer Science & Economics", school: "MIT", location: "Cambridge, MA", startDate: "2012", endDate: "2016", description: "Published in MIT Technology Review. MIT $100K finalist." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Product", skills: [{ name: "Product Strategy" }, { name: "Roadmap Planning" }, { name: "A/B Testing" }, { name: "User Research" }, { name: "PRDs" }] },
        { category: "Technical", skills: [{ name: "Python" }, { name: "TypeScript" }, { name: "SQL" }, { name: "System Design" }, { name: "API Design" }] },
        { category: "AI & ML", skills: [{ name: "LLM Product Design" }, { name: "Prompt Engineering" }, { name: "AI Safety" }, { name: "MLOps" }] },
        { category: "Growth", skills: [{ name: "PLG Strategy" }, { name: "Metrics & Analytics" }, { name: "Pricing" }, { name: "Go-to-Market" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "DevFlow AI — Developer Productivity Platform", description: "AI agent that automates code reviews, generates tests, and manages technical debt. 50K developers, $18M raised, backed by a16z.", techStack: ["Next.js", "Python", "GPT-4", "PostgreSQL"], liveUrl: "", repoUrl: "", imageUrl: img.app1, videoUrl: "" },
        { title: "GitHub Copilot Launch", description: "Led product strategy and launch of GitHub's AI pair programmer. Fastest product to 1M users in GitHub history.", techStack: ["Product Strategy", "AI/ML", "Developer Experience"], liveUrl: "", repoUrl: "", imageUrl: img.code2, videoUrl: "" },
        { title: "Open Source: DevMetrics", description: "CLI tool for engineering teams to track DORA metrics. 8K GitHub stars, used by 500+ companies.", techStack: ["Go", "GraphQL", "GitHub API"], liveUrl: "", repoUrl: "", imageUrl: img.code3, videoUrl: "" },
      ],
    },
    {
      type: "certifications", visible: true,
      entries: [
        { name: "Reforge Growth Series", issuer: "Reforge", date: "2023", link: "" },
        { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "2022", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "Forbes 30 Under 30 — Enterprise Tech", issuer: "Forbes", date: "2024", description: "For building DevFlow AI." },
        { title: "Product Hunt #1 Product of the Day", issuer: "Product Hunt", date: "2023", description: "DevFlow AI launch — 3,000+ upvotes." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "The best product mind I've encountered. They have an uncanny ability to find the intersection of what's technically possible, what users need, and what the business requires.", author: "Thomas Dohmke", role: "CEO", company: "GitHub" },
        { quote: "A rare founder who combines deep technical knowledge with exceptional product taste. DevFlow is the future.", author: "Andrew Chen", role: "General Partner", company: "a16z" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "founder@example.com", phone: "+1 (555) 456-7890", location: "San Francisco, CA",
      calendarLink: "https://cal.com/example", socialLinks: { linkedin: "https://linkedin.com/in/example", twitter: "https://twitter.com/example" },
    },
  ];
}

/* # 7. VIDEOGRAPHER — Filmmaker & Cinematographer */
function videographerSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Award-winning cinematographer and filmmaker with 10+ years creating cinematic stories that move audiences. From documentary features to commercial campaigns for brands like Apple and Mercedes-Benz, I bring a distinctive visual voice to every frame. Sundance selected. Emmy nominated.",
      tagline: "Cinematographer & Documentary Filmmaker",
      avatarUrl: "", socialLinks: { instagram: "https://instagram.com/example", vimeo: "https://vimeo.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Director of Photography", company: "Freelance / Studio Lumière", location: "Los Angeles, CA", startDate: "2020", endDate: "Present", description: "Running an independent production studio.", achievements: ["Shot 3 feature-length documentaries, including Sundance 2024 Official Selection", "Directed commercial campaigns for Apple, Mercedes-Benz, and Patagonia", "Built a client roster of 40+ brands with 100% repeat engagement rate", "Emmy nomination for Outstanding Cinematography — Documentary"] },
        { title: "Senior Cinematographer", company: "National Geographic", location: "Washington, D.C.", startDate: "2017", endDate: "2020", description: "Shooting documentary content worldwide.", achievements: ["Shot in 25+ countries across 6 continents for NatGeo documentary series", "Captured footage featured in 'Our Planet' and 'One Strange Rock'", "Developed underwater cinematography techniques adopted by the team"] },
        { title: "Camera Operator / DP", company: "Vice Media", location: "Brooklyn, NY", startDate: "2014", endDate: "2017", description: "Documentary and branded content.", achievements: ["Shot 50+ short-form documentaries across conflict zones and remote regions", "Built Vice's drone cinematography program from scratch"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.F.A. Cinematography", school: "American Film Institute", location: "Los Angeles, CA", startDate: "2012", endDate: "2014", description: "ASC Student Heritage Award winner. Thesis film screened at Cannes Short Film Corner." },
        { degree: "B.A. Film & Television", school: "NYU Tisch School of the Arts", location: "New York, NY", startDate: "2008", endDate: "2012", description: "Concentration in cinematography. Dean's Fellow." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Cinematography", skills: [{ name: "ARRI Alexa" }, { name: "RED V-Raptor" }, { name: "Sony Venice" }, { name: "Anamorphic Lenses" }, { name: "Steadicam" }] },
        { category: "Post-Production", skills: [{ name: "DaVinci Resolve" }, { name: "Premiere Pro" }, { name: "After Effects" }, { name: "Color Grading" }, { name: "Sound Design" }] },
        { category: "Specialty", skills: [{ name: "Drone Cinematography" }, { name: "Underwater Photography" }, { name: "Time-Lapse" }, { name: "Motion Control" }] },
        { category: "Production", skills: [{ name: "Directing" }, { name: "Storyboarding" }, { name: "Lighting Design" }, { name: "Production Management" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Vanishing Shores — Feature Documentary", description: "90-minute documentary on rising sea levels threatening Pacific Island nations. Sundance 2024 Official Selection. Currently in theatrical distribution across 12 countries.", techStack: ["ARRI Alexa Mini", "Drone", "Underwater"], liveUrl: "", repoUrl: "", imageUrl: img.film1, videoUrl: vid.nature },
        { title: "Apple — 'Shot on iPhone' Campaign", description: "Directed and shot a series of 6 commercial spots for Apple's flagship campaign. Broadcast in 40+ markets. 200M+ combined views.", techStack: ["iPhone 15 Pro", "Steadicam", "DaVinci Resolve"], liveUrl: "", repoUrl: "", imageUrl: img.film2, videoUrl: vid.city },
        { title: "Mercedes-Benz EQS Launch Film", description: "Cinematic brand film for the launch of the all-electric Mercedes EQS. Shot across 5 locations over 3 weeks. Featured at CES 2024.", techStack: ["RED V-Raptor", "Motion Control", "VFX"], liveUrl: "", repoUrl: "", imageUrl: img.drone1, videoUrl: vid.drone },
        { title: "Patagonia — 'Wild Places' Series", description: "6-part documentary series on conservation efforts in threatened ecosystems. Shot over 18 months across Patagonia, Alaska, and Borneo.", techStack: ["Sony Venice", "Drone", "Time-Lapse"], liveUrl: "", repoUrl: "", imageUrl: img.film3, videoUrl: vid.nature },
      ],
    },
    /* # Gallery — Showcase reel and stills */
    {
      type: "gallery", visible: true,
      entries: [
        { title: "Vanishing Shores — Behind the Scenes", description: "On location in Tuvalu shooting the opening sequence", imageUrl: img.film1, videoUrl: "", category: "Documentary", link: "" },
        { title: "Aerial Cinematography Reel", description: "Drone footage compilation from 2023-2024 projects", imageUrl: img.drone1, videoUrl: vid.drone, category: "Aerial", link: "" },
        { title: "Golden Hour — Commercial Stills", description: "Selected stills from the Mercedes-Benz EQS shoot", imageUrl: img.film2, videoUrl: "", category: "Commercial", link: "" },
        { title: "Underwater Sequence — Our Planet", description: "Coral reef cinematography for National Geographic", imageUrl: img.landscape2, videoUrl: vid.nature, category: "Underwater", link: "" },
        { title: "City at Night — Timelapse", description: "Hyperlapse sequence from the Apple campaign", imageUrl: img.street1, videoUrl: vid.city, category: "Timelapse", link: "" },
        { title: "Wild Places — Alaska", description: "Glacier footage from the Patagonia documentary", imageUrl: img.landscape1, videoUrl: "", category: "Documentary", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "Sundance Film Festival — Official Selection", issuer: "Sundance Institute", date: "2024", description: "Vanishing Shores feature documentary." },
        { title: "Emmy Nomination — Outstanding Cinematography", issuer: "Television Academy", date: "2023", description: "Our Planet Season 2." },
        { title: "Vimeo Staff Pick — Best Cinematography", issuer: "Vimeo", date: "2023", description: "Mercedes-Benz EQS launch film." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "An extraordinary eye for light and composition. Every frame they shoot could hang in a gallery. Their documentary work is both visually stunning and deeply human.", author: "Ken Burns", role: "Documentary Filmmaker", company: "" },
        { quote: "Working with them on our global campaign was transformative. They brought a cinematic quality that elevated the entire brand.", author: "Tor Myhren", role: "VP of Marketing", company: "Apple" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "studio@example.com", phone: "+1 (310) 555-0199", location: "Los Angeles, CA",
      calendarLink: "", socialLinks: { instagram: "https://instagram.com/example", vimeo: "https://vimeo.com/example" },
    },
  ];
}

/* # 8. PHOTOGRAPHER — Fine Art & Commercial Photographer */
function photographerSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Fine art and commercial photographer exploring the intersection of light, landscape, and human emotion. My work has been exhibited at the Tate Modern, featured in National Geographic, and collected by private galleries worldwide. Represented by Magnum Photos.",
      tagline: "Fine Art & Documentary Photographer",
      avatarUrl: "", socialLinks: { instagram: "https://instagram.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Represented Photographer", company: "Magnum Photos", location: "London / New York", startDate: "2021", endDate: "Present", description: "Full member of Magnum Photos agency.", achievements: ["Solo exhibitions at Tate Modern, Centre Pompidou, and MoMA PS1", "Published 3 photography monographs with Phaidon and Aperture", "Commissioned by Vogue, National Geographic, and The New York Times", "Prints collected by 50+ private collectors and 8 museum permanent collections"] },
        { title: "Staff Photographer", company: "National Geographic", location: "Washington, D.C.", startDate: "2017", endDate: "2021", description: "Feature stories and cover shoots.", achievements: ["Shot 12 feature stories across 30+ countries", "Two National Geographic cover photographs", "Won World Press Photo Award for environmental documentary"] },
        { title: "Freelance Photographer", company: "Independent", location: "London, UK", startDate: "2013", endDate: "2017", description: "Editorial and commercial photography.", achievements: ["Built client roster including Condé Nast, BBC, and Louis Vuitton", "First solo show at Photographers' Gallery, London — sold out edition"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.A. Photography", school: "Royal College of Art", location: "London, UK", startDate: "2011", endDate: "2013", description: "Thesis series 'Invisible Cities' acquired by the V&A Museum." },
        { degree: "B.A. Fine Art Photography", school: "Central Saint Martins", location: "London, UK", startDate: "2007", endDate: "2011", description: "Awarded the Ansel Adams Prize for landscape photography." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Camera Systems", skills: [{ name: "Medium Format (Hasselblad)" }, { name: "35mm (Leica)" }, { name: "Large Format (4x5)" }, { name: "Drone (DJI)" }] },
        { category: "Lighting & Post", skills: [{ name: "Natural Light" }, { name: "Studio Lighting" }, { name: "Lightroom" }, { name: "Capture One" }, { name: "Photoshop" }] },
        { category: "Genres", skills: [{ name: "Landscape" }, { name: "Portrait" }, { name: "Documentary" }, { name: "Street" }, { name: "Astrophotography" }] },
        { category: "Print & Exhibition", skills: [{ name: "Archival Printing" }, { name: "Gallery Curation" }, { name: "Book Design" }, { name: "Fine Art Printing" }] },
      ],
    },
    /* # Gallery is the PRIMARY section for photographer — large and rich */
    {
      type: "gallery", visible: true,
      entries: [
        { title: "Alpine Dawn", description: "First light breaking over the Swiss Alps, Zermatt", imageUrl: img.landscape1, videoUrl: "", category: "Landscape", link: "" },
        { title: "Morning Mist", description: "Fog rolling through the valleys of the Dolomites", imageUrl: img.landscape2, videoUrl: "", category: "Landscape", link: "" },
        { title: "Urban Solitude", description: "Tokyo at 4 AM — from the 'Invisible Cities' series", imageUrl: img.street1, videoUrl: "", category: "Street", link: "" },
        { title: "Quiet Strength", description: "Portrait study — natural light, Hasselblad 500C/M", imageUrl: img.portrait1, videoUrl: "", category: "Portrait", link: "" },
        { title: "Cascading Light", description: "Waterfall long exposure, Iceland", imageUrl: img.nature1, videoUrl: "", category: "Landscape", link: "" },
        { title: "Midnight Crossing", description: "Barcelona street scene from the 'Night Cities' series", imageUrl: img.street2, videoUrl: "", category: "Street", link: "" },
        { title: "Cosmos", description: "Milky Way over the Atacama Desert, Chile", imageUrl: img.astro1, videoUrl: "", category: "Astrophotography", link: "" },
        { title: "The Watcher", description: "Leopard at dusk, Maasai Mara — National Geographic assignment", imageUrl: img.wildlife1, videoUrl: "", category: "Wildlife", link: "" },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Invisible Cities — Monograph", description: "A meditation on urban solitude across 20 cities. Published by Phaidon. 120 photographs. Exhibited at Tate Modern and Centre Pompidou.", techStack: ["Leica M10", "Hasselblad", "Archival Print"], liveUrl: "", repoUrl: "", imageUrl: img.street1, videoUrl: "" },
        { title: "Vanishing Glaciers — NatGeo Feature", description: "18-month project documenting glacier retreat across 8 countries. National Geographic cover story. World Press Photo Award winner.", techStack: ["Medium Format", "Drone", "Time-Lapse"], liveUrl: "", repoUrl: "", imageUrl: img.landscape1, videoUrl: "" },
        { title: "Louis Vuitton — Travel Campaign", description: "Global advertising campaign shot across Japan, Morocco, and Patagonia. Featured in 200+ publications worldwide.", techStack: ["Hasselblad H6D", "Studio Lighting", "Post-Production"], liveUrl: "", repoUrl: "", imageUrl: img.landscape2, videoUrl: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "World Press Photo Award — Environment", issuer: "World Press Photo Foundation", date: "2023", description: "Vanishing Glaciers documentary series." },
        { title: "Sony World Photography Awards — Landscape", issuer: "World Photography Organisation", date: "2022", description: "Alpine Dawn image from the Swiss Alps series." },
        { title: "Hasselblad Masters — Landscape Category", issuer: "Hasselblad", date: "2021", description: "Selected from 63,000+ entries worldwide." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "A photographer who sees what others miss. Their images don't just capture a moment — they reveal an entire world within it.", author: "Steve McCurry", role: "Photographer", company: "Magnum Photos" },
        { quote: "The most visually stunning environmental work we've published in a decade. Their images changed how our readers think about climate change.", author: "Susan Goldberg", role: "Editor in Chief", company: "National Geographic" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "studio@example.com", phone: "+44 7700 900000", location: "London, UK",
      calendarLink: "", socialLinks: { instagram: "https://instagram.com/example" },
    },
  ];
}

/* # 9. ARCHITECT — Licensed Architect */
function architectSections(): PortfolioSection[] {
  return [
    {
      type: "about", visible: true,
      bio: "Licensed architect and design principal with 12+ years shaping the built environment. My practice bridges sustainable innovation with timeless design — creating spaces that breathe, inspire, and endure. From award-winning residences to large-scale cultural institutions, every project begins with a deep understanding of place and purpose.",
      tagline: "Design Principal — Architecture & Sustainability",
      avatarUrl: "", socialLinks: { linkedin: "https://linkedin.com/in/example", instagram: "https://instagram.com/example" },
    },
    {
      type: "experience", visible: true,
      entries: [
        { title: "Design Principal", company: "Atelier Horizon", location: "Copenhagen / New York", startDate: "2021", endDate: "Present", description: "Founded boutique practice focusing on sustainable architecture.", achievements: ["Designed the Copenhagen Waterfront Cultural Centre — 25,000 sqm, LEED Platinum", "Won AIA National Honor Award for residential design", "Completed 15 projects across 6 countries totaling $200M+ in construction value", "All projects achieve net-zero or net-positive energy performance"] },
        { title: "Senior Associate", company: "Foster + Partners", location: "London, UK", startDate: "2016", endDate: "2021", description: "Design team lead on large-scale cultural and commercial projects.", achievements: ["Led design team for the Abu Dhabi Museum of Natural History", "Managed $500M project pipeline with teams across 3 offices", "Developed the firm's mass timber construction research initiative"] },
        { title: "Architect", company: "Bjarke Ingels Group (BIG)", location: "Copenhagen, Denmark", startDate: "2012", endDate: "2016", description: "Design architect on mixed-use and residential projects.", achievements: ["Key designer on the Amager Bakke waste-to-energy plant with ski slope roof", "Co-authored BIG's 'Formgiving' philosophy publication", "Won first place in 3 international design competitions"] },
      ],
    },
    {
      type: "education", visible: true,
      entries: [
        { degree: "M.Arch — Architecture & Sustainability", school: "ETH Zurich", location: "Zurich, Switzerland", startDate: "2010", endDate: "2012", description: "Studio of Prof. Peter Zumthor. Thesis on bio-climatic design in Nordic contexts." },
        { degree: "B.Arch — Architecture", school: "The Cooper Union", location: "New York, NY", startDate: "2005", endDate: "2010", description: "Full merit scholarship. Awarded the Hejduk Prize for design excellence." },
      ],
    },
    {
      type: "skills", visible: true,
      groups: [
        { category: "Design & Visualization", skills: [{ name: "Rhino / Grasshopper" }, { name: "Revit" }, { name: "AutoCAD" }, { name: "V-Ray" }, { name: "Enscape" }, { name: "SketchUp" }] },
        { category: "Computational Design", skills: [{ name: "Parametric Design" }, { name: "Generative Algorithms" }, { name: "Environmental Simulation" }, { name: "BIM" }] },
        { category: "Sustainability", skills: [{ name: "LEED" }, { name: "Passive House" }, { name: "Net-Zero Design" }, { name: "Mass Timber" }, { name: "Biophilic Design" }] },
        { category: "Project Management", skills: [{ name: "Client Relations" }, { name: "Construction Admin" }, { name: "Code Compliance" }, { name: "Budget Management" }] },
      ],
    },
    {
      type: "projects", visible: true,
      entries: [
        { title: "Copenhagen Waterfront Cultural Centre", description: "25,000 sqm cultural institution on the Copenhagen harbor. LEED Platinum. Features a public rooftop garden, performance halls, and community spaces. Opening 2025.", techStack: ["Rhino", "Grasshopper", "Mass Timber", "LEED Platinum"], liveUrl: "", repoUrl: "", imageUrl: img.arch1, videoUrl: "" },
        { title: "The Canopy House — Private Residence", description: "Net-positive energy residence in the Hudson Valley. Passive House certified. Won AIA National Honor Award. Featured in Architectural Digest.", techStack: ["Revit", "Passive House", "Cross-Laminated Timber"], liveUrl: "", repoUrl: "", imageUrl: img.arch2, videoUrl: "" },
        { title: "Horizon Tower — Mixed-Use Development", description: "42-story mixed-use tower in Singapore with integrated vertical forest, sky gardens every 8 floors, and 40% energy reduction vs. code.", techStack: ["Rhino", "Environmental Analysis", "Biophilic Design"], liveUrl: "", repoUrl: "", imageUrl: img.arch3, videoUrl: "" },
        { title: "Nordic Pavilion — Venice Biennale", description: "Temporary pavilion exploring the relationship between light and timber. 100% demountable and reusable. Selected for Venice Architecture Biennale 2023.", techStack: ["Grasshopper", "CNC Fabrication", "Mass Timber"], liveUrl: "", repoUrl: "", imageUrl: img.arch4, videoUrl: "" },
      ],
    },
    /* # Gallery — Architectural renders and photography */
    {
      type: "gallery", visible: true,
      entries: [
        { title: "Waterfront Centre — Exterior", description: "View from Copenhagen harbor at sunset", imageUrl: img.arch1, videoUrl: "", category: "Cultural", link: "" },
        { title: "Waterfront Centre — Interior Atrium", description: "Central atrium with mass timber structure", imageUrl: img.arch2, videoUrl: "", category: "Cultural", link: "" },
        { title: "Horizon Tower — Aerial View", description: "Completed tower with sky gardens visible", imageUrl: img.arch3, videoUrl: "", category: "Commercial", link: "" },
        { title: "The Canopy House — Living Space", description: "Open plan living area with floor-to-ceiling glazing", imageUrl: img.interior1, videoUrl: "", category: "Residential", link: "" },
        { title: "The Canopy House — Garden View", description: "Exterior view from the meadow garden", imageUrl: img.interior2, videoUrl: "", category: "Residential", link: "" },
        { title: "Nordic Pavilion — Venice", description: "Pavilion structure during golden hour", imageUrl: img.arch4, videoUrl: "", category: "Exhibition", link: "" },
      ],
    },
    {
      type: "certifications", visible: true,
      entries: [
        { name: "Licensed Architect — RIBA Part III", issuer: "RIBA", date: "2013", link: "" },
        { name: "LEED Accredited Professional (BD+C)", issuer: "USGBC", date: "2016", link: "" },
        { name: "Certified Passive House Designer", issuer: "Passive House Institute", date: "2019", link: "" },
      ],
    },
    {
      type: "awards", visible: true,
      entries: [
        { title: "AIA National Honor Award — Residential", issuer: "American Institute of Architects", date: "2024", description: "The Canopy House — net-positive energy residence." },
        { title: "RIBA International Prize — Shortlist", issuer: "RIBA", date: "2023", description: "Copenhagen Waterfront Cultural Centre." },
        { title: "Dezeen Awards — Sustainability Project of the Year", issuer: "Dezeen", date: "2023", description: "Horizon Tower vertical forest integration." },
      ],
    },
    {
      type: "testimonials", visible: true,
      entries: [
        { quote: "Architecture that doesn't just respond to its environment but actively heals it. Their sustainability work isn't a compromise — it's the most beautiful part of the design.", author: "Bjarke Ingels", role: "Founder", company: "BIG" },
        { quote: "They designed us a home that feels like it grew from the landscape. Every season reveals something new. It's the most thoughtful building I've ever experienced.", author: "Anders & Mette Hansen", role: "Clients", company: "The Canopy House" },
      ],
    },
    {
      type: "contact", visible: true,
      email: "studio@example.com", phone: "+45 32 96 0000", location: "Copenhagen, Denmark",
      calendarLink: "", socialLinks: { linkedin: "https://linkedin.com/in/example", instagram: "https://instagram.com/example" },
    },
  ];
}

/* ================================================================
   PERSONA METADATA — name + tagline per template
   ================================================================ */
const PERSONA: Record<TemplateName, { name: string; tagline: string }> = {
  minimal:      { name: "Elena Whitfield",    tagline: "Product Designer & Design Systems Lead" },
  developer:    { name: "Marcus Chen",        tagline: "Full-Stack Engineer & Open Source Contributor" },
  creative:     { name: "Zara Okonkwo",       tagline: "Creative Director & Brand Strategist" },
  corporate:    { name: "James Ashworth",      tagline: "Senior Partner — Strategy & Transformation" },
  academic:     { name: "Dr. Priya Sharma",    tagline: "Associate Professor — Computational Neuroscience" },
  modern:       { name: "Noah Fitzgerald",     tagline: "Product Leader & Startup Founder" },
  videographer: { name: "Luca Moretti",        tagline: "Cinematographer & Documentary Filmmaker" },
  photographer: { name: "Anya Johansson",      tagline: "Fine Art & Documentary Photographer" },
  architect:    { name: "Kai Andersen",        tagline: "Design Principal — Architecture & Sustainability" },
};

/* # Sections generator dispatch */
const SECTION_GENERATORS: Record<TemplateName, () => PortfolioSection[]> = {
  minimal: minimalSections,
  developer: developerSections,
  creative: creativeSections,
  corporate: corporateSections,
  academic: academicSections,
  modern: modernSections,
  videographer: videographerSections,
  photographer: photographerSections,
  architect: architectSections,
};

/* # Build a complete PortfolioData object for the given template */
export function getDemoPortfolioData(template: TemplateName): PortfolioData {
  const persona = PERSONA[template];
  const sections = SECTION_GENERATORS[template]();
  const about = sections.find((s) => s.type === "about");

  return {
    id: "demo-preview",
    slug: "demo-preview",
    title: persona.name,
    tagline: persona.tagline,
    bio: about && "bio" in about ? about.bio : "",
    template,
    themeColors: null,
    socialLinks: about && "socialLinks" in about ? about.socialLinks : {},
    avatarUrl: null,
    published: false,
    sections,
    userName: persona.name,
    userImage: null,
  };
}
