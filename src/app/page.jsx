'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Circle, Calendar, Award, BookOpen, Video, Search, Wrench,
  Sparkles, ExternalLink, ChevronDown, ChevronUp, Flame, TrendingUp, Filter,
  Bookmark, StickyNote, Target, Lightbulb, Layers, Trophy, SlidersHorizontal,
  FolderOpen, Link2, Headphones, X, GitBranch, Hash, Rocket,
} from 'lucide-react';
 
/* =========================================================================
   DESIGN TOKENS
   ========================================================================= */
const FONT_DISPLAY = "'Sora', ui-sans-serif, system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
 
const CATEGORY_STYLES = {
  Discovery: { text: 'text-cyan-300', bg: 'bg-cyan-500/10', ring: 'ring-cyan-500/30' },
  Technical: { text: 'text-amber-300', bg: 'bg-amber-500/10', ring: 'ring-amber-500/30' },
  Design: { text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10', ring: 'ring-fuchsia-500/30' },
  Analytics: { text: 'text-sky-300', bg: 'bg-sky-500/10', ring: 'ring-sky-500/30' },
  Growth: { text: 'text-lime-300', bg: 'bg-lime-500/10', ring: 'ring-lime-500/30' },
  Career: { text: 'text-rose-300', bg: 'bg-rose-500/10', ring: 'ring-rose-500/30' },
};
 
const MILESTONE_WEEKS = [12, 24, 36, 48];
 
/* =========================================================================
   SEMESTER META
   ========================================================================= */
const SEMESTERS = [
  { id: 1, name: 'PM Foundations, Discovery & Market Strategy', range: [1, 12] },
  { id: 2, name: 'Technical PM, System Architecture & Design', range: [13, 24] },
  { id: 3, name: 'Analytics, Experimentation, Growth & AI/ML', range: [25, 36] },
  { id: 4, name: '0-to-1 Capstone, Portfolio & Job Preparation', range: [37, 48] },
];
 
function getSemesterForWeek(id) {
  const found = SEMESTERS.find((s) => id >= s.range[0] && id <= s.range[1]);
  return found ? found.id : 1;
}
 
/* =========================================================================
   48-WEEK SEED DATA
   ========================================================================= */
const WEEKS = [
  // ---------------- SEMESTER 1: Weeks 1-12 ----------------
  {
    id: 1,
    title: 'The PM Triad: Business, UX & Technology',
    category: 'Discovery',
    objectives: [
      'Map the three lenses of product management: desirability, feasibility, viability',
      'Read chapter 1 of Inspired by Marty Cagan and note three takeaways',
      'Interview a working PM about what a typical week actually looks like',
      'Draft your personal definition of what "good product management" means',
    ],
    deliverable: 'A one-page personal PM manifesto answering: what does a great PM actually do day to day?',
    materials: [
      { type: 'video', label: 'Diego Granados — "What does a Product Manager actually do?"' },
      { type: 'read', label: 'Inspired by Marty Cagan, Chapter 1' },
      { type: 'tool', label: 'Notion — PM manifesto template' },
    ],
    didYouKnow: 'The title "Product Manager" traces back to a 1931 internal memo at Procter & Gamble written by a young Neil McElroy, arguing that Camay soap needed one person owning its full lifecycle — a role later exported across the tech industry.',
  },
  {
    id: 2,
    title: 'Agile & Scrum vs Kanban',
    category: 'Technical',
    objectives: [
      'Learn the core Scrum ceremonies: standup, sprint planning, review, retro',
      'Compare Scrum\'s fixed sprints against Kanban\'s continuous flow model',
      'Run a mock two-week sprint planning session for a sample feature',
      'Define WIP (work-in-progress) limits for a Kanban board column',
    ],
    deliverable: 'A live Kanban board in Linear or Trello set up for a sample feature, with WIP limits enforced',
    materials: [
      { type: 'read', label: 'Atlassian Agile Coach — Scrum vs Kanban guide' },
      { type: 'tool', label: 'Linear — sprint and board setup' },
      { type: 'video', label: 'Exponent — Agile methodologies explained' },
    ],
    didYouKnow: 'Kanban began as a physical card system on Toyota\'s factory floor in the 1940s, designed to limit work-in-progress and expose bottlenecks visually — engineer David Anderson later adapted the same logic to software teams in the 2000s.',
  },
  {
    id: 3,
    title: 'SDLC Workflows',
    category: 'Technical',
    objectives: [
      'Learn the six SDLC phases: plan, design, build, test, deploy, maintain',
      'Compare waterfall against iterative and agile delivery models',
      'Trace a real bug from user report through to a shipped production fix',
      'Learn the basics of continuous integration and continuous deployment',
    ],
    deliverable: 'A diagram of the full SDLC for a feature you use daily, from first ticket to production release',
    materials: [
      { type: 'video', label: 'freeCodeCamp — Software Development Life Cycle explained' },
      { type: 'read', label: 'GitHub Actions — CI/CD documentation' },
      { type: 'tool', label: 'Postman — for exploring how a live feature\'s API behaves' },
    ],
    didYouKnow: 'M-Pesa was originally engineered for basic feature phones, meaning every USSD menu screen had to fit inside roughly 182 characters of memory — a constraint that shaped how the entire mobile-money SDLC was designed around scarcity.',
  },
  {
    id: 4,
    title: 'Product Mindset & Team Topologies',
    category: 'Discovery',
    objectives: [
      'Distinguish a project mindset (fixed scope) from a product mindset (ongoing outcomes)',
      'Study the Team Topologies model: stream-aligned, platform, enabling, and complicated-subsystem teams',
      'Map your own school or work team against the Team Topologies framework',
      'Identify one real example of Conway\'s Law in a product you use',
    ],
    deliverable: 'A short brief on how team structure at a company you admire visibly shapes its product',
    materials: [
      { type: 'read', label: 'Team Topologies by Matthew Skelton & Manuel Pais, ch.1 excerpt' },
      { type: 'read', label: 'Silicon Valley Product Group — team structure essays' },
      { type: 'read', label: 'Product Management in Practice by Matt LeMay' },
    ],
    didYouKnow: 'Conway\'s Law is visible in Amazon\'s "two-pizza team" structure: Jeff Bezos\'s 2002 API mandate forced every team to expose its data only through APIs, which is precisely why Amazon\'s product architecture mirrors its small, independent team boundaries today.',
  },
  {
    id: 5,
    title: 'The Mom Test',
    category: 'Discovery',
    objectives: [
      'Read the core rules of The Mom Test by Rob Fitzpatrick',
      'List five leading questions and rewrite each as a non-leading version',
      'Practice a Mom Test-style conversation on a friend or family member',
      'Identify the moment in a conversation where you are tempted to pitch — and resist it',
    ],
    deliverable: 'A real customer discovery call conducted and transcribed using Mom Test principles',
    materials: [
      { type: 'read', label: 'The Mom Test by Rob Fitzpatrick' },
      { type: 'video', label: "Lenny's Podcast — episode on customer discovery interviews" },
      { type: 'tool', label: 'Notion — discovery interview script template' },
    ],
    didYouKnow: 'CB Insights\' recurring post-mortem research on failed startups consistently ranks "no market need" as the single most common cause of failure — precisely the blind spot The Mom Test is designed to catch before a team builds anything.',
  },
  {
    id: 6,
    title: 'User Discovery Methods',
    category: 'Discovery',
    objectives: [
      'Compare qualitative discovery methods against quantitative validation methods',
      'Run three real discovery interviews using a written screener',
      'Synthesize interview notes into 3-5 recurring themes',
      'Actively check your synthesis for confirmation bias',
    ],
    deliverable: 'A discovery synthesis document with at least three validated, evidence-backed pain points',
    materials: [
      { type: 'read', label: 'Continuous Discovery Habits by Teresa Torres' },
      { type: 'tool', label: 'Dovetail — for tagging and synthesizing interview notes' },
      { type: 'tool', label: 'Google Forms — for screener surveys' },
    ],
    didYouKnow: "Teresa Torres's \"opportunity solution tree\" is built on a simple habit: teams that touch real customers at least weekly reach product-market fit signal noticeably faster than teams that run discovery in occasional, disconnected bursts.",
  },
  {
    id: 7,
    title: 'Empathy Mapping & Journey Mapping',
    category: 'Discovery',
    objectives: [
      'Build an empathy map covering what the user says, thinks, does, and feels',
      'Draft an end-to-end customer journey map for a product of your choice',
      'Mark every friction point and every moment of delight on the map',
      'Present your journey map to a peer and capture their feedback',
    ],
    deliverable: 'A visual, annotated customer journey map highlighting at least three friction points',
    materials: [
      { type: 'tool', label: 'Figma — customer journey map template' },
      { type: 'read', label: 'Nielsen Norman Group — journey mapping 101' },
      { type: 'tool', label: 'Miro — collaborative mapping board' },
    ],
    didYouKnow: 'Journey mapping descends from "service blueprints," a technique Lynn Shostack introduced in a 1984 Harvard Business Review article to help banks visualize every customer-facing and behind-the-scenes step of a service.',
  },
  {
    id: 8,
    title: 'Jobs-to-be-Done (JTBD) & "How Might We" Statements',
    category: 'Discovery',
    objectives: [
      'Learn Clayton Christensen\'s Jobs-to-be-Done framework',
      'Write job stories in the format: "When... I want to... so I can..."',
      'Convert discovery insights into three or more How Might We statements',
      'Run a short ideation sprint from your HMW statements',
    ],
    deliverable: 'Three JTBD job stories plus five How Might We statements drawn from your Week 6 synthesis',
    materials: [
      { type: 'read', label: "Clayton Christensen's \"Milkshake Marketing\" HBR case study" },
      { type: 'video', label: 'Jobs-to-be-Done explainer podcast episode' },
      { type: 'read', label: 'IDEO Design Thinking — How Might We guide' },
    ],
    didYouKnow: "In the famous fast-food \"milkshake study,\" researchers found commuters weren't buying milkshakes for taste at all — they were hiring them to make a boring drive more bearable, reshaping how teams frame the problem behind a purchase.",
  },
  {
    id: 9,
    title: 'Market Sizing: TAM, SAM, SOM',
    category: 'Discovery',
    objectives: [
      'Learn the difference between top-down and bottom-up market sizing',
      'Calculate TAM, SAM, and SOM for a sample product idea',
      'Source real assumptions from public market reports',
      'Sanity-check your sizing numbers against basic unit economics',
    ],
    deliverable: 'A TAM/SAM/SOM slide with clearly sourced assumptions for your capstone idea candidate',
    materials: [
      { type: 'read', label: 'a16z — a practical guide to market sizing' },
      { type: 'read', label: 'Statista — market data for sourcing assumptions' },
      { type: 'tool', label: 'Google Sheets — market sizing template' },
    ],
    didYouKnow: "Slack's early market sizing was almost accidental: it began as an internal tool inside a failed game studio (Tiny Speck), and only became a $27B company once the team redefined its addressable market around internal team communication.",
  },
  {
    id: 10,
    title: 'SWOT & 2x2 Positioning',
    category: 'Discovery',
    objectives: [
      'Run a SWOT analysis on two direct competitors',
      'Build a 2x2 positioning map using axes that genuinely matter to the buyer',
      'Identify a defensible gap in the competitive landscape',
      'Pressure-test your positioning statement with a peer',
    ],
    deliverable: 'A competitive 2x2 map placing your product idea against four real competitors',
    materials: [
      { type: 'tool', label: 'Miro — 2x2 positioning map template' },
      { type: 'read', label: 'Obviously Awesome by April Dunford' },
      { type: 'read', label: 'Crunchbase — competitor research' },
    ],
    didYouKnow: "Nintendo deliberately positioned the Wii on a blue-ocean axis — targeting non-gamers and families — instead of competing with the PS3 and Xbox 360 on raw graphics power, a textbook case of winning by refusing to compete head-on.",
  },
  {
    id: 11,
    title: 'OKRs & Product Vision',
    category: 'Discovery',
    objectives: [
      'Write a one-year product vision statement for your capstone direction',
      'Draft one Objective with three measurable Key Results',
      'Learn how OKRs differ from ordinary KPIs',
      'Review your OKRs against SMART criteria',
    ],
    deliverable: 'A product vision one-pager plus a quarterly OKR set for your capstone direction',
    materials: [
      { type: 'read', label: 'Measure What Matters by John Doerr' },
      { type: 'read', label: "Google re:Work — OKR guide" },
      { type: 'tool', label: 'Notion — OKR tracker template' },
    ],
    didYouKnow: "OKRs trace from Andy Grove's management practices at Intel to a 1999 slide deck John Doerr presented to Google's founders in their garage — a single framework that later scaled across a trillion-dollar company.",
  },
  {
    id: 12,
    title: 'Milestone 1 — Discovery & Strategy Dossier',
    category: 'Discovery',
    objectives: [
      'Compile your discovery interviews and synthesis into one document',
      'Compile your TAM/SAM/SOM sizing and 2x2 positioning map',
      'Compile your product vision statement and quarterly OKRs',
      'Package everything into a single, reviewable Discovery & Strategy Dossier',
    ],
    deliverable: 'Submit Milestone 1: a complete Discovery & Strategy Dossier (10-15 pages)',
    materials: [
      { type: 'tool', label: 'Google Slides — dossier packaging template' },
      { type: 'read', label: 'Peer review checklist for Milestone 1' },
      { type: 'read', label: 'AltSchool Africa TPM milestone rubric' },
    ],
    didYouKnow: "Amazon famously banned PowerPoint for major decisions in favor of narrative six-page memos, per Jeff Bezos's internal mandate — the same instinct behind writing a dossier as prose rather than bullet-point slides.",
  },
 
  // ---------------- SEMESTER 2: Weeks 13-24 ----------------
  {
    id: 13,
    title: 'Anatomy of a Technical PRD',
    category: 'Technical',
    objectives: [
      'Study the standard PRD sections: problem, goals, non-goals, requirements, edge cases',
      'Write functional requirements separately from non-functional requirements',
      'Define clear, testable acceptance criteria for one feature',
      'Get your draft PRD reviewed by an engineer or engineer-persona',
    ],
    deliverable: 'Draft v1 of a Technical PRD for a feature, with fully written acceptance criteria',
    materials: [
      { type: 'tool', label: 'Reforge — technical PRD templates' },
      { type: 'tool', label: 'Notion — PRD template' },
      { type: 'read', label: 'The Making of a Manager by Julie Zhuo, PRD excerpt' },
    ],
    didYouKnow: "Amazon's internal PR/FAQ format forces teams to write the customer-facing press release and FAQ before a single line of code is written — a discipline meant to catch a weak idea long before engineering ever gets involved.",
  },
  {
    id: 14,
    title: 'Figma Wireframing Basics',
    category: 'Design',
    objectives: [
      'Learn frames, auto-layout, and components inside Figma',
      'Wireframe three core screens for your PRD feature in low fidelity',
      'Apply an 8pt spacing grid consistently across your screens',
      'Share your Figma file with comment permissions and gather feedback',
    ],
    deliverable: 'Low-fidelity wireframes for your PRD feature, three screens minimum',
    materials: [
      { type: 'video', label: 'Figma — official wireframing tutorial' },
      { type: 'read', label: 'Refactoring UI by Adam Wathan & Steve Schoger' },
      { type: 'tool', label: 'Figma Community — free wireframe kits' },
    ],
    didYouKnow: "Figma's browser-based, real-time multiplayer editing was considered technically implausible by early rivals like Sketch, which stayed desktop-only for years before eventually being forced to respond to Figma's cloud-first bet.",
  },
  {
    id: 15,
    title: 'Interactive Prototypes in Figma',
    category: 'Design',
    objectives: [
      'Convert your low-fidelity wireframes into a clickable prototype',
      'Add transitions, overlays, and interactive states between screens',
      'Run a guerrilla usability test with three to five users',
      'Log every usability issue you observe during testing',
    ],
    deliverable: 'A clickable Figma prototype tested with at least three users, with a written findings log',
    materials: [
      { type: 'tool', label: 'Figma — prototyping documentation' },
      { type: 'tool', label: 'Maze — remote usability testing' },
      { type: 'read', label: 'Nielsen Norman Group — discount usability testing guide' },
    ],
    didYouKnow: "Jakob Nielsen's research found that testing with just five users typically surfaces around 85% of a product's usability problems — the origin of the now-standard \"guerrilla testing\" practice with small, fast user samples.",
  },
  {
    id: 16,
    title: 'UX Component Systems',
    category: 'Design',
    objectives: [
      'Study atomic design: atoms, molecules, and organisms',
      'Audit an existing design system such as Material Design or Shopify Polaris',
      'Define the reusable components your prototype actually needs',
      'Document each component\'s default, hover, disabled, and error states',
    ],
    deliverable: 'A mini component library (buttons, inputs, cards) with every state fully documented',
    materials: [
      { type: 'read', label: 'Shopify Polaris — design system reference' },
      { type: 'read', label: 'Atomic Design by Brad Frost' },
      { type: 'video', label: 'Figma — component variants tutorial' },
    ],
    didYouKnow: "Airbnb's internal Design Language System let designs translate almost directly into shipped code, cutting handoff friction so dramatically that it became one of the most cited early case studies for why design systems compound in value over time.",
  },
  {
    id: 17,
    title: 'Client-Server Architecture',
    category: 'Technical',
    objectives: [
      'Diagram the full request-response lifecycle between client and server',
      'Learn the distinct roles of client, server, and database',
      'Understand load balancers and CDNs at a conceptual level',
      'Trace a real API call in the browser using developer tools',
    ],
    deliverable: 'An annotated architecture diagram of a real product\'s client-server flow',
    materials: [
      { type: 'read', label: 'High Scalability — architecture case studies' },
      { type: 'tool', label: 'Postman — for tracing API requests' },
      { type: 'read', label: 'Chrome DevTools — Network tab tutorial' },
    ],
    didYouKnow: "Netflix's shift from a single monolith to a microservices architecture followed a major 2008 database corruption incident that caused a multi-day outage — now a canonical case study in why large systems get decomposed into independent services.",
  },
  {
    id: 18,
    title: 'REST vs GraphQL',
    category: 'Technical',
    objectives: [
      'Compare REST\'s resource-based design against GraphQL\'s query-based design',
      'Design a REST endpoint set for a single resource',
      'Write an equivalent GraphQL query for the same data',
      'Evaluate over-fetching and under-fetching tradeoffs between the two',
    ],
    deliverable: 'A comparison document: REST vs GraphQL for your feature, with a clear recommendation',
    materials: [
      { type: 'read', label: 'GraphQL.org — official introduction' },
      { type: 'tool', label: 'Postman — REST collections' },
      { type: 'read', label: 'howtographql.com — full-stack tutorial' },
    ],
    didYouKnow: 'GraphQL was built internally at Facebook in 2012 to solve mobile over-fetching problems on slow, early smartphone networks, and was only open-sourced to the public in 2015.',
  },
  {
    id: 19,
    title: 'Webhooks & API Specs',
    category: 'Technical',
    objectives: [
      'Learn the difference between webhook push models and polling pull models',
      'Design a webhook payload schema for a sample event',
      'Build a sample API request in Postman with headers and authentication',
      'Write a short OpenAPI-style specification snippet for one endpoint',
    ],
    deliverable: 'A documented webhook event spec, including payload structure and retry policy, for a payments feature',
    materials: [
      { type: 'tool', label: 'Postman — API design and documentation tools' },
      { type: 'read', label: 'Stripe — webhook documentation, used as a reference pattern' },
      { type: 'read', label: 'Paystack — developer documentation' },
    ],
    didYouKnow: "Paystack signs every webhook payload with a hash in the request header, so a merchant's server can verify the event genuinely came from Paystack before trusting it — a core lesson in designing webhooks that can't be spoofed.",
  },
  {
    id: 20,
    title: 'SQL vs NoSQL & Latency vs Throughput',
    category: 'Technical',
    objectives: [
      'Design a normalized SQL schema for a sample application',
      'Design an equivalent NoSQL document model for the same data',
      'Explain latency vs throughput using a concrete, real-world example',
      'Choose the right database type for two different sample use cases',
    ],
    deliverable: 'Two schema diagrams, SQL and NoSQL, for the same feature, with a written database-choice rationale',
    materials: [
      { type: 'read', label: 'Designing Data-Intensive Applications by Martin Kleppmann, ch.2 excerpt' },
      { type: 'tool', label: 'Supabase — hosted Postgres for prototyping schemas' },
      { type: 'tool', label: 'dbdiagram.io — schema diagramming tool' },
    ],
    didYouKnow: "Flutterwave's payment APIs rely on idempotency keys so that if a request is retried after a network timeout, the customer is never charged twice — a foundational lesson in designing distributed systems that fail safely.",
  },
  {
    id: 21,
    title: 'Prioritization Frameworks: RICE, Kano, MoSCoW',
    category: 'Technical',
    objectives: [
      'Score five backlog items using the RICE framework',
      'Classify the same features using the Kano model: basic, performance, delighter',
      'Apply MoSCoW to scope a single sprint',
      'Compare how each framework changes your final ranking',
    ],
    deliverable: 'A prioritized backlog of 8-10 items scored with RICE and cross-checked against the Kano model',
    materials: [
      { type: 'read', label: 'Intercom — prioritization framework guide' },
      { type: 'video', label: 'Kano model explainer video' },
      { type: 'tool', label: 'Notion — RICE scoring template' },
    ],
    didYouKnow: "RICE was invented by Intercom's own product team specifically to replace gut-feel prioritization debates with a repeatable, comparable score everyone in the room could argue about using the same math.",
  },
  {
    id: 22,
    title: 'Backlog Grooming',
    category: 'Technical',
    objectives: [
      'Write well-formed user stories: "As a... I want... so that..."',
      'Apply the INVEST criteria to check each story\'s quality',
      'Run a mock backlog grooming session with a peer or mentor',
      'Split one oversized epic into several sprint-sized stories',
    ],
    deliverable: 'A groomed backlog of 10 stories, each meeting INVEST criteria with rough estimates attached',
    materials: [
      { type: 'read', label: 'User Stories Applied by Mike Cohn' },
      { type: 'tool', label: 'Linear — backlog management' },
      { type: 'read', label: 'Atlassian — story splitting guide' },
    ],
    didYouKnow: 'The INVEST acronym — Independent, Negotiable, Valuable, Estimable, Small, Testable — was coined by developer Bill Wake in 2003 and remains the industry default checklist for a well-written user story.',
  },
  {
    id: 23,
    title: 'Sprint Tickets & Agile Ceremonies',
    category: 'Technical',
    objectives: [
      'Create tickets with clear acceptance criteria in Linear or Jira',
      'Run a mock sprint planning session, daily standup, and retro',
      'Tag every ticket with a story-point estimate',
      'Close the sprint with a short demo of what shipped',
    ],
    deliverable: 'A fully ticketed sprint board in Linear or Jira, moved through a complete mock two-week sprint',
    materials: [
      { type: 'tool', label: 'Linear — sprint board and ceremonies' },
      { type: 'read', label: 'Atlassian — sprint planning guide' },
      { type: 'read', label: 'Scrum.org — retrospective techniques' },
    ],
    didYouKnow: "Moniepoint's agent POS terminals sync transactions offline-first, queuing them locally and reconciling once a connection returns — a real-world lesson in writing tickets with edge cases for unreliable networks baked in from the start.",
  },
  {
    id: 24,
    title: 'Milestone 2 — Technical PRD + Prototype + API & Schema Specs',
    category: 'Technical',
    objectives: [
      'Finalize your PRD with complete, testable acceptance criteria',
      'Attach your clickable Figma prototype link',
      'Attach your API/webhook spec and database schema diagrams',
      'Run a mock engineering review of the full package',
    ],
    deliverable: 'Submit Milestone 2: a complete Technical PRD, Figma prototype, and API/schema specs',
    materials: [
      { type: 'read', label: 'Milestone 2 grading rubric' },
      { type: 'read', label: 'Peer engineer review checklist' },
      { type: 'tool', label: 'Notion — final package template' },
    ],
    didYouKnow: 'Studies on engineering rework consistently cite ambiguous requirements as one of the leading causes of sprint spillover — a well-specified PRD is one of the cheapest ways a PM can prevent it.',
  },
 
  // ---------------- SEMESTER 3: Weeks 25-36 ----------------
  {
    id: 25,
    title: 'North Star Metrics',
    category: 'Analytics',
    objectives: [
      'Learn what separates a good North Star Metric from a vanity metric',
      'Evaluate three candidate North Star Metrics for a sample product',
      'Map the input metrics that actually drive your chosen North Star',
      'Stress-test your North Star for vanity-metric traps',
    ],
    deliverable: 'A North Star Metric proposal with three supporting input metrics and a written rationale',
    materials: [
      { type: 'read', label: 'Amplitude — North Star Playbook' },
      { type: 'read', label: 'Reforge — growth series notes' },
      { type: 'read', label: 'Hacking Growth by Sean Ellis & Morgan Brown' },
    ],
    didYouKnow: "Facebook's early growth team discovered that users who added seven friends within ten days were dramatically more likely to stick around — one of the most cited cohort-analysis insights in growth history.",
  },
  {
    id: 26,
    title: 'AARRR Funnels',
    category: 'Analytics',
    objectives: [
      'Map Acquisition, Activation, Retention, Referral, and Revenue for a sample product',
      'Identify the single leakiest stage in the funnel',
      'Propose one concrete experiment for each funnel stage',
      'Build a simple visualization of the full funnel',
    ],
    deliverable: 'An AARRR funnel diagram with conversion estimates and one proposed fix per stage',
    materials: [
      { type: 'read', label: "Dave McClure's original 500 Startups AARRR slides" },
      { type: 'tool', label: 'Mixpanel — funnel analysis documentation' },
      { type: 'tool', label: 'Google Analytics — funnel reports' },
    ],
    didYouKnow: "Dave McClure coined AARRR at 500 Startups in 2007, deliberately naming it after a pirate growl so founders would actually remember the five stages in a real boardroom conversation.",
  },
  {
    id: 27,
    title: 'SQL for PMs: Cohorts & Churn',
    category: 'Analytics',
    objectives: [
      'Write a SQL query that groups users into weekly signup cohorts',
      'Calculate week-over-week retention percentage from that query',
      'Calculate churn rate using the same underlying dataset',
      'Visualize a retention curve from your query output',
    ],
    deliverable: 'A working SQL cohort retention query, plus a chart of the resulting retention curve',
    materials: [
      { type: 'read', label: 'Mode Analytics — SQL tutorials for analysts' },
      { type: 'tool', label: 'Supabase — SQL editor for practice queries' },
      { type: 'read', label: 'Learn SQL the Hard Way' },
    ],
    didYouKnow: "Data teams at companies like Spotify use cohort retention curves to catch feature regressions days before a spike in support tickets would otherwise reveal the same problem.",
  },
  {
    id: 28,
    title: 'DAU/MAU & Event Tracking Instrumentation',
    category: 'Analytics',
    objectives: [
      'Define DAU, MAU, and the resulting stickiness ratio',
      'Design an event tracking plan: event names, properties, and triggers',
      'Instrument a sample user flow inside PostHog or Mixpanel',
      'Audit your plan for gaps in tracking coverage',
    ],
    deliverable: 'A complete event instrumentation plan for your capstone feature, with clear naming conventions',
    materials: [
      { type: 'tool', label: 'PostHog — product analytics documentation' },
      { type: 'read', label: 'Mixpanel — event taxonomy guide' },
      { type: 'tool', label: 'Amplitude — tracking plan template' },
    ],
    didYouKnow: "X (formerly Twitter)'s DAU/MAU \"stickiness\" ratio became a headline metric for investors because it signals habitual daily use far better than a raw monthly active-user count alone.",
  },
  {
    id: 29,
    title: 'A/B Testing Statistics',
    category: 'Analytics',
    objectives: [
      'Learn the null and alternative hypothesis structure of an A/B test',
      'Understand p-values and statistical significance at a conceptual level',
      'Calculate the minimum detectable effect (MDE) for a sample test',
      'Identify common A/B testing pitfalls: peeking early and sample ratio mismatch',
    ],
    deliverable: 'An experiment design worksheet with hypothesis, required sample size, and success metric defined',
    materials: [
      { type: 'tool', label: "Evan Miller's A/B test sample size calculator" },
      { type: 'read', label: 'Trustworthy Online Controlled Experiments by Kohavi, Tang & Xu' },
      { type: 'read', label: 'Optimizely — statistics behind A/B testing' },
    ],
    didYouKnow: "Microsoft's Bing team once found that a single button-color and layout change, discovered through an A/B test, added over $100 million in annual revenue — one of the most cited ROI stories in experimentation history.",
  },
  {
    id: 30,
    title: 'MDE & Experimentation Docs',
    category: 'Analytics',
    objectives: [
      'Write a full experimentation one-pager: hypothesis, metric, guardrails, rollback plan',
      'Define your primary metric separately from guardrail metrics',
      'Plan a feature-flagged, staged rollout',
      'Pre-register your success criteria before you see any results',
    ],
    deliverable: 'A complete experimentation doc, ready to hand to an engineering team for a feature-flagged rollout',
    materials: [
      { type: 'read', label: 'LaunchDarkly — feature flag documentation' },
      { type: 'read', label: "Airbnb's engineering blog on their experimentation platform" },
      { type: 'tool', label: 'Notion — experimentation doc template' },
    ],
    didYouKnow: "Pre-registering a hypothesis before seeing results — a practice borrowed from clinical trial science — stops teams from quietly rationalizing a flat or negative test result as a hidden win.",
  },
  {
    id: 31,
    title: 'Retention Curves',
    category: 'Analytics',
    objectives: [
      'Distinguish a "smiling" retention curve from one that decays to zero',
      'Plot a retention curve from a sample dataset',
      'Diagnose whether retention is stabilizing or trending toward churn',
      'Propose one concrete intervention to improve the curve',
    ],
    deliverable: 'A retention curve analysis identifying whether the product shows a product-market fit signal',
    materials: [
      { type: 'read', label: 'Reforge — retention curve teardown' },
      { type: 'video', label: "Lenny's Podcast — episode on retention as a PMF signal" },
      { type: 'tool', label: 'Google Sheets — cohort retention template' },
    ],
    didYouKnow: 'A retention curve that flattens into a "smile" instead of decaying toward zero is one of the most reliable quantitative signals of product-market fit shared across growth teams at multiple well-known startups.',
  },
  {
    id: 32,
    title: 'Product-Led Growth (PLG) Loops',
    category: 'Growth',
    objectives: [
      'Study viral, content, and paid growth loop archetypes',
      'Map a growth loop for a sample product, start to finish',
      'Identify the loop\'s input and its compounding output',
      'Contrast a product-led motion against a sales-led motion',
    ],
    deliverable: 'A diagrammed growth loop for your capstone product with input and output clearly labeled',
    materials: [
      { type: 'read', label: 'Reforge — growth loops course notes' },
      { type: 'read', label: "Brian Balfour's growth loops essay" },
      { type: 'video', label: "Lenny's Podcast — PLG episodes" },
    ],
    didYouKnow: 'Dropbox\'s "get free space, give free space" referral program is a textbook growth loop, reportedly boosting signups by around 60% in its early years by turning every satisfied user into an acquisition channel.',
  },
  {
    id: 33,
    title: 'AI/LLM PM: Token Economics & Prompt Pipelines',
    category: 'Technical',
    objectives: [
      'Learn how tokens are counted and priced across different model providers',
      'Design a basic prompt pipeline: input, prompt template, model call, output',
      'Estimate per-request cost for a sample AI feature',
      'Identify where response caching can meaningfully cut token costs',
    ],
    deliverable: 'A cost model spreadsheet estimating monthly token spend for an AI feature at scale',
    materials: [
      { type: 'read', label: 'Anthropic — API documentation' },
      { type: 'tool', label: 'A model provider\'s tokenizer tool, for estimating token counts' },
      { type: 'read', label: "a16z — \"the economics of LLM apps\" article" },
    ],
    didYouKnow: "Because pricing is token-based, a needlessly chatty prompt template can silently multiply an AI feature's inference cost three to five times at scale — a real budgeting trap that catches unprepared teams.",
  },
  {
    id: 34,
    title: 'LLM Latency, Evals & Guardrails',
    category: 'Technical',
    objectives: [
      'Learn the tradeoffs between streaming and blocking response latency',
      'Design a basic eval set to test the quality of model outputs',
      'Define guardrails against unsafe or off-brand model outputs',
      'Run a manual evaluation pass across a set of sample outputs',
    ],
    deliverable: 'An eval rubric with five or more criteria, plus ten test cases and their pass/fail results',
    materials: [
      { type: 'read', label: "Anthropic's guide to writing evals" },
      { type: 'read', label: 'Humanloop — evaluation documentation' },
      { type: 'read', label: "Hamel Husain's guide to writing good evals" },
    ],
    didYouKnow: 'A large share of production LLM incidents trace back to teams that skipped a proper eval set entirely and shipped a feature purely because "it looked good in the demo."',
  },
  {
    id: 35,
    title: 'SaaS Unit Economics: CAC, LTV, NRR',
    category: 'Analytics',
    objectives: [
      'Calculate Customer Acquisition Cost (CAC) from sample spend data',
      'Calculate Lifetime Value (LTV) and the resulting LTV:CAC ratio',
      'Calculate Net Revenue Retention (NRR) for a sample account base',
      'Interpret what a healthy benchmark looks like for each metric',
    ],
    deliverable: 'A unit economics model (CAC, LTV, NRR) for a sample SaaS product, with a written health verdict',
    materials: [
      { type: 'read', label: 'SaaS Metrics 2.0 by David Skok' },
      { type: 'read', label: 'ChartMogul — SaaS benchmarks report' },
      { type: 'tool', label: 'Google Sheets — SaaS unit economics template' },
    ],
    didYouKnow: "A Net Revenue Retention above 100% means a SaaS company grows revenue from its existing customers alone, with zero new sales — it's the single metric most public SaaS investors check first.",
  },
  {
    id: 36,
    title: 'Milestone 3 — Analytics & Experimentation Growth Study',
    category: 'Analytics',
    objectives: [
      'Compile your North Star, funnel, and retention analysis into one study',
      'Compile one fully-specified A/B test design',
      'Compile your CAC/LTV/NRR unit economics model',
      'Package everything into a single growth study report',
    ],
    deliverable: 'Submit Milestone 3: a complete Analytics & Experimentation Growth Study',
    materials: [
      { type: 'read', label: 'Milestone 3 grading rubric' },
      { type: 'read', label: 'Peer review checklist for the growth study' },
      { type: 'tool', label: 'Google Slides — growth study report template' },
    ],
    didYouKnow: 'Growth teams at companies like Airbnb famously ship dozens of small experiments every week rather than betting everything on one big redesign, letting small validated wins compound into large ones.',
  },
 
  // ---------------- SEMESTER 4: Weeks 37-48 ----------------
  {
    id: 37,
    title: 'Capstone MVP Conception & Scoping',
    category: 'Career',
    objectives: [
      'Pick a capstone problem grounded in your earlier discovery work',
      'Define your MVP scope using MoSCoW prioritization',
      'Write a one-page capstone brief: problem, users, scope, timeline',
      'Get your scope reviewed for feasibility within a four-week build window',
    ],
    deliverable: 'A finalized capstone MVP brief with scope, timeline, and success metric defined',
    materials: [
      { type: 'read', label: 'The Lean Startup by Eric Ries, MVP chapter' },
      { type: 'tool', label: 'Notion — capstone brief template' },
      { type: 'read', label: 'Y Combinator — "How to Get Startup Ideas" essay' },
    ],
    didYouKnow: "Airbnb's original MVP was literally three air mattresses on the founders' apartment floor — proof that an MVP exists to test a hypothesis about demand, not to look polished.",
  },
  {
    id: 38,
    title: 'Building the MVP (Part 1)',
    category: 'Technical',
    objectives: [
      'Choose a build path — code or no-code — matched to your MVP scope',
      'Set up the project: Next.js/Supabase for a coded build, or a no-code tool',
      'Build out the core data model for your MVP',
      'Implement the primary user flow end to end',
    ],
    deliverable: 'A working core flow of your capstone MVP deployed to a staging environment',
    materials: [
      { type: 'read', label: 'Next.js — official documentation' },
      { type: 'tool', label: 'Supabase — quickstart guide' },
      { type: 'tool', label: 'Bubble or Glide — for a no-code build path' },
    ],
    didYouKnow: 'Many Y Combinator-backed startups now explicitly encourage non-technical founders to validate demand with a no-code MVP before writing a single line of production code.',
  },
  {
    id: 39,
    title: 'Building the MVP (Part 2) & QA',
    category: 'Technical',
    objectives: [
      'Complete the remaining MVP features from your scoped brief',
      'Write a manual QA test plan covering happy paths and edge cases',
      'Fix every critical bug found during QA',
      'Prepare basic analytics instrumentation before launch',
    ],
    deliverable: 'A feature-complete MVP that passes your own written QA test plan',
    materials: [
      { type: 'tool', label: 'Vercel — deployment documentation' },
      { type: 'tool', label: 'PostHog — quick install guide' },
      { type: 'read', label: 'Notion — QA test plan checklist template' },
    ],
    didYouKnow: "Many early-stage products ship with analytics as an afterthought, and then can't answer the most basic post-launch question — \"did it actually work?\" — with real data.",
  },
  {
    id: 40,
    title: 'Community Launch & Post-Launch Metrics',
    category: 'Growth',
    objectives: [
      'Prepare a Product Hunt or Twitter/X launch post',
      'Execute the launch and track metrics in real time',
      'Monitor signups and activation across the first 48 hours',
      'Write a post-launch retro noting what you would change next time',
    ],
    deliverable: 'A completed public launch with a live metrics dashboard and a written launch retro',
    materials: [
      { type: 'read', label: 'Product Hunt — launch guide' },
      { type: 'read', label: 'Build-in-public launch playbook for Twitter/X' },
      { type: 'tool', label: 'PostHog or Google Analytics — launch-day dashboard' },
    ],
    didYouKnow: 'A #1 Product Hunt launch of the day historically drives thousands of visits but converts only a small fraction into activated users — a launch is a spike, not a growth strategy.',
  },
  {
    id: 41,
    title: 'PM Portfolio Site Creation',
    category: 'Career',
    objectives: [
      'Choose a portfolio format: Notion, a personal site, or a PDF',
      'Select your three to four strongest case studies to feature',
      'Write a case study narrative for each: problem, process, outcome',
      'Publish the portfolio and confirm the live link works',
    ],
    deliverable: 'A published, shareable PM portfolio site featuring your three to four best case studies',
    materials: [
      { type: 'tool', label: 'Notion — portfolio site templates' },
      { type: 'tool', label: 'Webflow or Framer — for a custom-built site' },
      { type: 'video', label: "Lenny's Podcast — portfolio-review episodes" },
    ],
    didYouKnow: 'Hiring panels at companies like Airbnb and Spotify reportedly spend under two minutes on a first portfolio scan, making your opening case-study summary sentence the highest-leverage sentence you will write.',
  },
  {
    id: 42,
    title: "Google's X-Y-Z Resume Optimization",
    category: 'Career',
    objectives: [
      'Rewrite every bullet point using the X-Y-Z formula: accomplished X, measured by Y, by doing Z',
      'Quantify impact wherever a real number exists',
      'Cut the entire resume down to a single page',
      'Get the resume reviewed by a peer or mentor',
    ],
    deliverable: 'A finalized one-page PM resume with every bullet written in X-Y-Z format',
    materials: [
      { type: 'read', label: "Google's X-Y-Z resume formula, via Laszlo Bock" },
      { type: 'tool', label: 'Teal — resume builder' },
      { type: 'video', label: "Lenny's Podcast — resume-writing episode" },
    ],
    didYouKnow: "Google's own internal hiring guidance popularized the X-Y-Z bullet formula before it spread across the industry to become the de facto standard for resume writing.",
  },
  {
    id: 43,
    title: 'LinkedIn Profile Revamp',
    category: 'Career',
    objectives: [
      'Rewrite your headline to clearly signal your PM specialization',
      'Rewrite the About section as a clear, coherent narrative',
      'Add three to four featured projects linking to your portfolio',
      'Request two recommendations from mentors or peers',
    ],
    deliverable: 'A fully revamped LinkedIn profile aligned with your portfolio and resume',
    materials: [
      { type: 'read', label: "LinkedIn's own profile optimization guide" },
      { type: 'read', label: "Josh Fechter's LinkedIn playbook" },
      { type: 'link', label: 'Your published portfolio site link' },
    ],
    didYouKnow: "Recruiters commonly run Boolean searches against a profile's headline and skills fields before ever opening the full page, effectively turning your headline into a search-ranking field.",
  },
  {
    id: 44,
    title: 'Recruiter & PM Networking Outreach',
    category: 'Career',
    objectives: [
      'Build a target list of 15-20 companies actively hiring PMs',
      'Identify and message five PMs or recruiters every week',
      'Write a personalized outreach template you can adapt per contact',
      'Track every response in a simple outreach tracker',
    ],
    deliverable: 'A networking tracker with 15+ logged outreach attempts and at least two real conversations booked',
    materials: [
      { type: 'tool', label: 'Google Sheets — outreach tracker template' },
      { type: 'video', label: "Lenny's Podcast — networking episode" },
      { type: 'tool', label: 'LinkedIn Sales Navigator — free tier' },
    ],
    didYouKnow: 'Published hiring-funnel research at multiple large tech companies consistently shows referred candidates are hired at a meaningfully higher rate than cold applicants — making warm outreach the highest-leverage job search activity.',
  },
  {
    id: 45,
    title: 'CIRCLES Framework: Product Design Mock Interviews',
    category: 'Career',
    objectives: [
      'Learn the CIRCLES framework: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize',
      'Practice one full mock product design question start to finish',
      'Record yourself answering and review the recording critically',
      'Get structured feedback from a peer or mentor',
    ],
    deliverable: 'A recorded mock product design interview answer using the CIRCLES framework',
    materials: [
      { type: 'read', label: 'Decode and Conquer by Lewis Lin' },
      { type: 'tool', label: 'Exponent — mock interview platform' },
      { type: 'video', label: 'Product Alliance — YouTube channel' },
    ],
    didYouKnow: "CIRCLES was popularized by Lewis Lin's interview prep book and is now one of the most frequently requested frameworks in real PM interview loops at large tech companies.",
  },
  {
    id: 46,
    title: 'Root Cause Analysis: Metric Drops',
    category: 'Analytics',
    objectives: [
      'Learn the 5 Whys technique for diagnosing a problem',
      'Practice diagnosing a sample metric-drop case study',
      'Distinguish internal causes (bugs, releases) from external ones (seasonality, competitors)',
      'Present a structured root-cause hypothesis tree',
    ],
    deliverable: 'A completed root-cause analysis case study answer, presented as a hypothesis tree',
    materials: [
      { type: 'read', label: 'Exponent — root cause analysis case bank' },
      { type: 'video', label: 'Product Alliance — root cause analysis videos' },
      { type: 'tool', label: 'Google Sheets — hypothesis tree template' },
    ],
    didYouKnow: 'Interviewers frequently seed root-cause cases with a tracking or logging bug as the real answer, precisely to test whether a candidate checks data integrity before jumping straight to a product explanation.',
  },
  {
    id: 47,
    title: 'STAR Behavioral Prep',
    category: 'Career',
    objectives: [
      'Learn the STAR format: Situation, Task, Action, Result',
      'Draft six to eight STAR stories covering leadership, conflict, failure, and influence without authority',
      'Quantify the Result in every single story',
      'Rehearse delivering each story in under two minutes',
    ],
    deliverable: 'A personal STAR story bank with 6-8 polished, timed answers',
    materials: [
      { type: 'read', label: 'Cracking the PM Interview by Gayle McDowell & Jackie Bavaro' },
      { type: 'tool', label: 'Notion — STAR story tracker' },
      { type: 'tool', label: 'Exponent — behavioral question bank' },
    ],
    didYouKnow: 'Behavioral interview research consistently shows structured, past-behavior-based questions predict on-the-job performance better than unstructured, gut-feel interviews.',
  },
  {
    id: 48,
    title: 'Milestone 4 — Live Portfolio & Interview Playbook',
    category: 'Career',
    objectives: [
      'Finalize and publish your portfolio site',
      'Finalize your resume and LinkedIn profile',
      'Compile all STAR stories and RCA/CIRCLES practice into one playbook document',
      'Complete at least one full mock interview loop',
    ],
    deliverable: 'Submit Milestone 4: a live portfolio, finalized job materials, and a complete interview playbook',
    materials: [
      { type: 'read', label: 'Milestone 4 grading rubric' },
      { type: 'tool', label: 'Exponent or a mock interview partner' },
      { type: 'link', label: 'Your final, published portfolio link' },
    ],
    didYouKnow: 'The full 48-week arc mirrors a real TPM career loop — discover, build, measure, then tell the story — and the loop does not end at graduation; it simply repeats at a larger scale.',
  },
];
 
/* =========================================================================
   RESOURCE VAULT DATA
   ========================================================================= */
const BOOKS = [
  { title: 'Inspired', author: 'Marty Cagan', note: 'The foundational text on how strong product teams actually operate.' },
  { title: 'The Mom Test', author: 'Rob Fitzpatrick', note: 'How to talk to customers without leading the witness.' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', note: 'The deep-end reference for schemas, scaling, and reliability.' },
  { title: 'Cracking the PM Interview', author: 'Gayle McDowell & Jackie Bavaro', note: 'Interview prep spanning behavioral, estimation, and product design.' },
  { title: 'Continuous Discovery Habits', author: 'Teresa Torres', note: 'Weekly customer touchpoints as a system, not an occasional phase.' },
  { title: 'SaaS Metrics 2.0', author: 'David Skok', note: 'The reference model for CAC, LTV, and churn math.' },
];
 
const CHANNELS = [
  { name: "Lenny's Podcast", note: 'Long-form interviews with operators on growth, career, and craft.' },
  { name: 'Exponent', note: 'PM interview prep, mock interviews, and framework breakdowns.' },
  { name: 'Diego Granados', note: 'Day-in-the-life and practical PM skill-building content.' },
  { name: 'Product School', note: 'Certification-style lessons on core PM fundamentals.' },
  { name: 'Liam Bolling', note: 'A Google PM sharing real interview and career advice.' },
];
 
const PODCASTS = [
  { name: "Lenny's Podcast", note: 'Product, growth, and career — weekly.' },
  { name: 'Product Thinking', note: 'Frameworks for product strategy and leadership.' },
  { name: 'This is Product Management', note: 'Short, practical episodes on day-to-day PM craft.' },
];
 
const TOOL_SHEETS = [
  { name: 'Figma', note: 'Wireframes, prototypes, and design systems.', category: 'Design' },
  { name: 'Postman', note: 'Build and test API requests, mock webhook payloads.', category: 'Technical' },
  { name: 'Notion', note: 'PRDs, discovery notes, and portfolio docs.', category: 'Discovery' },
  { name: 'Supabase', note: 'Spin up a Postgres backend and auth for your MVP.', category: 'Technical' },
  { name: 'Linear', note: 'Sprint tickets, backlog grooming, and roadmaps.', category: 'Technical' },
  { name: 'Mixpanel / PostHog', note: 'Event tracking, funnels, and retention analysis.', category: 'Analytics' },
];
 
/* =========================================================================
   FRAMEWORKS DATA
   ========================================================================= */
const CIRCLES_STEPS = [
  { letter: 'C', title: 'Comprehend the situation', desc: 'Clarify the product, user, and business goal before proposing anything.' },
  { letter: 'I', title: 'Identify the customer', desc: 'Segment users and pick the specific persona you are designing for.' },
  { letter: 'R', title: "Report the customer's needs", desc: 'State the top pain points that persona faces, in their own words.' },
  { letter: 'C', title: 'Cut, through prioritization', desc: 'Narrow the wide problem space to one or two priority needs to solve.' },
  { letter: 'L', title: 'List solutions', desc: 'Brainstorm a broad, unfiltered list of possible solutions.' },
  { letter: 'E', title: 'Evaluate trade-offs', desc: 'Score solutions on user value, feasibility, and business impact.' },
  { letter: 'S', title: 'Summarize your recommendation', desc: 'Close with a clear recommendation and the metric you would track.' },
];
 
const STAR_STEPS = [
  { letter: 'S', title: 'Situation', desc: 'Set the scene: team, product, timeframe, and constraint.' },
  { letter: 'T', title: 'Task', desc: 'State your specific responsibility or the goal you owned.' },
  { letter: 'A', title: 'Action', desc: 'Describe the concrete steps you took, using "I" not "we".' },
  { letter: 'R', title: 'Result', desc: 'Quantify the outcome and name what you learned.' },
];
 
const RCA_STEPS = [
  'State the metric drop precisely: what changed, by how much, since when.',
  'Rule out tracking or logging errors first, before any product explanation.',
  'Segment the drop by platform, geography, cohort, or funnel stage.',
  'Ask "why" five times, following the strongest evidence at each step.',
  'Separate internal causes (bugs, releases) from external ones (seasonality, competitors).',
  'Propose the fix and the guardrail metric that will confirm recovery.',
];
 
/* =========================================================================
   TABS & FILTERS
   ========================================================================= */
const TABS = [
  { id: 'roadmap', label: 'Roadmap', icon: Calendar },
  { id: 'vault', label: 'Resource Vault', icon: BookOpen },
  { id: 'frameworks', label: 'Frameworks & Calculator', icon: SlidersHorizontal },
  { id: 'locker', label: 'Artifact Locker', icon: FolderOpen },
];
 
const FILTERS = [
  { id: 'all', label: 'All Weeks' },
  { id: 'active', label: 'Current Week' },
  { id: 'completed', label: 'Completed' },
  { id: 'sem-1', label: 'Semester 1' },
  { id: 'sem-2', label: 'Semester 2' },
  { id: 'sem-3', label: 'Semester 3' },
  { id: 'sem-4', label: 'Semester 4' },
];
 
/* =========================================================================
   LOCALSTORAGE HELPERS (guarded so the app never crashes if storage is blocked)
   ========================================================================= */
function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable — fail silently, state still works in-memory */
  }
}
 
