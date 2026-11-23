/**
 * Every piece of page content lives here so the section components stay layout-only.
 * Copy is carried over verbatim from the approved design handoff.
 */

import certificatesData from "../../data/certificates.json";

export const site = {
  url: "https://alpha-guy.vercel.app",
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
  { label: "Services", href: "/services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Security", href: "/security" },
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

export type ServicePackage = {
  /** Used in /?package=<id>#contact to prefill the contact form. */
  id: "web-app" | "android-app" | "security-review";
  title: string;
  summary: string;
  scope: string[];
  /** Must be one of interestOptions: the contact form preselects it. */
  interest: (typeof interestOptions)[number];
  /** Project slugs from data/projects.json that show this kind of work. */
  proof: string[];
  /** A page on this site with more of the proof. */
  more?: { label: string; href: string };
};

/**
 * The /services page. Alpha's wording (decision log A20, 2026-11-18): every package is
 * "Ask for a quote", with no prices and no fixed timelines. No numbers here: a figure
 * on this page would need a quote source like every project claim.
 */
export const servicesPage = {
  intro:
    "Three kinds of work I take on, each backed by projects you can open and check. Every project is quoted after a short call, so the price fits what you actually need.",
  price: "Ask for a quote",
  timeline: "Agreed per project after a short call.",
  packages: [
    {
      id: "web-app",
      title: "Business web app",
      summary:
        "A web app your staff use every day to run the business, built for cheap phones and unreliable internet.",
      scope: [
        "Login and staff roles",
        "Sales, stock and credit records",
        "Receipts",
        "Reports with CSV export",
        "Amharic, Afaan Oromo and English",
        "Works on cheap phones and offline",
      ],
      interest: "Full-Stack Web Development",
      proof: ["galmee-pharmacy", "galmee-wholesale", "galmee-clinic", "suq"],
    },
    {
      id: "android-app",
      title: "Offline Android app",
      summary:
        "An Android app that keeps working without internet and syncs when the connection comes back.",
      scope: [
        "Works without internet",
        "Syncs later, when a connection is available",
        "In the local language",
      ],
      interest: "Mobile App Development",
      proof: ["mezgeb", "meret", "nullchat"],
    },
    {
      id: "security-review",
      title: "Security review",
      summary:
        "A review of who can read and change what in your app, with tested fixes rather than a list of warnings.",
      scope: [
        "Database access rules (RLS) and permission checks",
        "Web app security testing",
        "A written report with fixes",
      ],
      interest: "Security Assessment",
      proof: ["security-scanner", "galmee-pharmacy", "nullchat"],
      more: { label: "Threat models and hardening work", href: "/security" },
    },
  ] satisfies ServicePackage[],
};

export type SecurityCase = {
  /** Project slug in data/projects.json; its repo's synced docs back the quotes. */
  slug: string;
  heading: string;
  summary: string;
  points: string[];
  /** What is still open or deliberately out of scope, stated as plainly as the rest. */
  limits: string;
  /** The repo document the case comes from, relative to the repo root. */
  doc: { label: string; path: string };
  /** Verbatim quotes from the repo's synced docs; every number shown must be in one. */
  facts: { path: string; quote: string }[];
};

/** The /security page: threat models and hardening work gathered from three repos. */
export const securityPage = {
  intro:
    "Security work from my own projects, each with what it protects, from whom, and what is still open. The full write-ups are in the repos, linked below.",
  cases: [
    {
      slug: "nullchat",
      heading: "A mesh of phones that do not trust each other",
      summary:
        "Any phone in range can send anything, relay or drop anything, and lie about its name. The security design says what the app protects, against whom, and what it does not.",
      points: [
        "Direct messages are protected from every phone that relays them, and anyone listening.",
        "Who sent a packet is protected from forgery by any other phone.",
        "Storage and battery are protected from floods and oversized or malformed packets from one modified phone.",
      ],
      limits:
        "Written down as open gaps: no forward secrecy, chat history in Google backup, and sender and recipient ids visible to every phone in range.",
      doc: { label: "Security design", path: "docs/SECURITY_DESIGN.md" },
      facts: [
        { path: "docs/SECURITY_DESIGN.md", quote: "Any phone in range can send anything, relay or drop anything, and lie about its name." },
        { path: "docs/SECURITY_DESIGN.md", quote: "Every phone that relays them, and anyone listening" },
        { path: "docs/SECURITY_DESIGN.md", quote: "Floods and oversized or malformed packets from one modified phone" },
        { path: "docs/SECURITY_DESIGN.md", quote: "No forward secrecy." },
      ],
    },
    {
      slug: "mezgeb",
      heading: "A finance app with no network access",
      summary:
        "Mezgeb handles payment messages, so it is built to keep them on the phone: no network permission at all, checked in the build rather than promised.",
      points: [
        "No INTERNET permission in either build, checked against the merged release manifest.",
        "Raw message bodies never leave the device and are never logged.",
        "Backups are AES-256-GCM with a PBKDF2-derived key. The passphrase is never stored.",
      ],
      limits:
        "The sideloaded build asks for read access to SMS for a one-time import; the Play build is checked to contain no SMS permission.",
      doc: { label: "README, privacy section", path: "README.md" },
      facts: [
        { path: "README.md", quote: "No `android.permission.INTERNET`, in either flavor." },
        { path: "README.md", quote: "verified against the merged release manifest" },
        { path: "README.md", quote: "Raw message bodies never leave the device and are never logged." },
        { path: "README.md", quote: "Backups are AES-256-GCM with a PBKDF2-derived key. The passphrase is never stored." },
        { path: "README.md", quote: "The merged `play` release manifest is checked to contain zero SMS permissions" },
      ],
    },
    {
      slug: "alpha-coin",
      heading: "A toy token reviewed as if real value depended on it",
      summary:
        "A weekend token project, reviewed later as if it were real: every finding was fixed or written down as a decision, and the threats are tracked in a threat model.",
      points: [
        "A double spend in transfer: other messages could run between reading a balance and updating it.",
        "A dashboard that showed the token as US dollars and advertised features that did not exist.",
        "Amounts went through JavaScript Number, so large values lost digits.",
      ],
      limits:
        "Frozen on purpose: it runs on a local replica only, has no price and is not an investment.",
      doc: { label: "Case study", path: "docs/CASE_STUDY.md" },
      facts: [
        { path: "docs/CASE_STUDY.md", quote: "every finding was fixed or written down as a decision" },
        { path: "docs/CASE_STUDY.md", quote: "Double spend in `transfer`" },
        { path: "docs/CASE_STUDY.md", quote: "The dashboard showed the token balance as **US dollars**" },
        { path: "docs/CASE_STUDY.md", quote: "None of it existed." },
        { path: "docs/CASE_STUDY.md", quote: "Amounts went through JavaScript `Number`, so large values lost digits" },
        { path: "docs/CASE_STUDY.md", quote: "It runs on a local replica only, has no price and is not an investment." },
      ],
    },
  ] satisfies SecurityCase[],
};

/** The package a /?package=<id> link asks for, or undefined for anything else. */
export function packageById(id: string | null | undefined) {
  return servicesPage.packages.find((pkg) => pkg.id === id);
}

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
    title: "Leyu",
    subtitle: "Focal Person, Data Contribution (contractor)",
    pill: "Current",
  },
  {
    title: "Independent",
    subtitle: "Full-Stack Engineer",
    pill: "2+ Years",
  },
];

