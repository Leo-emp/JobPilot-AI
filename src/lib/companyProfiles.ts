/* ============================================================
   COMPANY INTERVIEW PROFILES
   ============================================================
   Real interview styles, question patterns, and evaluation
   criteria for major companies. Sourced from public data
   (Glassdoor, LeetCode, Blind, GitHub repos, company blogs).

   Used by the mock interview to inject company-specific context
   so the AI generates authentic, realistic questions.
   ============================================================ */

/* ---- Types ---- */
export interface CompanyProfile {
  name: string;
  category: CompanyCategory;
  interviewStyle: string;
  rounds: string[];
  questionPatterns: Record<string, string[]>;
  evaluationCriteria: string[];
  commonTopics: string[];
  /* Company-specific frameworks or values the interviewer tests */
  culturalFramework?: string;
}

export type CompanyCategory = "FAANG" | "Big 4" | "Big Tech" | "Consulting";

/* ---- Category metadata (label + description shown in the dropdown) ---- */
export const COMPANY_CATEGORIES: { value: CompanyCategory; label: string; description: string }[] = [
  { value: "FAANG", label: "FAANG", description: "Meta, Apple, Amazon, Netflix, Google" },
  { value: "Big 4", label: "Big 4 Accounting", description: "Deloitte, PwC, EY, KPMG" },
  { value: "Big Tech", label: "Big Tech", description: "Microsoft, Uber, Airbnb, Stripe, Tesla, Salesforce" },
  { value: "Consulting", label: "Top Consulting", description: "McKinsey, BCG, Bain" },
];

