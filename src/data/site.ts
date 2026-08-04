/**
 * Every piece of page content lives here so the section components stay layout-only.
 * Copy is carried over verbatim from the approved design handoff.
 */

export const site = {
  url: "https://alpha-guyasa-portfolio.vercel.app",
  email: "alphaguyasa@gmail.com",
  linkedin: "https://www.linkedin.com/in/alpha-guyasa-a2b567328",
  github: "https://github.com/Alphaguyasa",
  leetcode: "https://leetcode.com/u/alphaguyasa123CS/",
  leetcodeHandle: "alphaguyasa123CS",
  location: "Addis Ababa, Ethiopia",
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#blogs" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const heroChips = [
  { label: "Next.js", tone: "ink" },
  { label: "Flutter", tone: "accent" },
  { label: "star", tone: "star" },
  { label: "Kotlin & Compose", tone: "ink" },
  { label: "AI Retrieval", tone: "accent" },
  { label: "Offline-First", tone: "ink" },
] as const;

export const marquees = {
  disciplines: [
    "Full-Stack Engineering",
    "Mobile Apps",
    "AI Retrieval",
    "Offline-First",
    "Security",
  ],
  stack: ["Kotlin", "Next.js", "Flutter", "PostgreSQL", "Motoko"],
  projects: [
    "Offline-First POS",
    "Cited PDF Q&A",
    "Mobile-Money Ledger",
    "Vulnerability Scanner",
  ],
  availability: [
    "Available for Work",
    "Addis Ababa",
    "Remote Friendly",
    "Let's Build",
  ],
  disciplinesShort: [
    "Full-Stack Engineering",
    "Mobile Apps",
    "AI Retrieval",
    "Offline-First",
  ],
  closing: ["Let's Work Together", "Alpha Guyasa", "Full Stack Engineer"],
} as const;

export type Service = {
  title: string;
  tags: string[];
  body: string;
  image?: { src: string; alt: string };
};

export const services: Service[] = [
  {
    title: "Full-Stack Web Development",
    tags: [
      "Next.js 15 & React",
      "TypeScript strict",
      "Postgres & Supabase",
      "Fastify APIs",
    ],
    body: "Product-grade web apps end to end: schema, API, auth, row-level security and a UI that holds up on a cheap tablet.",
  },
  {
    title: "Mobile App Development",
    tags: [
      "Kotlin & Jetpack Compose",
      "Flutter",
      "Room & WorkManager",
      "Progressive Web Apps",
    ],
    body: "Android apps built to Play policy, shipped signed and minified — including one that reads mobile-money notifications with no network permission at all.",
    image: {
      src: "/assets/mobile-service.png",
      alt: "Two Mezgeb Android screens: the teach-a-rule flow and the daily ledger view",
    },
  },
  {
    title: "AI & Retrieval Systems",
    tags: [
      "Hybrid retrieval (pgvector + FTS)",
      "Grounded citations",
      "Eval harnesses",
    ],
    body: "Systems that cite their sources and refuse when the documents don’t cover the question — measured against a human-reviewed golden set, not a vibe check.",
  },
  {
    title: "Offline-First & Sync Architecture",
    tags: ["IndexedDB / Dexie", "Append-only movements", "Conflict-free merge"],
    body: "Never sync quantities, sync movements. Two tills, both offline, both selling the last unit — and the arithmetic still comes out right.",
  },
  {
    title: "Security & Vulnerability Assessment",
    tags: ["OWASP ZAP", "Nuclei & Nikto", "Dockerised scanners"],
    body: "Automated scanning with a dashboard your team will actually read — findings tracked, categorised and reported.",
  },
];

export const stats = [
  { value: "8", label: "Projects Shipped" },
  { value: "2+", label: "Years Full-Stack" },
  { value: "1+", label: "Year in AI" },
] as const;

export const tools = [
  { name: "Next.js", pct: "95%", logo: "nextjs" },
  { name: "React", pct: "92%", logo: "react" },
  { name: "TypeScript", pct: "90%", logo: "typescript" },
  { name: "Flutter", pct: "88%", logo: "flutter" },
  { name: "Kotlin", pct: "85%", logo: "kotlin" },
  { name: "PostgreSQL", pct: "87%", logo: "postgresql" },
] as const;

export type TimelineRow = {
  title: string;
  subtitle: string;
  pill: string;
  pillTone?: "ink" | "accent";
};

export const education: TimelineRow[] = [
  {
    title: "Haramaya University",
    subtitle: "BSc in Computer Science",
    pill: "2023 – 2026",
  },
  {
    title: "Final Year Project",
    subtitle: "Web Vulnerability Scanner",
    pill: "2026",
  },
  {
    title: "University CTF",
    subtitle: "1st place, HU × INSA",
    pill: "1st Place",
    pillTone: "accent",
  },
];