/** Verifiable certificates; also listed in PORTFOLIO_COPY.md. */
export const certificates = certificatesData.certificates;

const certificateMonth = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Each claim was confirmed by Alpha (2026-10-18; certificates 2026-10-20). `sources`
 * are public links he supplied as proof; labels say only what each link is.
 */
export const recognitions: {
  icon: "star" | "bulb" | "person" | "cap";
  tone: "accent" | "ink";
  title: string;
  body: string;
  sources?: { label: string; href: string }[];
}[] = [
  {
    icon: "star",
    tone: "accent",
    title: "1st Place — University CTF",
    body: "First at university level in the capture-the-flag competition run by Haramaya University in collaboration with INSA.",
    sources: [
      { label: "INSA post: Cyber Security Month at Haramaya University", href: "https://t.me/insagovet/3068" },
      { label: "INSA photos from the event", href: "https://t.me/insagovet/3079" },
    ],
  },
  {
    icon: "bulb",
    tone: "ink",
    title: "Led the Cyber Security Club",
    body: "Served as head and chairperson of the Cyber Security Club at Haramaya University, running training and competition prep for members, and represented the campus, the club and the department in Bahir Dar.",
    sources: [{ label: "HU Cyber Club post", href: "https://t.me/HU_CYBER_CLUB/445" }],
  },
  {
    icon: "person",
    tone: "ink",
    title: "Focal Person — Leyu",
    body: "Focal person for data contribution at Leyu as a contractor, for over a year and ongoing, owning quality and throughput for the contributor pipeline.",
  },
  {
    icon: "cap",
    tone: "accent",
    title: "Udacity Nanodegree Certificates",
    body: `Completed two ${certificates[0].issuer} Nanodegree programs: ${certificates
      .map((c) => c.title)
      .join(" and ")}, ${certificateMonth(certificates[0].issued)}.`,
    sources: certificates.map((c) => ({
      label: `Verify: ${c.title}`,
      href: c.href,
    })),
  },
];

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
 * wording and the label is accurate. Both are Alpha's university classmates and
 * teammates, never clients; both approved these exact quotes (Alpha, 2026-10-18).
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
    confirmed: true,
  },
  {
    name: "Abdi Fekeda",
    role: "University classmate and teammate",
    photo: "/assets/testimonial-abdi.jpg",
    quote:
      "We built HU News together. He took the hardest screen, documented every decision, and reviewed the rest of our code without being asked. An easy person to ship with.",
    confirmed: true,
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
    a: "Yes, remote or in Addis Ababa. Every project is quoted after a short call, so the price fits what you actually need.",
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