/* ---- Company profiles keyed by slug ---- */
export const COMPANY_PROFILES: Record<string, CompanyProfile> = {

  /* ================================================================
     FAANG
     ================================================================ */

  google: {
    name: "Google",
    category: "FAANG",
    interviewStyle: "Heavy on algorithms, system design, and Googleyness (leadership + culture fit). Interviewers grade on a rubric across 4 dimensions. Expects structured thinking and clear communication during problem-solving.",
    rounds: ["Recruiter Screen", "Phone/Video Technical Screen", "Onsite: Coding x2", "Onsite: System Design", "Onsite: Behavioral (Googleyness & Leadership)"],
    questionPatterns: {
      technical: [
        "Design a URL shortener with analytics and rate limiting",
        "Given a stream of integers, find the median at each step",
        "Find the longest substring without repeating characters",
        "Implement an LRU cache with O(1) operations",
        "Design a task scheduler with dependencies",
        "How would you detect cycles in a distributed system?"
      ],
      systemDesign: [
        "Design Google Docs real-time collaboration system",
        "Design YouTube's video upload and processing pipeline",
        "Design Google Maps routing at global scale",
        "Design a web crawler that respects robots.txt",
        "Design a notification system for 2 billion users"
      ],
      behavioral: [
        "Tell me about a time you had to push back on a stakeholder",
        "Describe a project where you had ambiguous requirements — how did you proceed?",
        "Tell me about a time you failed and what you learned",
        "How do you handle disagreements within your team?",
        "Describe a time you went above and beyond what was expected"
      ]
    },
    evaluationCriteria: ["General Cognitive Ability", "Role-Related Knowledge", "Googleyness (culture fit)", "Leadership"],
    commonTopics: ["graphs", "dynamic programming", "distributed systems", "concurrency", "trees", "hash maps"],
    culturalFramework: "Googleyness: thriving in ambiguity, bias to action, collaborative nature, doing the right thing. Interviewers look for intellectual humility — candidates who can say 'I don't know but here's how I'd figure it out.'"
  },

  meta: {
    name: "Meta",
    category: "FAANG",
    interviewStyle: "Fast-paced coding interviews with emphasis on clean, bug-free code. System design focuses on social graph scale. Behavioral uses 'Move Fast' culture lens. Expects production-quality code, not pseudocode.",
    rounds: ["Recruiter Screen", "Technical Phone Screen (45 min coding)", "Onsite: Coding x2 (45 min each)", "Onsite: System Design", "Onsite: Behavioral"],
    questionPatterns: {
      technical: [
        "Serialize and deserialize a binary tree",
        "Find all valid parentheses combinations for n pairs",
        "Implement a basic calculator that handles +, -, *, / and parentheses",
        "Given an array of meeting intervals, find the minimum number of conference rooms",
        "Design a data structure that supports insert, delete, and getRandom in O(1)",
        "Clone a graph with random pointers"
      ],
      systemDesign: [
        "Design Facebook's News Feed ranking system",
        "Design Instagram Stories with real-time updates",
        "Design WhatsApp messaging at scale",
        "Design a live streaming platform",
        "Design the Facebook Marketplace search system"
      ],
      behavioral: [
        "Tell me about a time you had to move fast with incomplete information",
        "Describe a situation where you had to give tough feedback to a colleague",
        "Tell me about your biggest engineering impact",
        "How do you prioritize when everything is urgent?",
        "Describe a time you simplified something complex"
      ]
    },
    evaluationCriteria: ["Coding speed and correctness", "System design at social-graph scale", "Move Fast mentality", "Impact-driven thinking"],
    commonTopics: ["arrays", "strings", "graphs", "BFS/DFS", "dynamic programming", "binary trees"],
    culturalFramework: "Meta's core values: Move Fast, Be Bold, Focus on Impact, Be Open, Build Social Value. Interviewers value candidates who ship fast, take calculated risks, and can quantify their impact."
  },

  amazon: {
    name: "Amazon",
    category: "FAANG",
    interviewStyle: "Leadership Principles (LPs) dominate EVERY interview — even technical rounds include LP-based behavioral questions. Expect the STAR method. Bar Raiser round is the hardest. Every answer should map to at least one LP.",
    rounds: ["Online Assessment (OA)", "Phone Screen", "Onsite Loop: 4-5 interviews (each combines behavioral + technical)", "Bar Raiser Round (independent evaluator)"],
    questionPatterns: {
      behavioral: [
        "Tell me about a time you went above and beyond for a customer (Customer Obsession)",
        "Describe a situation where you had to make a decision without all the data (Bias for Action)",
        "Tell me about a time you disagreed with your manager and what you did (Have Backbone; Disagree and Commit)",
        "Tell me about a time you invented or simplified something (Invent and Simplify)",
        "Describe when you had to dive deep into data to solve a problem (Dive Deep)",
        "Tell me about a time you took ownership of a problem outside your scope (Ownership)",
        "Describe a time you delivered results under a tight deadline (Deliver Results)"
      ],
      technical: [
        "Design an order processing system for a marketplace",
        "Implement an LRU cache",
        "Find the k closest points to origin",
        "Design a parking lot system (OOP design)",
        "Merge k sorted linked lists",
        "Design a recommendation engine for products"
      ],
      systemDesign: [
        "Design Amazon's product search and ranking system",
        "Design a real-time inventory management system",
        "Design a distributed rate limiter",
        "Design the Amazon Prime Video streaming architecture"
      ]
    },
    evaluationCriteria: ["Leadership Principles alignment (ALL 16)", "STAR method depth and specificity", "Data-driven decision making", "Ownership mentality", "Bar Raiser assessment"],
    commonTopics: ["arrays", "trees", "graphs", "system design", "OOP design", "LP-mapped behavioral"],
    culturalFramework: "Amazon's 16 Leadership Principles: Customer Obsession, Ownership, Invent and Simplify, Are Right A Lot, Learn and Be Curious, Hire and Develop the Best, Insist on the Highest Standards, Think Big, Bias for Action, Frugality, Earn Trust, Dive Deep, Have Backbone; Disagree and Commit, Deliver Results, Strive to be Earth's Best Employer, Success and Scale Bring Broad Responsibility."
  },

  apple: {
    name: "Apple",
    category: "FAANG",
    interviewStyle: "Very secretive process. Strong emphasis on domain expertise and passion for Apple products. Questions are deeply technical for the specific team. Culture fit focuses on collaboration, attention to detail, and user experience obsession.",
    rounds: ["Recruiter Screen", "Phone Technical Interview", "Onsite: 5-6 interviews (mix of coding, domain, design, behavioral)", "Team Matching"],
    questionPatterns: {
      technical: [
        "Design a thread-safe data structure for a concurrent environment",
        "Implement a trie for autocomplete functionality",
        "How would you optimize battery consumption for a background service?",
        "Design an efficient image caching system for a mobile app",
        "Implement a basic version of malloc/free",
        "Reverse nodes in a linked list in groups of k"
      ],
      behavioral: [
        "Why Apple? What Apple products do you use and what would you improve?",
        "Tell me about a time you obsessed over product quality",
        "Describe your approach to simplifying a complex user experience",
        "Tell me about a time you had to say no to a feature",
        "How do you balance perfection with shipping on time?"
      ],
      systemDesign: [
        "Design iMessage's end-to-end encryption system",
        "Design the App Store search and ranking",
        "Design a privacy-preserving analytics system",
        "Design Siri's speech-to-text pipeline"
      ]
    },
    evaluationCriteria: ["Deep domain expertise", "Passion for Apple and its products", "Attention to detail", "User-centric thinking", "Collaboration"],
    commonTopics: ["memory management", "concurrency", "performance optimization", "mobile architecture", "privacy"],
    culturalFramework: "Apple values secrecy, attention to detail, and user experience above all. They look for people who take personal pride in craftsmanship and can articulate why design decisions matter at the pixel level."
  },

  netflix: {
    name: "Netflix",
    category: "FAANG",
    interviewStyle: "Culture-heavy interviews based on the Netflix Culture Memo. Expects high autonomy, radical candor, and strong judgment. Technical interviews focus on real-world problem solving over algorithms. Compensation discussions happen early.",
    rounds: ["Recruiter Screen (includes comp discussion)", "Hiring Manager Screen", "Phone Technical", "Onsite: 4-5 interviews (technical + culture)"],
    questionPatterns: {
      technical: [
        "Design a recommendation algorithm for personalized content",
        "How would you handle A/B testing at massive scale?",
        "Design a system that can stream 4K video to millions simultaneously",
        "How would you detect and handle service degradation gracefully?",
        "Implement an adaptive bitrate streaming algorithm"
      ],
      behavioral: [
        "Tell me about a time you made a controversial decision and stood by it (Courage)",
        "Describe how you've given honest, direct feedback to a peer (Candor)",
        "Tell me about a time you made a judgment call with limited data",
        "How do you prioritize context over control?",
        "Describe a situation where you chose to do what was right over what was easy",
        "How do you handle disagreement with senior leadership?"
      ],
      systemDesign: [
        "Design Netflix's video encoding pipeline",
        "Design a chaos engineering platform",
        "Design a content delivery network for global streaming",
        "Design a real-time viewing analytics dashboard"
      ]
    },
    evaluationCriteria: ["Judgment and decision-making", "Communication (radical candor)", "Courage to challenge the status quo", "Selflessness", "Innovation"],
    commonTopics: ["streaming systems", "distributed systems", "A/B testing", "microservices", "resilience engineering"],
    culturalFramework: "Netflix Culture Memo: Freedom & Responsibility. They hire 'stunning colleagues' and expect radical candor, high performance, and the courage to make tough calls. No rules-based culture — context over control."
  },

  /* ================================================================
     BIG 4 ACCOUNTING / CONSULTING
     ================================================================ */

  deloitte: {
    name: "Deloitte",
    category: "Big 4",
    interviewStyle: "Case-based + behavioral interviews. Early rounds are competency-based, final round is a partner interview testing commercial awareness and cultural fit. Strong emphasis on structured thinking and communication.",
    rounds: ["Online Application + Tests", "First Round: Manager Interview", "Case Study / Group Exercise", "Partner/Director Final Interview"],
    questionPatterns: {
      case: [
        "Your client's revenue dropped 20% year-over-year — walk me through your analysis framework",
        "A retail chain wants to expand into Southeast Asia — advise them on market entry strategy",
        "A hospital system wants to reduce patient wait times by 40% — where do you start?",
        "Your client is considering acquiring a competitor — what factors should they evaluate?"
      ],
      behavioral: [
        "Why consulting? Why Deloitte specifically over other Big 4?",
        "Describe a time you led a team through ambiguity",
        "Tell me about a time you had to influence someone without authority",
        "Give an example of when you had to manage multiple stakeholders with conflicting priorities",
        "Describe a situation where you had to adapt quickly to change"
      ],
      technical: [
        "Walk me through a DCF valuation",
        "How would you size the market for electric vehicles in the UK?",
        "Explain the difference between IFRS and GAAP",
        "How would you assess the financial health of a company using only their annual report?"
      ]
    },
    evaluationCriteria: ["Structured thinking (MECE)", "Communication clarity", "Commercial awareness", "Leadership potential", "Cultural fit"],
    commonTopics: ["market sizing", "profitability", "M&A", "growth strategy", "organizational transformation"],
    culturalFramework: "Deloitte values: Lead the way, Serve with integrity, Take care of each other, Foster inclusion, Collaborate for measurable impact."
  },

  pwc: {
    name: "PwC",
    category: "Big 4",
    interviewStyle: "Competency-based behavioral interviews mapped to PwC's Professional framework. Case interviews for consulting roles. Strong focus on teamwork, commercial awareness, and ability to build relationships.",
    rounds: ["Online Tests (numerical, verbal, game-based)", "Video Interview", "Assessment Centre (group exercise + partner interview)", "Partner Interview"],
    questionPatterns: {
      behavioral: [
        "Tell me about a time you demonstrated whole leadership",
        "Describe a situation where you had to build trust with a new team",
        "Give an example of when you challenged the status quo",
        "Tell me about a time you had to deliver a difficult message",
        "How do you stay current with industry trends?"
      ],
      case: [
        "A mid-sized bank is losing market share to fintech startups — develop a strategy",
        "Your client wants to reduce costs by 15% without layoffs — how would you approach this?",
        "A pharmaceutical company needs to decide whether to invest in R&D or acquire a biotech startup"
      ],
      technical: [
        "Walk me through the three financial statements and how they connect",
        "How would you audit a company's revenue recognition practices?",
        "Explain materiality in auditing and how you'd set thresholds"
      ]
    },
    evaluationCriteria: ["Whole leadership", "Technical capabilities", "Business acumen", "Relationship building", "Global acumen"],
    commonTopics: ["financial analysis", "risk assessment", "digital transformation", "regulatory compliance", "ESG"],
    culturalFramework: "PwC's Professional framework: Whole Leadership (lead at every level), Business Acumen, Technical & Digital capabilities, Global & Inclusive mindset, Relationships."
  },

  ey: {
    name: "EY (Ernst & Young)",
    category: "Big 4",
    interviewStyle: "Strength-based interviews — focuses on what energizes you, not just past experience. Uses the 'Building a Better Working World' mission as a cultural lens. Case interviews for advisory roles.",
    rounds: ["Online Application + Strengths Assessment", "Video Interview (strengths-based)", "Assessment Centre (group case study + interview)", "Partner Interview"],
    questionPatterns: {
      behavioral: [
        "What energizes you most in your work?",
        "Tell me about a time you went the extra mile for a client or colleague",
        "Describe a situation where you had to learn something completely new quickly",
        "How do you build trust with people who are very different from you?",
        "Tell me about a time you identified an opportunity others missed"
      ],
      case: [
        "A global retailer's supply chain was disrupted — design a resilience strategy",
        "How would you advise a tech startup on their IPO readiness?",
        "A manufacturing client wants to achieve net-zero by 2030 — what's the roadmap?"
      ],
      technical: [
        "How do emerging technologies like AI impact the audit profession?",
        "Walk me through the process of a statutory audit",
        "Explain transfer pricing and why it matters for multinational companies"
      ]
    },
    evaluationCriteria: ["Energy and passion", "Analytical thinking", "Teamwork and collaboration", "Innovation", "Purpose-driven mindset"],
    commonTopics: ["digital transformation", "sustainability", "tax strategy", "assurance", "managed services"],
    culturalFramework: "EY's purpose: Building a better working world. They assess through strengths rather than competencies — looking for what naturally drives and energizes candidates."
  },

  kpmg: {
    name: "KPMG",
    category: "Big 4",
    interviewStyle: "Values-based interviews aligned to KPMG's 'Our Values' framework. Mix of competency and motivational questions. Strong focus on integrity, teamwork, and continuous learning. Partner round tests gravitas and commercial awareness.",
    rounds: ["Online Tests (SHL-style)", "Video/Phone Interview", "Assessment Centre (group exercise + presentation)", "Partner Interview"],
    questionPatterns: {
      behavioral: [
        "Tell me about a time you acted with integrity under pressure",
        "Describe a situation where you had to work with a difficult team member",
        "Give an example of when you challenged yourself to learn something new",
        "Tell me about a time you delivered excellence beyond what was expected",
        "How do you ensure quality in your work when under time pressure?"
      ],
      case: [
        "A healthcare company's costs are growing faster than revenue — diagnose and recommend",
        "Your client is deciding between organic growth and acquisition — advise them",
        "How would you help a government agency modernize their IT infrastructure?"
      ],
      technical: [
        "What's the difference between an audit and a review engagement?",
        "How would you assess going concern risk?",
        "Explain the concept of fair value measurement under IFRS 13"
      ]
    },
    evaluationCriteria: ["Integrity", "Excellence", "Courage", "Together (teamwork)", "For Better (making a difference)"],
    commonTopics: ["audit methodology", "tax advisory", "risk consulting", "deal advisory", "ESG reporting"],
    culturalFramework: "KPMG Values: Integrity, Excellence, Courage, Together, For Better. Interviewers assess alignment with these values through specific behavioral examples."
  },

  /* ================================================================
     BIG TECH
     ================================================================ */

  microsoft: {
    name: "Microsoft",
    category: "Big Tech",
    interviewStyle: "Growth mindset is central — they want learners, not know-it-alls. Technical interviews test coding + system design. Behavioral focuses on collaboration and impact. 'As Appropriate' (AA) interview is the final hiring decision round.",
    rounds: ["Recruiter Screen", "Phone Technical Screen", "Onsite: 4-5 interviews (coding, design, behavioral)", "As Appropriate (AA) Round — Senior hiring manager"],
    questionPatterns: {
      technical: [
        "Design a distributed key-value store",
        "Implement a min stack with O(1) getMin",
        "How would you design the backend for Microsoft Teams?",
        "Find the shortest path in a weighted graph",
        "Design an elevator system (OOP)",
        "How would you handle eventual consistency in a cloud service?"
      ],
      behavioral: [
        "Tell me about a time you demonstrated a growth mindset",
        "Describe a situation where you had to collaborate across teams",
        "How do you handle feedback that you disagree with?",
        "Tell me about a time you made a customer's life better through technology",
        "Describe a failure and how you grew from it"
      ],
      systemDesign: [
        "Design OneDrive's file sync system",
        "Design Azure's auto-scaling system",
        "Design a real-time collaborative whiteboard (like Microsoft Whiteboard)",
        "Design Outlook's calendar scheduling system"
      ]
    },
    evaluationCriteria: ["Growth mindset", "Collaboration", "Customer obsession", "Diversity and inclusion", "Technical excellence"],
    commonTopics: ["cloud architecture", "distributed systems", "API design", "concurrency", "OOP design patterns"],
    culturalFramework: "Microsoft's culture: Growth Mindset — learn-it-all, not know-it-all. They look for curiosity, empathy, and the ability to empower others. Satya Nadella's cultural transformation emphasis."
  },

  uber: {
    name: "Uber",
    category: "Big Tech",
    interviewStyle: "Fast-paced, practical problem solving. Technical interviews emphasize real-world systems (geospatial, real-time, distributed). Strong emphasis on execution speed and working with large-scale data.",
    rounds: ["Recruiter Screen", "Technical Phone Screen", "Onsite: 4 interviews (coding x2, system design, behavioral)"],
    questionPatterns: {
      technical: [
        "Design a ride matching algorithm that minimizes wait time",
        "Implement geohashing for efficient location lookups",
        "How would you detect and prevent fraud in a ride-hailing platform?",
        "Design a surge pricing algorithm",
        "Implement a concurrent job scheduler"
      ],
      behavioral: [
        "Tell me about a time you shipped something under extreme time pressure",
        "Describe a situation where you had to make a tough trade-off",
        "How do you handle conflicting priorities across teams?",
        "Tell me about a time you improved a process significantly"
      ],
      systemDesign: [
        "Design Uber's real-time driver location tracking system",
        "Design the Uber Eats order and delivery matching system",
        "Design a dynamic pricing system for peak demand",
        "Design Uber's trip estimation and routing service"
      ]
    },
    evaluationCriteria: ["Technical depth", "Speed of execution", "Problem-solving under constraints", "Data-driven thinking"],
    commonTopics: ["geospatial algorithms", "real-time systems", "distributed databases", "pricing algorithms", "microservices"]
  },

  airbnb: {
    name: "Airbnb",
    category: "Big Tech",
    interviewStyle: "Strong emphasis on core values and belonging. Technical interviews include a cross-functional exercise. Known for the 'Core Values' interview — a dedicated round assessing culture fit against their 4 core values.",
    rounds: ["Recruiter Screen", "Technical Phone Screen", "Onsite: Coding", "Onsite: System Design", "Onsite: Cross-functional", "Onsite: Core Values"],
    questionPatterns: {
      technical: [
        "Design a search ranking system for vacation rentals",
        "Implement a calendar availability system with conflict detection",
        "Design a fraud detection system for bookings",
        "How would you build a dynamic pricing model for listings?"
      ],
      behavioral: [
        "Tell me about a time you championed belonging or inclusion",
        "Describe a situation where you were a 'cereal entrepreneur' — resourceful and scrappy",
        "Tell me about when you embraced the adventure of a challenge",
        "How do you make sure every stakeholder is heard?",
        "Describe a time you simplified something that was unnecessarily complex"
      ],
      systemDesign: [
        "Design Airbnb's search and booking system",
        "Design a messaging system between hosts and guests",
        "Design Airbnb Experiences' real-time availability system"
      ]
    },
    evaluationCriteria: ["Champion the Mission", "Be a Host (empathy)", "Embrace the Adventure", "Be a Cereal Entrepreneur (scrappy)"],
    commonTopics: ["search ranking", "marketplace design", "trust & safety", "pricing algorithms", "availability systems"],
    culturalFramework: "Airbnb's 4 Core Values: Champion the Mission, Be a Host, Embrace the Adventure, Be a Cereal Entrepreneur. The dedicated 'Core Values' interview round is a pass/fail gate."
  },

  stripe: {
    name: "Stripe",
    category: "Big Tech",
    interviewStyle: "Bug-finding and code review are unique to Stripe interviews. Heavy emphasis on writing clean, production-quality code. Deeply collaborative culture — they want clear communicators who can explain their thinking.",
    rounds: ["Recruiter Screen", "Coding Phone Screen (bug squash)", "Onsite: Integration/API Design", "Onsite: System Design", "Onsite: Debugging", "Onsite: Manager/Culture"],
    questionPatterns: {
      technical: [
        "Here's a buggy payment processing function — find and fix the bugs",
        "Design a REST API for a subscription billing system",
        "Implement an idempotency layer for payment retries",
        "How would you design a distributed ledger for financial transactions?",
        "Write a function to validate and process credit card transactions"
      ],
      behavioral: [
        "Tell me about a time you built something from scratch with ambiguous requirements",
        "How do you think about API design and developer experience?",
        "Describe a complex system you debugged — walk me through your process",
        "What's the hardest technical problem you've solved?"
      ],
      systemDesign: [
        "Design Stripe's payment processing pipeline",
        "Design a real-time fraud detection system for transactions",
        "Design an invoicing system that handles multiple currencies",
        "Design a webhook delivery system with guaranteed delivery"
      ]
    },
    evaluationCriteria: ["Code quality and clarity", "Debugging skill", "API design sensibility", "Clear communication", "Attention to edge cases"],
    commonTopics: ["payments", "distributed transactions", "API design", "idempotency", "financial systems", "debugging"]
  },

  tesla: {
    name: "Tesla",
    category: "Big Tech",
    interviewStyle: "Highly technical, domain-specific interviews. Elon Musk's influence means first-principles thinking is valued. Expect rapid-fire technical questions and real-world engineering problems. Fast-moving, high-intensity culture.",
    rounds: ["Recruiter Screen", "Technical Phone Screen", "Onsite: 3-5 interviews (deep technical + cultural)", "Hiring Manager Final"],
    questionPatterns: {
      technical: [
        "How would you optimize battery management for an EV fleet?",
        "Design an autopilot decision-making system for edge cases",
        "Implement a real-time sensor fusion algorithm",
        "How would you reduce manufacturing defects using ML?",
        "Design a charging station network optimizer"
      ],
      behavioral: [
        "What's the hardest problem you've ever solved from first principles?",
        "Tell me about a time you had to work at an extremely fast pace",
        "How do you handle being wrong? Give a specific example",
        "Describe a time you challenged a conventional approach"
      ],
      systemDesign: [
        "Design Tesla's over-the-air update system",
        "Design a fleet management system for autonomous vehicles",
        "Design the Supercharger network load balancing system"
      ]
    },
    evaluationCriteria: ["First-principles thinking", "Technical depth", "Speed and intensity", "Problem-solving under ambiguity", "Mission alignment"],
    commonTopics: ["embedded systems", "ML/AI", "manufacturing", "real-time systems", "optimization", "physics"]
  },

  salesforce: {
    name: "Salesforce",
    category: "Big Tech",
    interviewStyle: "Values-driven interviews based on the Ohana culture. Technical interviews test CRM domain knowledge and cloud architecture. Strong emphasis on equality, trust, and customer success.",
    rounds: ["Recruiter Screen", "Hiring Manager Interview", "Technical Assessment", "Panel Interview (3-4 people)", "Executive Interview"],
    questionPatterns: {
      technical: [
        "Design a multi-tenant CRM architecture",
        "How would you handle data migration for an enterprise client?",
        "Design an automation workflow engine",
        "How would you build a scalable API for third-party integrations?",
        "Implement a permission system with role-based access control"
      ],
      behavioral: [
        "Tell me about a time you prioritized customer success over short-term gains",
        "How do you build trust with stakeholders who are skeptical?",
        "Describe a time you championed equality or inclusion",
        "Tell me about your approach to innovation — give a concrete example",
        "How do you stay motivated during a long, complex project?"
      ],
      systemDesign: [
        "Design a real-time dashboard for sales pipeline analytics",
        "Design a platform that supports customizable business logic per tenant",
        "Design a scalable email campaign system"
      ]
    },
    evaluationCriteria: ["Trust", "Customer Success", "Innovation", "Equality", "Sustainability"],
    commonTopics: ["CRM", "multi-tenancy", "cloud architecture", "API design", "enterprise software"],
    culturalFramework: "Salesforce Ohana Culture: Trust, Customer Success, Innovation, Equality, Sustainability. 'Ohana' means family — they look for people who care about community and making a positive impact."
  },

  /* ================================================================
     TOP CONSULTING
     ================================================================ */

  mckinsey: {
    name: "McKinsey & Company",
    category: "Consulting",
    interviewStyle: "The gold standard for case interviews. Uses the McKinsey Problem Solving Test (PST) or Solve Game. Case interviews test structured problem-solving with MECE frameworks. PEI (Personal Experience Interview) tests leadership dimensions.",
    rounds: ["Online Assessment (Solve Game)", "First Round: 2 interviews (1 case + 1 PEI each)", "Final Round: 2-3 interviews with Partners/APs"],
    questionPatterns: {
      case: [
        "Our client, a European airline, has seen profits decline by 30% over 3 years — diagnose and recommend",
        "A pharmaceutical company is considering entering the generic drugs market — should they?",
        "A private equity firm wants to evaluate whether to acquire a chain of urgent care clinics",
        "How would you help a national retailer respond to the threat of e-commerce?",
        "Your client, a mid-size bank, wants to double revenue in 5 years — develop a strategy"
      ],
      behavioral: [
        "Tell me about a time you led a team through a significant challenge (Leadership)",
        "Describe a time you created impact beyond what was expected (Entrepreneurial Drive)",
        "Tell me about a time you navigated a complex personal interaction (Personal Impact)",
        "Give an example of when you had to influence someone who was initially resistant"
      ],
      estimation: [
        "How many golf balls fit in a school bus?",
        "Estimate the annual revenue of all coffee shops in London",
        "How would you estimate the number of gas stations in the United States?"
      ]
    },
    evaluationCriteria: ["Problem structuring (MECE)", "Analytical rigor", "Synthesis and recommendation", "Communication clarity", "Leadership (PEI dimensions)"],
    commonTopics: ["profitability", "market entry", "M&A", "growth strategy", "operational improvement", "market sizing"],
    culturalFramework: "McKinsey PEI dimensions: Entrepreneurial Drive (creating change from scratch), Inclusive Leadership (leading diverse teams), Personal Impact (resolving conflicts and influencing), Courageous Change (challenging the status quo)."
  },

  bcg: {
    name: "BCG (Boston Consulting Group)",
    category: "Consulting",
    interviewStyle: "Case interviews with an emphasis on creativity and insight, not just structure. BCG cases are more open-ended than McKinsey — they want to see original thinking. Uses 'BCG Casey' chatbot for practice. Behavioral assesses 'BCG People' qualities.",
    rounds: ["Online Case (BCG Casey chatbot or written)", "First Round: 2 interviews (case + fit)", "Final Round: 2-3 interviews with Partners"],
    questionPatterns: {
      case: [
        "A streaming service is losing subscribers to competitors — develop a retention strategy",
        "Should a luxury automaker launch an affordable electric vehicle line?",
        "A hospital system wants to reduce ER wait times while cutting costs — advise them",
        "Your client, a food delivery platform, wants to expand to 10 new countries — prioritize which ones"
      ],
      behavioral: [
        "Why consulting? Why BCG specifically?",
        "Tell me about a time you came up with a creative solution to a difficult problem",
        "Describe your most impactful leadership experience",
        "Tell me about a time you had to adapt your communication style for a different audience",
        "What's the most interesting thing you've learned recently?"
      ],
      estimation: [
        "How would you estimate the market size for electric scooters in a major city?",
        "Estimate how many piano tuners are in Chicago"
      ]
    },
    evaluationCriteria: ["Creative problem-solving", "Structured thinking with flexibility", "Business judgment", "Communication and presence", "Intellectual curiosity"],
    commonTopics: ["digital transformation", "sustainability", "growth strategy", "innovation", "operations"],
    culturalFramework: "BCG values intellectual curiosity and creative problem-solving. They want people who can go beyond frameworks to generate genuine business insight. 'BCG People' are collaborative, curious, and impactful."
  },

  bain: {
    name: "Bain & Company",
    category: "Consulting",
    interviewStyle: "Case interviews with strong emphasis on data interpretation and math. Known for the 'Bain Online Test' (BOT) which tests chart/data interpretation. Fit interviews assess 'Bainee' qualities — collaborative, results-oriented, passionate.",
    rounds: ["Online Test (data/chart interpretation)", "First Round: 2 interviews (case + experience each)", "Final Round: 2-3 interviews with Partners"],
    questionPatterns: {
      case: [
        "A private equity client is evaluating a potential acquisition in the healthcare sector — assess the deal",
        "Your client's customer satisfaction scores have dropped 25% — diagnose the root cause",
        "A consumer goods company wants to enter the Indian market — develop a go-to-market strategy",
        "How should a traditional bank respond to the rise of neobanks?"
      ],
      behavioral: [
        "Why Bain over McKinsey or BCG?",
        "Tell me about a result you're most proud of",
        "Describe a time you worked with a team to achieve something difficult",
        "Tell me about a time you had to persuade a group to change direction",
        "What's your biggest non-academic achievement?"
      ],
      estimation: [
        "Estimate the market size for pet insurance in the US",
        "How would you calculate the break-even point for a new coffee shop?"
      ]
    },
    evaluationCriteria: ["Quantitative rigor", "Data-driven insights", "Results orientation", "Teamwork", "Passion and energy"],
    commonTopics: ["private equity due diligence", "customer strategy", "operational improvement", "M&A", "performance improvement"],
    culturalFramework: "Bain's culture: 'A Bainee' is results-oriented, collaborative, passionate, and fun. Strong emphasis on true partnership with clients. 'Bainies don't let Bainies fail' — deeply supportive culture."
  }
};

