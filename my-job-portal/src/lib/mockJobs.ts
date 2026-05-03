export type JobType = "Full-time" | "Part-time" | "Remote" | "Contract";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  /** Lakhs per annum (INR) when < 1000; otherwise annual USD for high values */
  salary_min: number;
  salary_max: number;
  tags: string[];
  description: string;
  apply_url: string;
  posted_at: string;
  is_active: boolean;
  responsibilities: string[];
  requirements: string[];
};

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Nimbus Labs",
    location: "Bengaluru, India",
    job_type: "Full-time",
    salary_min: 18,
    salary_max: 28,
    tags: ["React", "TypeScript", "Next.js", "Tailwind"],
    description:
      "Join our product team to craft fast, accessible interfaces used by thousands of enterprises. You will partner with design and backend engineers to ship features end-to-end, improve performance, and raise the bar for frontend quality across the stack.\n\nWe value pragmatic tradeoffs, clear communication, and ownership. Our stack is modern React with Next.js, strict TypeScript, and Tailwind for styling. You will participate in design reviews, mentor junior engineers, and help define technical direction for the web client.",
    apply_url: "https://example.com/apply/nimbus-fe",
    posted_at: "2026-05-01T10:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Build and maintain customer-facing web applications with React and Next.js",
      "Collaborate with designers to implement responsive, accessible UIs",
      "Improve Core Web Vitals and frontend performance",
      "Write tests and participate in code reviews",
    ],
    requirements: [
      "4+ years of professional frontend experience",
      "Strong TypeScript and React skills",
      "Experience with SSR/SSG frameworks",
      "Comfortable with REST or GraphQL APIs",
    ],
  },
  {
    id: "job-2",
    title: "Backend Developer (Node.js)",
    company: "Riverstone Tech",
    location: "Hyderabad, India",
    job_type: "Full-time",
    salary_min: 14,
    salary_max: 22,
    tags: ["Node.js", "PostgreSQL", "AWS", "Docker"],
    description:
      "We are scaling our API platform and need engineers who love reliable systems. You will design services, optimize queries, and help migrate legacy modules to a cleaner service architecture.\n\nThe role offers exposure to event-driven patterns, observability, and multi-region deployments. We believe in small teams, fast feedback, and documentation that future-you will thank you for.",
    apply_url: "https://example.com/apply/riverstone-be",
    posted_at: "2026-04-28T14:30:00.000Z",
    is_active: true,
    responsibilities: [
      "Design and implement REST and internal APIs",
      "Own data modeling and migrations with PostgreSQL",
      "Improve reliability with logging, metrics, and alerts",
      "Collaborate with frontend on contract-first integrations",
    ],
    requirements: [
      "3+ years backend development experience",
      "Proficiency in Node.js and SQL",
      "Experience deploying on cloud providers",
      "Understanding of security basics (auth, validation)",
    ],
  },
  {
    id: "job-3",
    title: "Product Designer",
    company: "Oak & Co.",
    location: "Remote",
    job_type: "Remote",
    salary_min: 16,
    salary_max: 24,
    tags: ["Figma", "UX Research", "Design Systems"],
    description:
      "Shape the experience of our hiring and workflow products. You will run discovery sessions, produce flows and high-fidelity mocks, and work with engineering to ship a cohesive design system.\n\nThis is a remote-first role with occasional meetups. We care about inclusive design, measurable outcomes, and designers who can articulate tradeoffs—not just deliver screens.",
    apply_url: "https://example.com/apply/oak-designer",
    posted_at: "2026-05-02T09:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Lead UX for key product initiatives from problem to launch",
      "Maintain and evolve the Figma design system",
      "Partner with PM and engineering on feasibility and scope",
      "Conduct lightweight research and usability tests",
    ],
    requirements: [
      "Portfolio demonstrating web and mobile product work",
      "3+ years in product design roles",
      "Strong Figma skills and systems thinking",
      "Excellent written and verbal communication",
    ],
  },
  {
    id: "job-4",
    title: "Technical Program Manager",
    company: "Vertex Systems",
    location: "Pune, India",
    job_type: "Contract",
    salary_min: 20,
    salary_max: 32,
    tags: ["Agile", "Stakeholder Management", "Roadmaps"],
    description:
      "Drive cross-team programs across infrastructure and product launches. You will align stakeholders, remove blockers, and ensure predictable delivery without sacrificing quality.\n\nIdeal for someone who enjoys ambiguity, crisp documentation, and turning strategy into executable plans. Initial 12-month contract with extension possible.",
    apply_url: "https://example.com/apply/vertex-tpm",
    posted_at: "2026-04-10T11:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Plan and track multi-team initiatives",
      "Facilitate agile ceremonies and risk reviews",
      "Communicate status to leadership and customers",
      "Improve delivery processes where they hurt most",
    ],
    requirements: [
      "5+ years in TPM, engineering management, or related",
      "Experience with cloud or SaaS products",
      "Strong organizational and negotiation skills",
      "Comfortable with technical depth at architecture level",
    ],
  },
  {
    id: "job-5",
    title: "DevOps Engineer",
    company: "Cirrus Cloud",
    location: "Chennai, India",
    job_type: "Full-time",
    salary_min: 15,
    salary_max: 26,
    tags: ["Kubernetes", "Terraform", "CI/CD", "GCP"],
    description:
      "Automate everything that should be automated. You will own clusters, pipelines, and IaC modules that let product teams ship safely and often.\n\nWe run on GCP with GitOps principles. On-call is shared and we invest in runbooks and game days so incidents become rare and boring.",
    apply_url: "https://example.com/apply/cirrus-devops",
    posted_at: "2026-04-22T08:45:00.000Z",
    is_active: true,
    responsibilities: [
      "Maintain Kubernetes clusters and release pipelines",
      "Implement infrastructure as code with Terraform",
      "Support developers with observability and tooling",
      "Harden security and cost posture",
    ],
    requirements: [
      "3+ years DevOps/SRE experience",
      "Hands-on Kubernetes and Terraform",
      "Scripting in Python or Go",
      "Understanding of networking and TLS",
    ],
  },
  {
    id: "job-6",
    title: "Full Stack Engineer",
    company: "BrightPath EdTech",
    location: "Mumbai, India",
    job_type: "Part-time",
    salary_min: 10,
    salary_max: 16,
    tags: ["React", "Python", "Django", "PostgreSQL"],
    description:
      "Part-time role building internal tools and student-facing dashboards. Flexible hours with overlap on IST mornings. Great fit if you want meaningful impact with a smaller time commitment.\n\nYou will touch both Django APIs and a React admin, with emphasis on data correctness and simple UX for non-technical staff.",
    apply_url: "https://example.com/apply/brightpath-fs",
    posted_at: "2026-04-05T16:20:00.000Z",
    is_active: true,
    responsibilities: [
      "Implement features across Django backend and React frontend",
      "Fix bugs and improve reliability of reporting jobs",
      "Document APIs and deployment steps",
    ],
    requirements: [
      "2+ years full stack experience",
      "Python and React fundamentals",
      "Available 20–25 hours per week",
      "Self-directed and async-friendly communicator",
    ],
  },
  {
    id: "job-7",
    title: "Staff Software Engineer — Platform",
    company: "Northwind Analytics",
    location: "San Francisco, CA (Hybrid)",
    job_type: "Full-time",
    salary_min: 175000,
    salary_max: 220000,
    tags: ["Go", "Kafka", "Distributed Systems"],
    description:
      "Lead the evolution of our data ingestion platform. You will mentor engineers, set technical standards, and deliver systems that handle bursty workloads with grace.\n\nHybrid onsite three days per week. We offer competitive equity, health benefits, and a learning budget.",
    apply_url: "https://example.com/apply/northwind-staff",
    posted_at: "2026-04-18T13:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Architect high-throughput streaming services",
      "Mentor senior and mid-level engineers",
      "Partner with product on roadmap and technical bets",
      "Drive incident reviews and reliability goals",
    ],
    requirements: [
      "8+ years software engineering experience",
      "Strong Go or Java and distributed systems background",
      "Experience with Kafka or similar",
      "Prior technical leadership without people management required",
    ],
  },
  {
    id: "job-8",
    title: "Mobile Engineer (React Native)",
    company: "Pulse Health",
    location: "Remote",
    job_type: "Contract",
    salary_min: 12,
    salary_max: 20,
    tags: ["React Native", "iOS", "Android", "REST"],
    description:
      "Ship features for our patient engagement app used across India. Contract role for 6 months with option to convert. You will work with a small product squad and a dedicated QA partner.\n\nWe care about accessibility, offline resilience, and clear analytics events.",
    apply_url: "https://example.com/apply/pulse-mobile",
    posted_at: "2026-05-03T07:15:00.000Z",
    is_active: true,
    responsibilities: [
      "Implement screens and navigation in React Native",
      "Integrate with secure REST APIs",
      "Fix crashes and performance issues on older devices",
      "Collaborate on release checklist and store submissions",
    ],
    requirements: [
      "2+ years React Native shipping experience",
      "Understanding of mobile app lifecycle and stores",
      "Comfortable with TypeScript",
      "Healthcare experience is a plus",
    ],
  },
  {
    id: "job-9",
    title: "QA Automation Engineer",
    company: "Silverline Finance",
    location: "Gurugram, India",
    job_type: "Full-time",
    salary_min: 9,
    salary_max: 15,
    tags: ["Playwright", "Jest", "API Testing"],
    description:
      "Build and maintain automated coverage for our lending workflows. You will partner with developers to shift testing left and keep releases confident.\n\nWe use Playwright for E2E, contract tests for APIs, and invest in stable test data strategies.",
    apply_url: "https://example.com/apply/silverline-qa",
    posted_at: "2026-03-28T10:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Author and maintain E2E suites with Playwright",
      "Integrate tests into CI pipelines",
      "Triage failures and reduce flaky tests",
      "Collaborate on quality metrics with engineering leads",
    ],
    requirements: [
      "3+ years QA automation experience",
      "Strong JavaScript or TypeScript",
      "API testing experience",
      "Exposure to regulated domains is helpful",
    ],
  },
  {
    id: "job-10",
    title: "Data Engineer",
    company: "Atlas Retail",
    location: "Bengaluru, India",
    job_type: "Full-time",
    salary_min: 17,
    salary_max: 27,
    tags: ["Spark", "Airflow", "Snowflake", "SQL"],
    description:
      "Own pipelines that power merchandising and inventory analytics. You will work with analysts and ML engineers to ensure data is timely, accurate, and well-documented.\n\nWe are migrating workloads to Snowflake with Airflow orchestration—plenty of greenfield alongside maintenance.",
    apply_url: "https://example.com/apply/atlas-de",
    posted_at: "2026-04-25T12:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Build batch and streaming pipelines",
      "Model data for analytics and downstream ML",
      "Monitor data quality and SLAs",
      "Document datasets and lineage",
    ],
    requirements: [
      "4+ years data engineering experience",
      "Advanced SQL and Python",
      "Experience with Spark or similar",
      "Familiarity with warehouse platforms",
    ],
  },
  {
    id: "job-11",
    title: "Engineering Manager",
    company: "Kite Mobility",
    location: "Remote",
    job_type: "Remote",
    salary_min: 35,
    salary_max: 48,
    tags: ["Leadership", "Hiring", "Roadmaps"],
    description:
      "Lead a team of eight engineers building fleet operations software. You will hire, coach, and set a sustainable pace while partnering with product and design.\n\nWe are a remote company across APAC and US time zones; flexibility for overlapping core hours is required.",
    apply_url: "https://example.com/apply/kite-em",
    posted_at: "2026-04-12T09:30:00.000Z",
    is_active: true,
    responsibilities: [
      "Manage team performance, growth, and staffing",
      "Align technical roadmap with business goals",
      "Improve engineering practices and delivery predictability",
      "Foster inclusive culture and psychological safety",
    ],
    requirements: [
      "Prior people management experience in engineering",
      "Strong technical background (former IC)",
      "Experience with B2B SaaS",
      "Excellent written communication for distributed teams",
    ],
  },
  {
    id: "job-12",
    title: "Site Reliability Engineer",
    company: "BlueHarbor",
    location: "London, UK (Remote)",
    job_type: "Remote",
    salary_min: 90000,
    salary_max: 115000,
    tags: ["AWS", "Observability", "On-call"],
    description:
      "Keep our maritime logistics platform reliable across regions. You will improve SLOs, automate toil, and work with developers on resilient designs.\n\nFully remote within UK/EU. Occasional travel for team summits.",
    apply_url: "https://example.com/apply/blueharbor-sre",
    posted_at: "2026-04-08T15:45:00.000Z",
    is_active: true,
    responsibilities: [
      "Define and monitor SLOs/SLIs",
      "Run incident response and postmortems",
      "Automate deployments and rollback paths",
      "Partner on capacity and cost planning",
    ],
    requirements: [
      "4+ years SRE or production-focused backend",
      "Deep AWS experience",
      "Strong scripting and IaC skills",
      "Comfortable participating in on-call rotation",
    ],
  },
  {
    id: "job-13",
    title: "Junior Frontend Developer",
    company: "Startline Studio",
    location: "Indore, India",
    job_type: "Part-time",
    salary_min: 5,
    salary_max: 8,
    tags: ["HTML", "CSS", "JavaScript", "React"],
    description:
      "Great first commercial role for someone strong with fundamentals. You will ship marketing pages and small app features with close mentorship.\n\nPart-time 24h/week; hybrid optional. We value curiosity, kindness, and willingness to learn our codebase conventions.",
    apply_url: "https://example.com/apply/startline-junior",
    posted_at: "2026-04-30T18:00:00.000Z",
    is_active: true,
    responsibilities: [
      "Implement UI components from Figma specs",
      "Fix visual bugs and accessibility issues",
      "Participate in pair programming sessions",
      "Learn our React and tooling standards",
    ],
    requirements: [
      "0–1 year professional experience (projects OK)",
      "Solid HTML, CSS, and JavaScript",
      "Basic React knowledge",
      "Portfolio or GitHub samples appreciated",
    ],
  },
];

export function formatSalaryRange(job: Job): string {
  if (job.salary_min >= 1000) {
    const a = Math.round(job.salary_min / 1000);
    const b = Math.round(job.salary_max / 1000);
    return `$${a}k – $${b}k`;
  }
  return `₹${job.salary_min}L – ₹${job.salary_max}L`;
}

export function daysSincePosted(postedAt: string): number {
  const ms = Date.now() - new Date(postedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function isNewJob(postedAt: string): boolean {
  return daysSincePosted(postedAt) <= 3;
}
