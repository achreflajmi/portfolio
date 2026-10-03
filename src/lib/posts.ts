/**
 * The three long-form posts, carried over from the previous site and kept as
 * structured data so the article page and the Writing section stay in sync.
 */

export type PostBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'list'; items: { lead?: string; text: string }[] };

export type Post = {
  slug: string;
  num: string;
  title: string;
  /** Short title for the section card, where the full one runs too long. */
  cardTitle: string;
  date: string;
  category: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  stack: string;
  blocks: PostBlock[];
};

export const POSTS: Post[] = [
  {
    slug: 'real-time-ai-nestjs-react-sse',
    num: '01',
    title: 'From API to UI: Shipping Real-Time AI Features with NestJS + React (SSE)',
    cardTitle: 'From API to UI',
    date: 'Feb 2025',
    category: 'Full-Stack · Real-Time Systems · Applied AI',
    excerpt:
      'How MASMEDIA AIDITOR ships real-time AI end to end: a NestJS pipeline, a React dashboard streaming over SSE, and a review-first UX that keeps AI output controllable.',
    cover: '/img/blog-thumb-api-ui.png',
    coverAlt: 'Cover graphic for the NestJS and React real-time AI article.',
    stack: 'NestJS • React • MongoDB • SSE • RxJS • Docker • LLM APIs • FFmpeg',
    blocks: [
      {
        kind: 'p',
        text: 'MASMEDIA AIDITOR was built to reduce the time between “a source appears” and “a publishable draft exists.” The goal was never to add AI — it was to ship a reliable product system: ingestion, processing, AI enrichment, real-time updates, human validation.',
      },
      { kind: 'h', text: 'What the product does, in one sentence' },
      {
        kind: 'p',
        text: 'AIDITOR turns raw incoming sources — links, feeds, media references — into structured items: normalised metadata, AI summaries and drafts, tags and categories, and a dashboard flow to review and publish.',
      },
      { kind: 'h', text: 'The pipeline that makes real-time possible' },
      {
        kind: 'p',
        text: 'The backend is designed around a pipeline mindset. Each item moves through stages, and each stage can report progress, store intermediate results, and fail gracefully without breaking the dashboard.',
      },
      {
        kind: 'list',
        items: [
          { lead: 'Fetch / parse', text: 'retrieve content, extract usable text and metadata.' },
          { lead: 'Clean / normalise', text: 'remove noise, standardise fields, produce consistent structure.' },
          { lead: 'AI enrichment', text: 'summaries, key points, tagging and classification, optional rewrite.' },
          { lead: 'Persist + notify', text: 'store results and push live updates to the frontend.' },
        ],
      },
      { kind: 'h', text: 'Why SSE and not polling' },
      {
        kind: 'p',
        text: 'Polling makes the UI feel delayed and wastes requests. WebSockets are powerful but add complexity when you only need server-to-client updates. Server-Sent Events were ideal here: the server streams lightweight job events and the UI updates instantly — job.created, job.progress, job.completed, job.failed.',
      },
      { kind: 'h', text: 'Making the dashboard feel alive' },
      {
        kind: 'p',
        text: 'The UI is not just showing data. It is the control surface for the pipeline. The dashboard stays responsive while jobs run in the background, and communicates trust through clear states.',
      },
      {
        kind: 'list',
        items: [
          { lead: 'Optimistic UX', text: 'a new item appears instantly, marked Processing.' },
          { lead: 'Explicit states', text: 'queued → extracting → summarising → ready.' },
          { lead: 'Failure states', text: 'failed, with a clear reason and a retry action.' },
          { lead: 'Fast rendering', text: 'update by id; never refresh the whole list.' },
        ],
      },
      { kind: 'h', text: 'The AI layer: useful, controllable, review-first' },
      {
        kind: 'p',
        text: 'The AI layer is a pipeline stage, not the entire product. That choice matters because AI calls fail, vary in quality, and should never block the user from progressing. AI output is always validated by a human in the dashboard, the source sits next to the generated draft, and a failed generation marks the item failed rather than silently degrading it.',
      },
      { kind: 'h', text: 'What I would repeat' },
      {
        kind: 'list',
        items: [
          { lead: 'Real-time UX is a product feature', text: 'progress events increase trust and reduce confusion.' },
          { lead: 'Pipelines must be resumable', text: 'treat every external call, AI included, as unreliable.' },
          { lead: 'Small events beat big payloads', text: 'push what changed and keep the UI fast.' },
          { lead: 'Quality comes from workflow', text: 'AI becomes valuable when it is editable, reviewable and traceable.' },
        ],
      },
    ],
  },
  {
    slug: 'kiddoai-rag-learning-companion',
    num: '02',
    title: 'KiddoAI: Building a RAG-based Learning Companion',
    cardTitle: 'Building KiddoAI',
    date: 'Mar 2025',
    category: 'Applied GenAI · Product Engineering',
    excerpt:
      'A practical breakdown of how KiddoAI uses RAG over curriculum PDFs, structured tutoring flows, and voice interaction to personalise learning for children.',
    cover: '/img/blog-thumb-rag-education.png',
    coverAlt: 'Cover graphic for the KiddoAI RAG article.',
    stack: 'Flutter • Spring Boot • PostgreSQL • LLM APIs • RAG • TTS/STT',
    blocks: [
      {
        kind: 'p',
        text: 'KiddoAI started as an academic MVP: help children learn through interactive lessons that adapt to their pace. The core challenge was accuracy — the assistant had to follow the official curriculum rather than invent content.',
      },
      { kind: 'h', text: 'The architecture' },
      {
        kind: 'p',
        text: 'A pragmatic product architecture: a Flutter mobile client, a Spring Boot backend API, and a knowledge layer built from curriculum PDFs. The assistant retrieves relevant curriculum chunks and uses them to answer questions and generate lessons.',
      },
      { kind: 'h', text: 'The RAG pipeline over curriculum PDFs' },
      {
        kind: 'list',
        items: [
          { text: 'Split curriculum PDFs into small chunks carrying metadata — grade, subject, chapter.' },
          { text: 'Embed the chunks and store them for retrieval.' },
          { text: 'At runtime, retrieve top-k chunks and generate responses grounded in curriculum context.' },
        ],
      },
      { kind: 'h', text: 'Product lessons learned' },
      {
        kind: 'list',
        items: [
          { lead: 'UX matters', text: 'short, guided answers outperform long explanations for children.' },
          { lead: 'Guardrails', text: 'enforce “use retrieved context first” to reduce hallucination.' },
          { lead: 'Iterate fast', text: 'ship the MVP flows early, then improve retrieval and prompts.' },
        ],
      },
    ],
  },
  {
    slug: 'sufess-hackathon-24h',
    num: '03',
    title: 'SUF’ESS: Hackathon in 24h — What We Built and What I’d Do Again',
    cardTitle: '24 Hours to a Demo',
    date: 'Jan 2025',
    category: 'Hackathon · Product Execution',
    excerpt:
      'Scope decisions, MVP architecture and demo strategy under extreme time pressure — and the parts of that approach worth repeating.',
    cover: '/img/blog-thumb-hackathon-24h.png',
    coverAlt: 'Cover graphic for the 24-hour hackathon article.',
    stack: 'FlutterFlow • Backend API • Geolocation • RAG-ready structure',
    blocks: [
      {
        kind: 'p',
        text: 'SUF’ESS was built during a 24-hour hackathon. The goal was to ship a credible MVP under extreme time pressure: a cultural exploration experience that feels modern, guided and interactive, not a static list of places.',
      },
      { kind: 'h', text: 'The problem we chose' },
      {
        kind: 'p',
        text: 'In most cities, cultural discovery is either overwhelming or boring — too much information, or no narrative. We wanted a user to open the app and immediately get a guided experience: where to go, what to see, and why it matters.',
      },
      { kind: 'h', text: 'Scope control is the real hackathon skill' },
      {
        kind: 'list',
        items: [
          { lead: 'One core journey', text: 'open → pick a theme → get a guided route → consume story cards.' },
          { lead: 'One strong demo', text: 'show a complete experience end to end, even on a small dataset.' },
          { lead: 'Defer the nice-to-haves', text: 'login, complex profiles, a large content library.' },
        ],
      },
      { kind: 'h', text: 'MVP architecture' },
      {
        kind: 'p',
        text: 'Simple and demo-friendly: a mobile-first experience on a lightweight backend, designed to extend — locations, story cards, and optional AI-driven guidance. The UI went up fast in FlutterFlow to speed iteration, with backend endpoints serving points of interest, routes and narrative content, and a RAG-ready content structure that could later power a guided assistant.',
      },
      { kind: 'h', text: 'Why people believe a demo is real' },
      {
        kind: 'list',
        items: [
          { lead: 'Start with a story', text: 'what the user wants, in ten seconds.' },
          { lead: 'Show the full loop', text: 'selection → route → narrative → next step.' },
          { lead: 'Make it visual', text: 'clean screens, consistent design, no text overload.' },
        ],
      },
      { kind: 'h', text: 'What I would do again' },
      {
        kind: 'list',
        items: [
          { text: 'Design the MVP around a single moment worth showing.' },
          { text: 'Keep the system modular so improvements are easy after the hackathon.' },
          { text: 'Prioritise a demo that runs smoothly over adding extra features.' },
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
