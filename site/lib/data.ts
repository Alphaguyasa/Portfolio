export const CATEGORIES = ["All", "Web", "Mobile", "Security", "AI"] as const;

export type Category = (typeof CATEGORIES)[number];

export type Project = {
  tag: string;
  title: string;
  body: string;
  meta: string;
  href: string;
  cats: Exclude<Category, "All">[];
};

export const projects: Project[] = [
  {
    tag: "Security · final year project",
    title: "Website Vulnerability Scanner",
    body: "A web application security scanner that orchestrates OWASP ZAP, Nuclei, and Nikto behind one dashboard — start a scan, watch findings land in real time, and drill into each vulnerability. JWT-authenticated, containerized end to end, tested against Juice Shop and DVWA as live targets.",
    meta: "Next.js 16 · Fastify · PostgreSQL · Docker · OWASP ZAP",
    href: "https://github.com/vulnerability-scanner-website/Final-year-project",
    cats: ["Security", "Web"],
  },
  {
    tag: "Retrieval + evaluation",
    title: "DocSearch",
    body: "Ask questions across a corpus of PDFs and get answers that cite their sources — or refuse when the documents don't cover it. Hybrid retrieval: Voyage embeddings over pgvector fused with Postgres keyword search by Reciprocal Rank Fusion, streamed to the browser with citation targets rendered before the answer text.",
    meta: "Next.js 15 · TypeScript · Supabase pgvector · Voyage",
    href: "https://github.com/Alphaguyasa/docsearch",
    cats: ["Web", "AI"],
  },
  {
    tag: "Offline mesh · cryptography",
    title: "NullChat",
    body: "An Android app that carries messages and photos between phones with no network at all — a store-and-forward Bluetooth mesh with Ed25519-signed packets, X25519 sessions, and identity keys sealed by an Android Keystore master key. Peers verify each other by QR scan, or by reading six words aloud over a phone call.",
    meta: "Kotlin · Jetpack Compose · Room · Nearby · Tink",
    href: "https://github.com/Alphaguyasa/NullChat",
    cats: ["Mobile", "Security"],
  },
  {
    tag: "Mobile · live data",
    title: "HU News",
    body: "Haramaya University's news in a Flutter app, pulled live from the university's WordPress REST API. Featured carousel, paginated feed, highlighted search, embedded video, and a three-tier image fallback so an article never renders blank. Built with four classmates; I owned the home screen.",
    meta: "Flutter · Dart · WordPress REST · Android APK",
    href: "https://github.com/Alphaguyasa/HUnews",
    cats: ["Mobile"],
  },
  {
    tag: "Web3 · Internet Computer",
    title: "Alpha Coin",
    body: "A token dashboard on the Internet Computer: sign in with Internet Identity, read your ALPHA balance, claim once, and transfer to another principal. The ledger is a Motoko canister; the frontend is Next.js talking to it directly.",
    meta: "Next.js 15 · TypeScript · Motoko · ICP",
    href: "https://github.com/Alphaguyasa/Alpha-digital-coin",
    cats: ["Web"],
  },
];

export const stats = [
  { k: "1st", v: "CTF, Haramaya University × INSA" },
  { k: "BSc", v: "Computer science, class of 2026" },
  { k: "1", v: "University cyber club, led" },
];

export type CraftGroup = {
  title: string;
  level: string;
  note: string;
  items: string[];
};

export const craft: CraftGroup[] = [
  {
    title: "Interface engineering",
    level: "Core",
    note: "Where I spend most of my hours. Layout, state, and the small motions that make a page feel answered rather than loaded.",
    items: ["React", "TypeScript", "Next.js 15", "Tailwind", "Framer Motion", "HTML", "CSS"],
  },
  {
    title: "Mobile",
    level: "Shipped",
    note: "Two apps in production form — a Flutter news reader and a Kotlin mesh messenger with a signed release build.",
    items: ["Flutter", "Dart", "Kotlin", "Jetpack Compose", "Room", "Gradle"],
  },
  {
    title: "Backend & data",
    level: "Working",
    note: "Enough to own a feature end to end: routes, schema, auth, and the boring parts that keep data honest.",
    items: ["Node.js", "REST APIs", "PostgreSQL", "pgvector", "Supabase", "Motoko", "Python"],
  },
  {
    title: "Security",
    level: "Competitive",
    note: "CTF-trained, and it shows in what I build: signed packets, sealed keys, and a fingerprint scheme documented down to how many bits it's actually worth.",
    items: ["OWASP Top 10", "Ed25519 / X25519", "Burp Suite", "Wireshark", "Nmap", "Linux", "Bash"],
  },
  {
    title: "Working practice",
    level: "Daily",
    note: "Version control that tells a story, teammates who know what's happening, and shipping on a real deadline.",
    items: ["Git & GitHub", "Figma", "Docker", "Vercel", "Technical writing", "Mentoring"],
  },
];

export type TimelineEntry = {
  when: string;
  role: string;
  org: string;
  body: string;
};

export const timeline: TimelineEntry[] = [
  {
    when: "2026",
    role: "Graduated, BSc Computer Science",
    org: "Haramaya University",
    body: "Four years of fundamentals — algorithms, networks, operating systems, databases — finished this year.",
  },
  {
    when: "2026",
    role: "1st place, Capture the Flag",
    org: "HU × INSA",
    body: "Won the university's capture-the-flag competition, held in collaboration with INSA, Ethiopia's Information Network Security Administration.",
  },
  {
    when: "2026",
    role: "Shipped HU News with a team of five",
    org: "Mobile App Development",
    body: "Built the university's news app in Flutter as a course project. I owned the home screen — the featured carousel, the paginated feed, and the dark mode that survives a restart. Released as a signed APK.",
  },
  {
    when: "2026",
    role: "Leader, Cyber Club",
    org: "Haramaya University",
    body: "Ran the university's cybersecurity club: sessions, practice challenges, and getting new members from curious to competent.",
  },
  {
    when: "2026",
    role: "Focal person, Leyu data collection",
    org: "Gheero",
    body: "Coordinated field data collection — sorting out how information was captured, checked, and handed on without losing its meaning.",
  },
];

export const contactLinks = [
  { label: "Email", value: "alphaguyasa@gmail.com", href: "mailto:alphaguyasa@gmail.com" },
  { label: "GitHub", value: "github.com/Alphaguyasa", href: "https://github.com/Alphaguyasa" },
  { label: "LinkedIn", value: "in/alpha-guyasa", href: "https://www.linkedin.com/in/alpha-guyasa-a2b567328" },
  { label: "Phone", value: "0975 567 560", href: "tel:+251975567560" },
];

export const marqueeItems = [
  "CTF — 1st place, Haramaya University × INSA",
  "Leader — HU Cyber Club",
  "Focal person — Leyu data collection, Gheero",
  "BSc Computer Science, 2026",
  "Open to frontend & full-stack roles",
];

export const roles = [
  "Frontend & full-stack engineer",
  "Capture-the-flag competitor",
  "Open to work — 2026",
];

export const EMAIL = "alphaguyasa@gmail.com";
export const GITHUB = "https://github.com/Alphaguyasa";
export const LINKEDIN = "https://www.linkedin.com/in/alpha-guyasa-a2b567328";
export const PHONE_HREF = "tel:+251975567560";
export const PHONE_LABEL = "0975 567 560";
export const RESUME = "/alphaguyasaResume.pdf";