/* =========================================================================
   SMALL SHARED UI PIECES
   ========================================================================= */
function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center gap-2 text-slate-300 mb-3">
      {icon}
      <h2 className="text-sm font-semibold">{title}</h2>
      {typeof count === 'number' && (
        <span style={{ fontFamily: FONT_MONO }} className="text-[10px] text-slate-500 border border-slate-800 rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
}
 
function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 text-slate-600 text-sm px-4 py-6 text-center">
      {text}
    </div>
  );
}
 
function StatCard({ icon, label, value, sub, accent, children }) {
  const colors = {
    violet: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  };
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
      <div className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border mb-2 ${colors[accent]}`}>
        {icon}
        {label}
      </div>
      <div style={{ fontFamily: FONT_MONO }} className="text-xl font-semibold text-slate-100">
        {value}
      </div>
      <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
      {children}
    </div>
  );
}
 
const MATERIAL_ICONS = { video: Video, tool: Wrench, read: BookOpen, link: Link2 };
 
/* =========================================================================
   WEEK CARD
   ========================================================================= */
function WeekCard({
  week,
  isExpanded,
  onToggleExpand,
  checklistArr,
  onToggleObjective,
  note,
  onNoteChange,
  isActive,
  onSetActive,
  bookmarks,
  onToggleBookmark,
}) {
  const total = week.objectives.length;
  const doneCount = checklistArr.filter(Boolean).length;
  const isComplete = total > 0 && doneCount === total;
  const cat = CATEGORY_STYLES[week.category];
  const sem = getSemesterForWeek(week.id);
  const isMilestone = MILESTONE_WEEKS.includes(week.id);
 
  return (
    <div className={`rounded-xl border bg-slate-900 overflow-hidden transition-colors ${isComplete ? 'border-emerald-800/60' : 'border-slate-800'}`}>
      <button onClick={onToggleExpand} className="w-full text-left px-3.5 sm:px-4 py-4 flex items-center gap-2.5 sm:gap-3 hover:bg-slate-800/40 transition-colors">
        <span
          style={{ fontFamily: FONT_MONO }}
          className={`text-[11px] px-2 py-1 rounded-md border shrink-0 ${isActive ? 'border-violet-500 text-violet-300 bg-violet-500/10' : 'border-slate-700 text-slate-400'}`}
        >
          WK-{String(week.id).padStart(2, '0')}
        </span>
        <span className={`hidden sm:inline-flex text-[10px] uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${cat.bg} ${cat.text} ring-1 ${cat.ring}`}>
          {week.category}
        </span>
        {isMilestone && (
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30 shrink-0">
            <Trophy className="w-3 h-3" />
            Milestone
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block text-sm sm:text-base font-medium text-slate-100 truncate">{week.title}</span>
          <span className="block text-xs text-slate-500">
            Semester {sem} · {doneCount}/{total} objectives
          </span>
        </span>
        {isComplete && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
 
      {isExpanded && (
        <div className="tpm-fade-in px-3.5 sm:px-4 pb-5 pt-1 border-t border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden min-w-[100px]">
              <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all" style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
            </div>
            <button
              onClick={() => onSetActive(week.id)}
              className={`text-[11px] px-2.5 py-1 rounded-full border shrink-0 transition-colors ${isActive ? 'border-violet-500 text-violet-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              {isActive ? 'Current week' : 'Set as current'}
            </button>
          </div>
 
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Weekly Objectives &amp; Checklist</span>
            </div>
            <ul className="space-y-2">
              {week.objectives.map((o, idx) => (
                <li key={idx}>
                  <button onClick={() => onToggleObjective(week.id, idx)} className="w-full flex items-start gap-2.5 text-left group">
                    {checklistArr[idx] ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 mt-0.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    )}
                    <span className={`text-sm ${checklistArr[idx] ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{o}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">End-of-Week Target &amp; Deliverable</span>
            </div>
            <p className="text-sm text-slate-300 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2.5">{week.deliverable}</p>
          </div>
 
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Wrench className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Materials, Tools &amp; Videos</span>
            </div>
            <ul className="space-y-1.5">
              {week.materials.map((m, idx) => {
                const key = `${week.id}-${idx}`;
                const Icon = MATERIAL_ICONS[m.type] || Link2;
                return (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="flex-1">{m.label}</span>
                    <button onClick={() => onToggleBookmark(key)} title="Bookmark this resource">
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarks[key] ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
 
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Did You Know?</span>
            </div>
            <p className="text-sm text-slate-400 italic leading-relaxed">{week.didYouKnow}</p>
          </div>
 
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <StickyNote className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Notes &amp; Links</span>
            </div>
            <textarea
              value={note || ''}
              onChange={(e) => onNoteChange(week.id, e.target.value)}
              placeholder="Paste project links, Figma URLs, study takeaways..."
              rows={3}
              className="w-full text-sm bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
 
/* =========================================================================
   RICE CALCULATOR
   ========================================================================= */
function RiceCalculator() {
  const [reach, setReach] = useState(500);
  const [impact, setImpact] = useState(1);
  const [confidence, setConfidence] = useState(80);
  const [effort, setEffort] = useState(2);
  const score = effort > 0 ? (reach * impact * (confidence / 100)) / effort : 0;
  const impactOptions = [
    { v: 0.25, l: 'Minimal · 0.25' },
    { v: 0.5, l: 'Low · 0.5' },
    { v: 1, l: 'Medium · 1' },
    { v: 2, l: 'High · 2' },
    { v: 3, l: 'Massive · 3' },
  ];
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400">
            Reach <span className="text-slate-600">(users / quarter)</span>
          </label>
          <input
            type="number"
            value={reach}
            onChange={(e) => setReach(Number(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Impact</label>
          <select
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {impactOptions.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400">
            Confidence <span className="text-slate-600">({confidence}%)</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full mt-3 accent-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">
            Effort <span className="text-slate-600">(person-months)</span>
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value) || 0)}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">RICE Score</span>
        <span style={{ fontFamily: FONT_MONO }} className="text-2xl font-bold text-emerald-400">
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
 
/* =========================================================================
   TAB: RESOURCE VAULT
   ========================================================================= */
function ResourceVault() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader icon={<BookOpen className="w-4 h-4" />} title="Essential Books" />
        <div className="grid sm:grid-cols-2 gap-3">
          {BOOKS.map((b) => (
            <div key={b.title} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-slate-100">{b.title}</div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </div>
              <div className="text-xs text-slate-500 mb-1.5">{b.author}</div>
              <div className="text-xs text-slate-400">{b.note}</div>
            </div>
          ))}
        </div>
      </div>
 
          <div>
        <SectionHeader icon={<Video className="w-4 h-4" />} title="YouTube Channels" />
        <div className="grid sm:grid-cols-2 gap-3">
          {CHANNELS.map((c) => (
            <div key={c.name} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <Video className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-slate-100">{c.name}</div>
                <div className="text-xs text-slate-500">{c.note}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <SectionHeader icon={<Headphones className="w-4 h-4" />} title="Podcasts" />
        <div className="grid sm:grid-cols-3 gap-3">
          {PODCASTS.map((p) => (
            <div key={p.name} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <div className="text-sm text-slate-100 mb-1">{p.name}</div>
              <div className="text-xs text-slate-500">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <SectionHeader icon={<Wrench className="w-4 h-4" />} title="Tool Cheat Sheets" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOL_SHEETS.map((t) => {
            const cat = CATEGORY_STYLES[t.category];
            return (
              <div key={t.name} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                <span className={`inline-flex text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${cat.bg} ${cat.text}`}>{t.category}</span>
                <div className="text-sm text-slate-100 mb-1">{t.name}</div>
                <div className="text-xs text-slate-500">{t.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 
/* =========================================================================
   TAB: FRAMEWORKS & CALCULATOR
   ========================================================================= */
function FrameworksTab() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader icon={<Layers className="w-4 h-4" />} title="CIRCLES — Product Design Interviews" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {CIRCLES_STEPS.map((s, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <span style={{ fontFamily: FONT_MONO }} className="text-lg font-bold text-fuchsia-400">
                {s.letter}
              </span>
              <div>
                <div className="text-sm text-slate-100">{s.title}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <SectionHeader icon={<Sparkles className="w-4 h-4" />} title="STAR — Behavioral Interviews" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {STAR_STEPS.map((s, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3.5">
              <span style={{ fontFamily: FONT_MONO }} className="text-lg font-bold text-rose-400">
                {s.letter}
              </span>
              <div>
                <div className="text-sm text-slate-100">{s.title}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <SectionHeader icon={<GitBranch className="w-4 h-4" />} title="Root Cause Analysis — 5 Whys" />
        <ol className="space-y-2">
          {RCA_STEPS.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5">
              <span style={{ fontFamily: FONT_MONO }} className="text-sky-400 shrink-0">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
 
      <div>
        <SectionHeader icon={<SlidersHorizontal className="w-4 h-4" />} title="RICE Score Calculator" />
        <RiceCalculator />
      </div>
    </div>
  );
}
 
/* =========================================================================
   TAB: ARTIFACT LOCKER
   ========================================================================= */
function ArtifactLocker({ weeks, notes, bookmarks }) {
  const withNotes = weeks.filter((w) => notes[w.id] && notes[w.id].trim().length > 0);
  const bookmarkedItems = [];
  weeks.forEach((w) =>
    w.materials.forEach((m, idx) => {
      if (bookmarks[`${w.id}-${idx}`]) bookmarkedItems.push({ week: w, material: m });
    })
  );
 
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader icon={<StickyNote className="w-4 h-4" />} title="Saved Notes & Links" count={withNotes.length} />
        {withNotes.length === 0 ? (
          <EmptyState text="No notes yet. Add project links or takeaways inside any week card." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {withNotes.map((w) => (
              <div key={w.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ fontFamily: FONT_MONO }} className="text-[10px] text-violet-300 border border-violet-500/30 bg-violet-500/10 rounded px-1.5 py-0.5">
                    WK-{String(w.id).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{w.title}</span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">{notes[w.id]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
 
      <div>
        <SectionHeader icon={<Bookmark className="w-4 h-4" />} title="Bookmarked Resources" count={bookmarkedItems.length} />
        {bookmarkedItems.length === 0 ? (
          <EmptyState text="No bookmarks yet. Tap the bookmark icon next to any resource inside a week card." />
        ) : (
          <ul className="space-y-2">
            {bookmarkedItems.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5">
                <span style={{ fontFamily: FONT_MONO }} className="text-[10px] text-slate-500 shrink-0">
                  WK-{String(b.week.id).padStart(2, '0')}
                </span>
                <span className="flex-1">{b.material.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
 
/* =========================================================================
   MAIN APP
   ========================================================================= */
export default function TPMMasterHub() {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [checklist, setChecklist] = useState({});
  const [notes, setNotes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeWeekId, setActiveWeekId] = useState(1);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [hydrated, setHydrated] = useState(false);
 
  useEffect(() => {
    setChecklist(safeGet('tpm_checklist', {}));
    setNotes(safeGet('tpm_notes', {}));
    setBookmarks(safeGet('tpm_bookmarks', {}));
    setActiveWeekId(safeGet('tpm_active_week', 1));
    setHydrated(true);
  }, []);
 
  useEffect(() => {
    if (hydrated) safeSet('tpm_checklist', checklist);
  }, [checklist, hydrated]);
  useEffect(() => {
    if (hydrated) safeSet('tpm_notes', notes);
  }, [notes, hydrated]);
  useEffect(() => {
    if (hydrated) safeSet('tpm_bookmarks', bookmarks);
  }, [bookmarks, hydrated]);
  useEffect(() => {
    if (hydrated) safeSet('tpm_active_week', activeWeekId);
  }, [activeWeekId, hydrated]);
 
  const toggleObjective = (weekId, idx) => {
    setChecklist((prev) => {
      const arr = prev[weekId] ? [...prev[weekId]] : [];
      arr[idx] = !arr[idx];
      return { ...prev, [weekId]: arr };
    });
  };
 
  const toggleBookmark = (key) => {
    setBookmarks((prev) => ({ ...prev, [key]: !prev[key] }));
  };
 
  const stats = useMemo(() => {
    let totalObjectives = 0;
    let completedObjectives = 0;
    let weeksCompleted = 0;
    const perSemester = { 1: { total: 0, done: 0 }, 2: { total: 0, done: 0 }, 3: { total: 0, done: 0 }, 4: { total: 0, done: 0 } };
 
    WEEKS.forEach((w) => {
      const arr = checklist[w.id] || [];
      const done = arr.filter(Boolean).length;
      totalObjectives += w.objectives.length;
      completedObjectives += done;
      const sem = getSemesterForWeek(w.id);
      perSemester[sem].total += 1;
      if (done === w.objectives.length && w.objectives.length > 0) {
        weeksCompleted += 1;
        perSemester[sem].done += 1;
      }
    });
 
    let streak = 0;
    for (const w of WEEKS) {
      const arr = checklist[w.id] || [];
      const done = arr.filter(Boolean).length;
      if (done === w.objectives.length) streak += 1;
      else break;
    }
 
    const pct = totalObjectives ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
    return { totalObjectives, completedObjectives, pct, weeksCompleted, perSemester, streak };
  }, [checklist]);
 
  const filteredWeeks = useMemo(() => {
    let list = WEEKS;
    if (filter === 'active') {
      list = list.filter((w) => w.id === activeWeekId);
    } else if (filter === 'completed') {
      list = list.filter((w) => {
        const arr = checklist[w.id] || [];
        return arr.filter(Boolean).length === w.objectives.length && w.objectives.length > 0;
      });
    } else if (filter.startsWith('sem-')) {
      const s = parseInt(filter.split('-')[1], 10);
      list = list.filter((w) => getSemesterForWeek(w.id) === s);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.deliverable.toLowerCase().includes(q) ||
          w.objectives.some((o) => o.toLowerCase().includes(q)) ||
          w.materials.some((m) => m.label.toLowerCase().includes(q)) ||
          w.didYouKnow.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, query, checklist, activeWeekId]);
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200" style={{ fontFamily: FONT_DISPLAY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes tpmFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .tpm-fade-in { animation: tpmFadeIn .18s ease; }
        .tpm-scrollbar::-webkit-scrollbar { height: 5px; }
        .tpm-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
      `}</style>
 
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4 text-violet-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-none truncate">KratosTech TPM</h1>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">AltSchool Africa · 12-Month Technical PM Track</p>
            </div>
          </div>
          <span
            style={{ fontFamily: FONT_MONO }}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 border border-slate-800 rounded-full px-2.5 py-1 shrink-0"
          >
            <Hash className="w-3 h-3" />
            48 WEEKS · 4 SEM
          </span>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto tpm-scrollbar pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-full whitespace-nowrap border transition-colors ${
                  activeTab === t.id ? 'bg-violet-500/15 border-violet-500/40 text-violet-200' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>
 
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'roadmap' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="Overall Progress" value={`${stats.pct}%`} sub={`${stats.completedObjectives}/${stats.totalObjectives} tasks done`} accent="violet">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{ width: `${stats.pct}%` }} />
                </div>
              </StatCard>
              <StatCard
                icon={<Flame className="w-3.5 h-3.5" />}
                label="Completion Streak"
                value={`${stats.streak} wk${stats.streak === 1 ? '' : 's'}`}
                sub={`Current: WK-${String(activeWeekId).padStart(2, '0')}`}
                accent="amber"
              />
              <StatCard icon={<Award className="w-3.5 h-3.5" />} label="Weeks Completed" value={`${stats.weeksCompleted}/48`} sub="Across all semesters" accent="emerald" />
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">Semester Breakdown</span>
                </div>
                <div className="space-y-1.5">
                  {SEMESTERS.map((s) => {
                    const d = stats.perSemester[s.id];
                    const pct = d.total ? (d.done / d.total) * 100 : 0;
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <span style={{ fontFamily: FONT_MONO }} className="text-[10px] text-slate-500 w-6">
                          S{s.id}
                        </span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 w-8 text-right">
                          {d.done}/{d.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
 
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search weeks, tools, topics... e.g. SQL, Postman, RICE, Paystack"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      filter === f.id ? 'bg-violet-500/15 border-violet-500/40 text-violet-200' : 'border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="space-y-3">
              {filteredWeeks.length === 0 ? (
                <EmptyState text="No weeks match your search or filter." />
              ) : (
                filteredWeeks.map((w) => (
                  <WeekCard
                    key={w.id}
                    week={w}
                    isExpanded={!!expanded[w.id]}
                    onToggleExpand={() => setExpanded((p) => ({ ...p, [w.id]: !p[w.id] }))}
                    checklistArr={checklist[w.id] || []}
                    onToggleObjective={toggleObjective}
                    note={notes[w.id]}
                    onNoteChange={(id, val) => setNotes((p) => ({ ...p, [id]: val }))}
                    isActive={activeWeekId === w.id}
                    onSetActive={setActiveWeekId}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                  />
                ))
              )}
            </div>
          </>
        )}
 
        {activeTab === 'vault' && <ResourceVault />}
        {activeTab === 'frameworks' && <FrameworksTab />}
        {activeTab === 'locker' && <ArtifactLocker weeks={WEEKS} notes={notes} bookmarks={bookmarks} />}
      </main>
 
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-[11px] text-slate-600 border-t border-slate-900 mt-4">
        Built for the AltSchool Africa Technical Product Management track · 48-week roadmap
      </footer>
    </div>
  );
}
 