export const work: TimelineRow[] = [
  {
    title: "Cyber Security Club",
    subtitle: "Former Head & Chairperson, Haramaya University",
    pill: "Past",
  },
  {
    title: "Leyo",
    subtitle: "Focal Person, Data Contribution",
    pill: "1 Year",
  },
  {
    title: "Independent",
    subtitle: "Full-Stack Engineer",
    pill: "2+ Years",
  },
];

export type Project = {
  name: string;
  descriptor: string;
  body: string;
  specs: { label: string; value: string }[];
  href: string;
  image: { src: string; alt: string };
};

export const featuredProjects: Project[] = [
  {
    name: "Mezgeb",
    descriptor: "Offline Mobile-Money Ledger for Ethiopian Shops",
    body: "Reads mobile-money payment notifications, parses them into a ledger and tracks who owes the shop. No internet permission, no account. When no rule matches a message, the shopkeeper teaches one by highlighting the amount.",
    specs: [
      { label: "Stack", value: "Kotlin, Compose, Room" },
      { label: "Highlight", value: "Rule induction from real messages" },
      { label: "Tests", value: "375 unit tests, 3.07 MB APK" },
    ],
    href: "https://github.com/Alphaguyasa/Mezgeb",
    image: {
      src: "/assets/mezgeb-showcase.png",
      alt: "Three Mezgeb Android screens showing the daily view, ledger and reports",
    },
  },
  {
    name: "Suq",
    descriptor: "Offline-First POS & Inventory",
    body: "A till that keeps selling when the internet and the power go out, then reconciles cleanly. Amharic-first, ETB pricing, 80mm thermal receipts. Stock movements sync, never quantities — so two offline tablets never overwrite each other.",
    specs: [
      { label: "Stack", value: "Next.js 15, Dexie, Supabase" },
      { label: "Highlight", value: "Sub-100ms sale, fully offline" },
      { label: "Runtime cost", value: "Zero per transaction" },
    ],
    href: "https://github.com/Alphaguyasa/Suq",
    image: { src: "/assets/proj-suq.png", alt: "Suq point-of-sale dashboard" },
  },
  {
    name: "DocSearch",
    descriptor: "Cited Answers From Your PDFs",
    body: "Ask a question across a PDF corpus and get a streamed answer where every claim carries an inline citation back to its source chunk — and a plain refusal when the documents don’t cover it.",
    specs: [
      { label: "Stack", value: "Next.js, pgvector, Voyage" },
      { label: "Retrieval", value: "Hybrid vector + keyword, RRF" },
      { label: "Evaluation", value: "91-question golden set" },
    ],
    href: "https://github.com/Alphaguyasa/docsearch",
    image: {
      src: "/assets/proj-docsearch.png",
      alt: "DocSearch answer panel with inline citations",
    },
  },
  {
    name: "Security Scanner",
    descriptor: "Web Vulnerability Detection System",
    body: "Automated scanning built on OWASP ZAP, Nuclei and Nikto behind one dashboard: JWT auth, real-time results, and vulnerability tracking with severity and history. Fully Dockerised.",
    specs: [
      { label: "Stack", value: "Next.js, Fastify, Postgres" },
      { label: "Scanners", value: "ZAP, Nuclei, Nikto" },
      { label: "Context", value: "Final year project, team repo" },
    ],
    href: "https://github.com/vulnerability-scanner-website/Final-year-project",
    image: {
      src: "/assets/proj-scanner.png",
      alt: "Vulnerability scanner findings dashboard",
    },
  },
  {
    name: "HU News",
    descriptor: "Haramaya University News App",
    body: "A Flutter app delivering live university news over the WordPress REST API: featured carousel, full article rendering, reactions, keyword-highlighted search, YouTube playback and persistent dark mode.",
    specs: [
      { label: "Stack", value: "Flutter, Dart, WordPress REST" },
      { label: "Role", value: "Home screen & app architecture" },
      { label: "Release", value: "Signed production APK" },
    ],
    href: "https://github.com/Alphaguyasa/HUnews",
    image: {
      src: "/assets/proj-hunews.png",
      alt: "Three HU News app screens",
    },
  },
];

export const secondaryProjects: Project[] = [
  {
    name: "Alpha Coin",
    descriptor: "ICP Token Dashboard",
    body: "A decentralised token dashboard on the Internet Computer with Internet Identity auth: check balance, claim tokens once per principal, transfer to another principal.",
    specs: [
      { label: "Stack", value: "Motoko, Next.js 15" },
      { label: "Auth", value: "Internet Identity" },
    ],
    href: "https://github.com/Alphaguyasa/Alpha-digital-coin",
    image: {
      src: "/assets/proj-alphacoin.png",
      alt: "Alpha Coin token dashboard",
    },
  },
  {
    name: "NullChat",
    descriptor: "Chat With No Network",
    body: "An Android app that lets people exchange messages and photos with no network connection at all — built for blackouts, dead zones and shutdowns.",
    specs: [
      { label: "Platform", value: "Android" },
      { label: "Transport", value: "Peer-to-peer, offline" },
    ],
    href: "https://github.com/Alphaguyasa/NullChat",
    image: { src: "/assets/proj-nullchat.png", alt: "Two NullChat app screens" },
  },
];

