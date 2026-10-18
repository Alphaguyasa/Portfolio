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

// Nav entries for sections that may be hidden are added at the bottom of this
// file, once the testimonials and notes data are known.
const baseNavLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
];

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
    body: "Android apps built to Play policy, with signed, R8-minified release builds — including one that reads mobile-money notifications with no network permission at all.",
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

/** Biographical figures GitHub cannot verify; confirmed by Alpha on 2026-10-18. */
export const bioStats = [
  { value: "2+", label: "Years Full-Stack" },
  { value: "1+", label: "Year in AI" },
] as const;

/**
 * The /about page. No biographical figures here: those wait on Alpha's confirmation
 * (see bioStats). The method's counts come from the sync via methodEvidence().
 */
export const aboutPage = {
  intro: [
    "I'm Alpha, a full-stack and Android developer in Addis Ababa, Ethiopia. Most of what I build targets one constraint: connectivity you cannot count on.",
    "That means offline-first web apps that keep working through a blackout, Android apps that need no network at all, and retrieval systems that cite their sources or refuse to answer.",
  ],
  method: [
    {
      title: "Plan in writing",
      body: "Work starts from a written roadmap with priorities. Each change is scoped before it is built: what changes, why, and how to test it.",
    },
    {
      title: "Document the rules",
      body: "Each repo records its architecture, its commands, and the rules that must never break, so the next change starts from the same written context.",
    },
    {
      title: "Test every change",
      body: "Changes ship with the tests that prove them. A change is done when the tests pass, not when it looks right.",
    },
    {
      title: "CI as the gatekeeper",
      body: "A GitHub Actions workflow runs the checks. The latest result on each repo's default branch is shown on its project page, passing or failing.",
    },
  ],
  thisSite:
    "This portfolio is built the same way. A scheduled job reads my public repos read-only and updates the project data; a CI check fails the build when any claim on this site has no matching quote in the repo it describes. The site's own repo is private, so this is a description rather than a link.",
} as const;

/**
 * No skill percentages: they are not measurable. The tile shows how many listed
 * projects use the tool instead, counted from data/projects.json via `matches`.
 */
export const tools = [
  { name: "Next.js", logo: "nextjs", matches: ["Next.js"] },
  { name: "React", logo: "react", matches: ["React"] },
  { name: "TypeScript", logo: "typescript", matches: ["TypeScript"] },
  { name: "Flutter", logo: "flutter", matches: ["Flutter"] },
  { name: "Kotlin", logo: "kotlin", matches: ["Kotlin"] },
  { name: "PostgreSQL", logo: "postgresql", matches: ["PostgreSQL", "Postgres"] },
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
    subtitle: "Focal Person, Data Contribution (contractor)",
    pill: "Current",
  },
  {
    title: "Independent",
    subtitle: "Full-Stack Engineer",
    pill: "2+ Years",
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
    body: "Focal person for data contribution at Leyo as a contractor, for over a year and ongoing, owning quality and throughput for the contributor pipeline.",
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
  { tier: "Hourly", price: "$20", unit: "/ Hour", included: 3 },
  { tier: "Monthly", price: "$1,500", unit: "/ Month", included: 5 },
  { tier: "Quarterly", price: "$4,000", unit: "/ Qtr.", included: 7 },
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

/**
 * Only quotes with `confirmed: true` are shown: the person approved the exact
 * wording and the label is accurate. These two were drafted for layout; both are
 * Alpha's university classmates and teammates and have not approved the wording
 * (Alpha, 2026-10-18), so the section stays hidden. If they approve, label them
 * as teammates, never clients.
 */
export const testimonials: {
  name: string;
  role: string;
  photo: string;
  quote: string;
  confirmed: boolean;
}[] = [
  {
    name: "Melkias Teshome",
    role: "University classmate and teammate",
    photo: "/assets/testimonial-melkias.jpeg",
    quote:
      "Alpha thinks about the failure case first. On the offline-first work he had the sync path designed before a line of UI existed, and that is why it never lost a sale in testing.",
    confirmed: false,
  },
  {
    name: "Abdi Fekeda",
    role: "University classmate and teammate",
    photo: "/assets/testimonial-abdi.jpg",
    quote:
      "We built HU News together. He took the hardest screen, documented every decision, and reviewed the rest of our code without being asked. An easy person to ship with.",
    confirmed: false,
  },
];

/**
 * Planned posts. A note is shown only once it is published (`href` set); until
 * then the section and its nav link are hidden rather than showing unlinked cards.
 */
export const notes: { tags: string[]; title: string; excerpt: string; href: string | null }[] = [
  {
    tags: ["Offline-First", "Sync"],
    title: "Sync Movements, Never Quantities",
    excerpt:
      "Why two offline tills that both sell the last case of water can only stay correct if you append deltas instead of writing totals.",
    href: null,
  },
  {
    tags: ["Android", "Policy"],
    title: "Reading Payments Without READ_SMS",
    excerpt:
      "Play won’t grant restricted SMS permissions to a finance app. What a notification listener buys you, and what it costs.",
    href: null,
  },
  {
    tags: ["AI", "Evaluation"],
    title: "What a 91-Question Eval Can’t Tell You",
    excerpt:
      "Three of four retrieval experiments did nothing. The most useful finding came from the breakdown nobody reads.",
    href: null,
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

export const confirmedTestimonials = testimonials.filter((t) => t.confirmed);
export const publishedNotes = notes.filter((n) => n.href !== null);

export const navLinks = [
  ...baseNavLinks,
  ...(publishedNotes.length ? [{ label: "Blogs", href: "#blogs" }] : []),
  ...(confirmedTestimonials.length ? [{ label: "Testimonials", href: "#testimonials" }] : []),
];

export const footerNav = [
  ...baseNavLinks,
  ...(publishedNotes.length ? [{ label: "Notes", href: "#blogs" }] : []),
];