/* ---- Helper: get all companies in a specific category ---- */
export function getCompaniesByCategory(category: CompanyCategory): CompanyProfile[] {
  return Object.values(COMPANY_PROFILES).filter(c => c.category === category);
}

/* ---- Helper: get a company profile by slug ---- */
export function getCompanyProfile(slug: string): CompanyProfile | null {
  return COMPANY_PROFILES[slug] || null;
}

/* ---- Helper: get all company slugs in a category (for the dropdown) ---- */
export function getCompanySlugsForCategory(category: CompanyCategory): { slug: string; name: string }[] {
  return Object.entries(COMPANY_PROFILES)
    .filter(([, profile]) => profile.category === category)
    .map(([slug, profile]) => ({ slug, name: profile.name }));
}

/* ---- Helper: build the prompt injection block for a company ---- */
/* This formats the company profile into a string that gets injected into the AI prompt */
export function buildCompanyPromptBlock(profile: CompanyProfile): string {
  const sections: string[] = [];

  sections.push(`## TARGET COMPANY: ${profile.name}`);
  sections.push(`Interview Style: ${profile.interviewStyle}`);
  sections.push(`Typical Interview Rounds: ${profile.rounds.join(" → ")}`);

  if (profile.culturalFramework) {
    sections.push(`Cultural Framework: ${profile.culturalFramework}`);
  }

  sections.push(`Evaluation Criteria: ${profile.evaluationCriteria.join(", ")}`);

  sections.push(`\nREAL INTERVIEW QUESTIONS asked at ${profile.name} (use as inspiration — adapt to the candidate's role and level):`);
  for (const [type, questions] of Object.entries(profile.questionPatterns)) {
    sections.push(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
    for (const q of questions) {
      sections.push(`  - ${q}`);
    }
  }

  sections.push(`\nKey Topics ${profile.name} frequently tests: ${profile.commonTopics.join(", ")}`);

  sections.push(`\nCOMPANY-SPECIFIC RULES:
- Model your questions after the real examples above — match ${profile.name}'s actual interview intensity and style
- Use ${profile.name}'s evaluation criteria to shape what you probe for
- Reference their actual interview process naturally (e.g., "In a typical ${profile.name} ${profile.rounds[profile.rounds.length - 1]}, they'd want to know...")
- If ${profile.name} has a cultural framework or values, test alignment to it
- Adapt the real questions to the candidate's specific role and experience level — don't ask a marketing candidate coding questions just because the company is technical`);

  return sections.join("\n");
}