export const recognitions = [
  {
    icon: "star" as const,
    tone: "accent" as const,
    title: "1st Place — University CTF",
    body: "First at university level in the capture-the-flag competition run by Haramaya University in collaboration with INSA.",
  },
  {
    icon: "bulb" as const,
    tone: "ink" as const,
    title: "Led the Cyber Security Club",
    body: "Served as head and chairperson of the Cyber Security Club at Haramaya University, running training and competition prep for members.",
  },
  {
    icon: "person" as const,
    tone: "ink" as const,
    title: "Focal Person — Leyo",
    body: "Led data-contribution coordination at Leyo for a year, owning quality and throughput for the contributor pipeline.",
  },
];

export const pricingFeatures = [
  "Full-stack web development",
  "Mobile app development",
  "Code review & debugging",
  "Offline-first sync architecture",
  "AI retrieval integration",
  "Security assessment",
  "Ongoing maintenance",
] as const;

export const pricingTiers = [
  { tier: "Hourly", price: "$15", unit: "/ Hour", included: 3 },
  { tier: "Monthly", price: "$1,200", unit: "/ Month", included: 5 },
  { tier: "Quarterly", price: "$3,200", unit: "/ Qtr.", included: 7 },
] as const;

export const interestOptions = [
  "Full-Stack Web Development",
  "Mobile App Development",
  "AI & Retrieval Systems",
  "Offline-First Architecture",
  "Security Assessment",
] as const;

export const budgetOptions = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
] as const;

export const testimonials = [
  {
    name: "Melkias Teshome",
    role: "Full Stack Developer",
    photo: "/assets/testimonial-melkias.jpeg",
    quote:
      "Alpha thinks about the failure case first. On the offline-first work he had the sync path designed before a line of UI existed, and that is why it never lost a sale in testing.",
  },
  {
    name: "Abdi Fekeda",
    role: "Full Stack Developer",
    photo: "/assets/testimonial-abdi.jpg",
    quote:
      "We built HU News together. He took the hardest screen, documented every decision, and reviewed the rest of our code without being asked. An easy person to ship with.",
  },
];

export const notes = [
  {
    tags: ["Offline-First", "Sync"],
    title: "Sync Movements, Never Quantities",
    excerpt:
      "Why two offline tills that both sell the last case of water can only stay correct if you append deltas instead of writing totals.",
    image: {
      src: "/assets/note-sync.png",
      alt: "Abstract diagram of stock deltas over time",
    },
  },
  {
    tags: ["Android", "Policy"],
    title: "Reading Payments Without READ_SMS",
    excerpt:
      "Play won’t grant restricted SMS permissions to a finance app. What a notification listener buys you, and what it costs.",
    image: {
      src: "/assets/note-sms.png",
      alt: "Abstract shield and checkmark illustration",
    },
  },
  {
    tags: ["AI", "Evaluation"],
    title: "What a 91-Question Eval Can’t Tell You",
    excerpt:
      "Three of four retrieval experiments did nothing. The most useful finding came from the breakdown nobody reads.",
    image: {
      src: "/assets/note-eval.png",
      alt: "Abstract chart of evaluation results",
    },
  },
];

export const faqs = [
  {
    q: "Are you available for freelance or contract work?",
    a: "Yes. I take on hourly, monthly and quarterly engagements, remote or in Addis Ababa.",
  },
  {
    q: "What kind of projects do you specialise in?",
    a: "Systems that have to work in poor connectivity: offline-first point of sale, mobile-money ledgers, Android apps built to Play policy, and retrieval systems that cite their sources. Plus web security scanning.",
  },
  {
    q: "Which tools do you use day to day?",
    a: "Next.js and TypeScript on the web, Kotlin with Jetpack Compose and Flutter on mobile, Postgres and Supabase for data, Docker for anything that has to be reproducible.",
  },
  {
    q: "Can I see the code behind these projects?",
    a: "Every project here links to its repository, and most carry a written architecture document explaining the decisions and their trade-offs.",
  },
  {
    q: "How do you handle testing and quality?",
    a: "Tests on the parts where a bug costs money — 375 unit tests on Mezgeb, a multi-device sync suite on Suq, and an eval harness with a validated judge on DocSearch.",
  },
  {
    q: "Can I download your CV?",
    a: "Email me at alphaguyasa@gmail.com and I’ll send it over, or reach me on LinkedIn.",
  },
];

export const footerNav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Notes", href: "#blogs" },
] as const;
