import { useMemo, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { Lock, Play } from 'lucide-react';
import { useSectionInView } from '@/lib/use-section-in-view';
import { SectionHeader } from '@/components/ui/section-header';
import { Watermark } from '@/components/ui/watermark';
import { cn } from '@/lib/utils';
import { useCopy, type Lang } from '@/lib/i18n';

type Feature = { text: string; highlight: string[] };

type Project = {
  title: string;
  tag: string;
  descA: string;
  descB: string;
  features: Feature[];
  tech: string[];
  /** Pages the project is split across while the section is pinned. */
  featureGroups: number[];
  videoId?: string;
  poster?: { src: string; webp?: string; width: number; height: number; alt: string; portrait?: boolean };
  links?: { label: string; href: string }[];
  note?: string;
};

const PROJECTS_EN: Project[] = [
  {
    title: 'AI-Powered Multichannel E-Commerce Platform with an autonomous AI Deal Engine',
    tag: 'Flagship · recash',
    descA:
      'An autonomous deal engine closing a four-stage loop: nightly inventory health scoring, AI-mediated price negotiation, targeted deal distribution, and a feedback-driven learning loop.',
    descB:
      'Autonomy and human oversight stay separable concerns — no price reaches the catalogue without a human decision stamped on the record it concerns.',
    features: [
      {
        text: '200 products scored nightly; 61 pricing opportunities queued with no manual initiation.',
        highlight: ['200', '61'],
      },
      {
        text: 'Three-signal hybrid semantic search — pgvector embeddings, PostgreSQL full-text and keyword ranking — shipped to production, returning relevant results for queries sharing no literal words with the listing.',
        highlight: ['pgvector', 'PostgreSQL full-text'],
      },
      {
        text: 'Behavioural recommendation engine with a per-buyer taste vector and a 25–35% discovery fraction under an enforced brand-diversity floor; later inverted to match live deals to the buyers most likely to want them.',
        highlight: ['25–35%'],
      },
      {
        text: 'Learning loop adjusting matching weights nightly within fixed safety bounds — moved the size-fit weight from 0.10 to 0.42 autonomously, never overwriting a human-set value.',
        highlight: ['0.10', '0.42'],
      },
      {
        text: 'Agentic AI assistant, Claude via the Vercel AI SDK, grounded in live data through a fixed, user-scoped tool menu.',
        highlight: ['Claude', 'Vercel AI SDK'],
      },
      {
        text: 'Production eBay connector (REST and Trading APIs) plus code-complete Shopify Admin and Amazon SP-API integrations; rebuilt order management to handle all four financial edit scenarios correctly.',
        highlight: ['eBay', 'Shopify Admin', 'Amazon SP-API'],
      },
      {
        text: 'Enforced human-in-the-loop guarantees and auditability: no price reaches the catalogue without an administrator decision stamped on the record it concerns, backed by append-only ledgers and row-level access scoping.',
        highlight: ['append-only ledgers', 'row-level access scoping'],
      },
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'pgvector', 'Trigger.dev', 'Claude API via OpenRouter', 'Vercel'],
    featureGroups: [2, 2, 3],
    note: 'Company code, not public. I can walk through it in an interview.',
  },
  {
    title: 'MASMEDIA AIDITOR',
    tag: 'AI Journalism',
    descA:
      'An AI journalism platform built solo across two modules: real-time livestream coverage, and a configurable scraper over 30 tech sources.',
    descB: '',
    features: [
      {
        text: 'PARROT covers livestreams end to end: Streamlink audio into AssemblyAI streaming transcription, GPT-4 key-moment detection, then multi-platform content generation. 3.2 s latency at 84% precision.',
        highlight: ['AssemblyAI', 'GPT-4', '3.2 s', '84%'],
      },
      {
        text: 'Validated live: 8 of 8 announcements caught on an Apple keynote with a 73% cut in coverage time, and 15 of 16 on Google I/O.',
        highlight: ['8 of 8', '73%', '15 of 16'],
      },
      {
        text: 'SWALLO scrapes 30 tech sources with GPT-4 relevance filtering: 1,247 articles in a seven-day run at 84% precision.',
        highlight: ['1,247', '84%'],
      },
      {
        text: 'Event coverage dropped from 4h30 to 1h20; daily monitoring from 4 hours to 12 minutes; three people per live event to one.',
        highlight: ['4h30', '1h20', '12 minutes'],
      },
      {
        text: 'Automated publishing to Facebook, Instagram and Twitter over OAuth 2.0 with encrypted token storage and pre-expiry refresh; exponential-backoff retries and a response cache cut GPT-4 API spend by 35%.',
        highlight: ['OAuth 2.0', '35%'],
      },
      {
        text: 'Streamed live transcripts and detected moments to the UI over Server-Sent Events; shipped 95 unit and integration tests at 88% coverage with Jest, Supertest and in-memory MongoDB.',
        highlight: ['Server-Sent Events', '95', '88%'],
      },
    ],
    tech: ['NestJS', 'TypeScript', 'MongoDB', 'GPT-4', 'AssemblyAI', 'FFmpeg', 'Streamlink', 'Cheerio', 'Jest', 'Docker'],
    featureGroups: [2, 2, 2],
    videoId: 'aoA7SMIzSG4',
    poster: {
      src: '/img/masmedia-800.jpg',
      webp: '/img/masmedia-800.webp',
      width: 1280,
      height: 634,
      alt: 'The MASMEDIA AIDITOR dashboard: a generated article draft beside per-platform Twitter, Instagram and Facebook post panels.',
    },
  },
  {
    title: 'Kiddo AI',
    tag: 'Education',
    descA:
      'An educational app for Tunisian first-year primary pupils (age 6), with an AI tutor speaking Tunisian Arabic, cloned-voice synthesis and avatar-based personalisation.',
    descB: '',
    features: [
      {
        text: 'Five-person academic team; I was principal author of the Flutter client’s second version — roughly 3,100 of its 4,400 lines.',
        highlight: ['3,100', '4,400'],
      },
      {
        text: 'Restructured the client onto MVVM with a dedicated service layer, replacing view-embedded state and network calls.',
        highlight: ['MVVM'],
      },
      {
        text: 'Integrated the voice loop across three runtimes — Flutter client, Spring Boot API, external inference service — including the decode chain that keeps Arabic text intact through transcription, generation and speech synthesis.',
        highlight: ['three runtimes', 'decode chain'],
      },
    ],
    tech: ['Flutter', 'Spring Boot', 'MongoDB', 'OpenAI', 'STT / TTS', 'MVVM'],
    featureGroups: [2, 1],
    videoId: 'NfDOhjPF7VM',
    poster: {
      src: '/img/kiddoai-290.jpg',
      webp: '/img/kiddoai-290.webp',
      width: 290,
      height: 720,
      alt: 'The Kiddo AI writing board on a phone, with handwritten Arabic traced across ruled guidelines.',
      portrait: true,
    },
    links: [{ label: 'Flutter client', href: 'https://github.com/achreflajmi/KiddoAI-Front' }],
  },
  {
    title: 'MoodyMap',
    tag: 'iOS · SwiftUI',
    descA:
      'A SwiftUI study planner that reads how the day actually went and plans around it. 10 screens, 18 endpoints, about 5,000 lines of Swift.',
    descB: '',
    features: [
      {
        text: 'Built the emotion-capture pipeline: hand-assembled RFC 2388 multipart uploads over URLSession with JPEG re-compression and a five-branch error taxonomy, feeding a server-side facial-emotion model.',
        highlight: ['RFC 2388', 'URLSession'],
      },
      {
        text: 'Bridged camera and photo-library permissions across AVFoundation and PhotosUI — two permission systems with different state vocabularies — into SwiftUI through a UIViewControllerRepresentable coordinator.',
        highlight: ['AVFoundation', 'PhotosUI', 'UIViewControllerRepresentable'],
      },
      {
        text: 'Parallelised the home screen with withTaskGroup, loading profile, mood statistics, recommendations, notifications and a daily quote concurrently with independent failure handling.',
        highlight: ['withTaskGroup'],
      },
      {
        text: 'Turned unstructured LLM study-plan prose into an interactive, checkable task list — consuming non-deterministic model output with no schema.',
        highlight: ['LLM'],
      },
    ],
    tech: ['SwiftUI', 'MVVM', 'async/await', 'Swift Charts', 'URLSession'],
    featureGroups: [2, 2],
    videoId: 'S_biZwKb0QQ',
    poster: {
      src: '/img/moodymap-240.jpg',
      webp: '/img/moodymap-240.webp',
      width: 240,
      height: 360,
      alt: 'The MoodyMap check-in screen on an iPhone, asking how well the user could concentrate today with four graded answers.',
      portrait: true,
    },
    links: [{ label: 'iOS app', href: 'https://github.com/achreflajmi/FrontIOSMoodyMap' }],
  },
  {
    title: 'SUF’ESS',
    tag: 'Hackathon · 24h',
    descA:
      'A 24-hour hackathon MVP: location-based cultural storytelling with prototype AI guided tours.',
    descB: '',
    features: [
      {
        text: 'Shipped a working location-based storytelling MVP with prototype AI guided-tour features in a single 24-hour build.',
        highlight: ['24-hour'],
      },
      {
        text: 'Scoped the build to a demonstrable core under a hard deadline, trading breadth for a path that ran end to end on stage.',
        highlight: [],
      },
    ],
    tech: ['FlutterFlow', 'RAG', 'Geolocation', '3D'],
    featureGroups: [2],
    videoId: 'NwJ0WE14vEM',
    poster: {
      src: '/img/sufess-800.jpg',
      webp: '/img/sufess-800.webp',
      width: 960,
      height: 720,
      alt: "The SUF'ESS guided-tour screen on a phone, showing a Roman fountain beside an illustrated narrator.",
    },
  },
];

const UI: Record<Lang, {
  kicker: string;
  title: string;
  cont: string;
  locked: string;
  figures: { k: string; v: string }[];
}> = {
  en: {
    kicker: 'Selected works',
    title: 'Things I built',
    cont: 'cont.',
    locked: 'Company code, not public. I can walk through it in an interview.',
    figures: [
      { k: 'Scored nightly', v: '200' },
      { k: 'Deals queued', v: '61' },
      { k: 'Weight moved', v: '0.10→0.42' },
    ],
  },
  fr: {
    kicker: 'Travaux s\u00e9lectionn\u00e9s',
    title: 'Ce que j\u2019ai construit',
    cont: 'suite',
    locked: 'Code propri\u00e9taire, non public. Je peux le pr\u00e9senter en entretien.',
    figures: [
      { k: '\u00c9valu\u00e9s chaque nuit', v: '200' },
      { k: 'Deals g\u00e9n\u00e9r\u00e9s', v: '61' },
      { k: 'Pond\u00e9ration ajust\u00e9e', v: '0,10\u21920,42' },
    ],
  },
};


/* French copy, taken from the French master CV rather than translated from the
   English site, so both read in Achref's own words. Media, tech chips and
   metrics are shared from the English entries above. */
type Localised = Pick<Project, 'tag' | 'descA' | 'descB' | 'features'> &
  Partial<Pick<Project, 'featureGroups' | 'note'>>;

const FR_TEXT: Localised[] = [
  {
    tag: 'Projet phare \u00b7 recash',
    /* French runs longer than English, so this project needs one extra page
       to keep every bullet inside the pinned frame. */
    featureGroups: [2, 2, 2, 1],
    descA:
      'Un moteur de deals autonome en boucle ferm\u00e9e : scoring nocturne des stocks, n\u00e9gociation de prix assist\u00e9e par IA, diffusion cibl\u00e9e et boucle d\u2019apprentissage.',
    descB:
      'L\u2019autonomie et le contr\u00f4le humain restent deux sujets distincts : aucun prix n\u2019atteint le catalogue sans une d\u00e9cision d\u2019administrateur inscrite sur la fiche concern\u00e9e.',
    note: 'Code propri\u00e9taire, non public. Je peux le pr\u00e9senter en entretien.',
    features: [
      {
        text: '200 produits \u00e9valu\u00e9s chaque nuit et 61 opportunit\u00e9s de prix g\u00e9n\u00e9r\u00e9es sans aucune intervention manuelle.',
        highlight: ['200', '61'],
      },
      {
        text: 'Remplacement de la recherche par mots-cl\u00e9s par un moteur de recherche hybride \u00e0 trois signaux \u2014 embeddings pgvector, plein texte PostgreSQL et mots-cl\u00e9s \u2014 mis en production.',
        highlight: ['pgvector', 'PostgreSQL'],
      },
      {
        text: 'Moteur de recommandation comportemental avec un vecteur de go\u00fbt par acheteur et 25\u201335 % de d\u00e9couverte sous contrainte de diversit\u00e9 des marques ; invers\u00e9 ensuite pour relier les deals aux acheteurs les plus susceptibles de les vouloir.',
        highlight: ['25\u201335 %'],
      },
      {
        text: 'Boucle d\u2019apprentissage ajustant chaque nuit les pond\u00e9rations dans des bornes de s\u00e9curit\u00e9 fixes \u2014 le poids de la taille est pass\u00e9 de 0,10 \u00e0 0,42 de lui-m\u00eame, sans jamais \u00e9craser une valeur d\u00e9finie par un humain.',
        highlight: ['0,10', '0,42'],
      },
      {
        text: 'Assistant IA agentique (Claude via le SDK IA de Vercel) ancr\u00e9 dans les donn\u00e9es de la marketplace par un menu d\u2019outils fixe, limit\u00e9 au p\u00e9rim\u00e8tre de l\u2019utilisateur.',
        highlight: ['Claude'],
      },
      {
        text: 'Connecteur eBay en production (API REST et Trading) et int\u00e9grations Shopify Admin et Amazon SP-API termin\u00e9es ; refonte de la gestion des commandes pour traiter correctement les quatre sc\u00e9narios d\u2019\u00e9dition financi\u00e8re.',
        highlight: ['eBay', 'Shopify Admin', 'Amazon SP-API'],
      },
      {
        text: 'Garanties de contr\u00f4le humain et tra\u00e7abilit\u00e9 : aucun prix n\u2019atteint le catalogue sans d\u00e9cision d\u2019administrateur, adoss\u00e9e \u00e0 des journaux en ajout seul et \u00e0 un cloisonnement des acc\u00e8s par ligne.',
        highlight: ['journaux en ajout seul'],
      },
    ],
  },
  {
    tag: 'Journalisme IA',
    descA:
      'Une plateforme de journalisme assist\u00e9 par IA pour une r\u00e9daction tech, livr\u00e9e seul sur deux modules : couverture de livestreams en temps r\u00e9el et scraper configurable sur 30 sources.',
    descB: '',
    features: [
      {
        text: 'PARROT couvre les livestreams de bout en bout : audio Streamlink, transcription en streaming AssemblyAI, d\u00e9tection des moments cl\u00e9s par GPT-4, puis g\u00e9n\u00e9ration multi-plateforme. Latence de 3,2 s, pr\u00e9cision de 84 %.',
        highlight: ['AssemblyAI', 'GPT-4', '3,2 s', '84 %'],
      },
      {
        text: 'Valid\u00e9 en direct : 8 annonces sur 8 d\u00e9tect\u00e9es sur une keynote Apple, avec 73 % de temps de couverture en moins, et 15 sur 16 sur Google I/O.',
        highlight: ['8 annonces sur 8', '73 %', '15 sur 16'],
      },
      {
        text: 'SWALLO parcourt 30 sources tech avec un filtrage de pertinence GPT-4 : 1 247 articles trait\u00e9s sur sept jours \u00e0 84 % de pr\u00e9cision.',
        highlight: ['1 247', '84 %'],
      },
      {
        text: 'Temps de couverture d\u2019un \u00e9v\u00e9nement r\u00e9duit de 4h30 \u00e0 1h20, veille quotidienne de 4 heures \u00e0 12 minutes, et \u00e9quipe par direct ramen\u00e9e de trois personnes \u00e0 une.',
        highlight: ['4h30', '1h20', '12 minutes'],
      },
      {
        text: 'Publication automatis\u00e9e sur Facebook, Instagram et Twitter via OAuth 2.0, avec stockage chiffr\u00e9 des jetons et renouvellement avant expiration ; les relances exponentielles et un cache ont r\u00e9duit de 35 % les co\u00fbts d\u2019API GPT-4.',
        highlight: ['OAuth 2.0', '35 %'],
      },
      {
        text: 'Transcriptions et moments d\u00e9tect\u00e9s diffus\u00e9s vers l\u2019interface en Server-Sent Events ; 95 tests unitaires et d\u2019int\u00e9gration \u00e0 88 % de couverture avec Jest, Supertest et MongoDB en m\u00e9moire.',
        highlight: ['Server-Sent Events', '95', '88 %'],
      },
    ],
  },
  {
    tag: '\u00c9ducation',
    descA:
      'Une application \u00e9ducative pour des enfants de 6 ans, avec un tuteur IA parlant l\u2019arabe tunisien, une voix clon\u00e9e et un avatar personnalisable.',
    descB: '',
    features: [
      {
        text: '\u00c9quipe acad\u00e9mique de cinq personnes ; auteur principal de la seconde version du client Flutter \u2014 environ 3 100 de ses 4 400 lignes.',
        highlight: ['3 100', '4 400'],
      },
      {
        text: 'Refonte du client en MVVM avec une couche de services d\u00e9di\u00e9e, en remplacement de l\u2019\u00e9tat et des appels r\u00e9seau log\u00e9s dans les vues.',
        highlight: ['MVVM'],
      },
      {
        text: 'Int\u00e9gration de la boucle vocale sur trois environnements \u2014 client Flutter, API Spring Boot, service d\u2019inf\u00e9rence externe \u2014 dont la cha\u00eene de d\u00e9codage qui pr\u00e9serve le texte arabe de la transcription \u00e0 la synth\u00e8se vocale.',
        highlight: ['trois environnements', 'cha\u00eene de d\u00e9codage'],
      },
    ],
  },
  {
    tag: 'iOS \u00b7 SwiftUI',
    descA:
      'Un planificateur d\u2019\u00e9tudes SwiftUI qui tient compte du d\u00e9roulement r\u00e9el de la journ\u00e9e. 10 \u00e9crans, 18 endpoints, environ 5 000 lignes de Swift.',
    descB: '',
    features: [
      {
        text: 'Pipeline de capture d\u2019\u00e9motion : envoi multipart RFC 2388 assembl\u00e9 \u00e0 la main sur URLSession, avec recompression JPEG et une taxonomie d\u2019erreurs \u00e0 cinq branches, alimentant un mod\u00e8le d\u2019\u00e9motion faciale c\u00f4t\u00e9 serveur.',
        highlight: ['RFC 2388', 'URLSession'],
      },
      {
        text: 'Passerelle entre les permissions cam\u00e9ra et phototh\u00e8que d\u2019AVFoundation et PhotosUI \u2014 deux syst\u00e8mes aux vocabulaires d\u2019\u00e9tat diff\u00e9rents \u2014 vers SwiftUI via un coordinateur UIViewControllerRepresentable.',
        highlight: ['AVFoundation', 'PhotosUI', 'UIViewControllerRepresentable'],
      },
      {
        text: 'Parall\u00e9lisation de l\u2019\u00e9cran d\u2019accueil avec withTaskGroup : profil, statistiques d\u2019humeur, recommandations, notifications et citation du jour charg\u00e9s simultan\u00e9ment, chacun avec sa propre gestion d\u2019erreur.',
        highlight: ['withTaskGroup'],
      },
      {
        text: 'Transformation de plans d\u2019\u00e9tudes g\u00e9n\u00e9r\u00e9s par LLM en listes de t\u00e2ches cochables \u2014 exploiter une sortie non d\u00e9terministe sans aucun sch\u00e9ma.',
        highlight: ['LLM'],
      },
    ],
  },
  {
    tag: 'Hackathon \u00b7 24h',
    descA:
      'Un MVP de hackathon en 24 heures : narration culturelle g\u00e9olocalis\u00e9e avec des visites guid\u00e9es par IA \u00e0 l\u2019\u00e9tat de prototype.',
    descB: '',
    features: [
      {
        text: 'MVP fonctionnel de narration g\u00e9olocalis\u00e9e, visites guid\u00e9es par IA comprises, livr\u00e9 en une seule session de 24 heures.',
        highlight: ['24 heures'],
      },
      {
        text: 'P\u00e9rim\u00e8tre resserr\u00e9 autour d\u2019un c\u0153ur d\u00e9montrable sous contrainte de temps, en \u00e9changeant l\u2019\u00e9tendue contre un parcours qui tournait de bout en bout sur sc\u00e8ne.',
        highlight: [],
      },
    ],
  },
];

const PROJECTS: Record<Lang, Project[]> = {
  en: PROJECTS_EN,
  fr: PROJECTS_EN.map((proj, i) => ({ ...proj, ...FR_TEXT[i] })),
};

/* Slots are generated from each project's featureGroups configuration. */
/** Descriptive titles need a smaller scale than short product names, or they
 *  push the rest of the card out of its fixed-height frame. */
function isLongTitle(title: string) {
  return title.length > 28;
}

function buildSlots(projects: Project[]) {
  return projects.flatMap((proj, projIdx) => proj.featureGroups.map((_, page) => ({ projIdx, page })));
}

/* ─── Feature text renderer (highlights keywords in cyan) ─────── */
function FeatureText({ text, highlight }: Feature) {
  if (!highlight.length) return <span className="block">{text}</span>;

  const escaped = highlight.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="block">
      {parts.map((part, i) =>
        highlight.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="text-primary font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

/* ─── Media panel: poster until clicked, then the real embed ──── */
function ProjectMedia({ proj, compact }: { proj: Project; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ui = useCopy(UI);

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-background/40 backdrop-blur-md flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

      {/* Confidential work gets a built panel instead of a demo */}
      {!proj.videoId && (
        <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
          <div className="w-16 h-16 rounded-full border border-gate/40 bg-gate/5 flex items-center justify-center text-gate">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="font-sans text-sm text-white/55 max-w-xs leading-relaxed">{ui.locked}</p>
          <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 border-t border-white/10">
            {ui.figures.map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <dd className="font-sans font-light text-xl text-primary leading-none">{f.v}</dd>
                <dt className="font-sans text-[11px] lg:text-[9px] tracking-widest uppercase text-white/35">{f.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Poster + play */}
      {proj.videoId && !playing && proj.poster && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 group cursor-pointer"
        >
          <picture>
            {proj.poster.webp && <source type="image/webp" srcSet={proj.poster.webp} />}
            <img
              src={proj.poster.src}
              width={proj.poster.width}
              height={proj.poster.height}
              loading="lazy"
              decoding="async"
              alt={proj.poster.alt}
              className={cn(
                'w-full h-full',
                proj.poster.portrait ? 'object-contain py-4' : 'object-cover',
              )}
            />
          </picture>
          <span className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/25 bg-background/60 backdrop-blur-xl flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all duration-300">
            <Play className={compact ? 'w-6 h-6 ml-1' : 'w-8 h-8 ml-1'} aria-hidden="true" />
          </span>
          <span className="sr-only">Play the {proj.title} demo</span>
        </button>
      )}

      {proj.videoId && playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${proj.videoId}?rel=0&autoplay=1`}
          title={`${proj.title} demo video`}
          className="absolute inset-0 w-full h-full z-20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}

/* ─── Desktop content card ───────────────────────────────────── */
function DesktopCard({
  proj,
  page,
  transitionSpec,
  shouldReduceMotion,
  cont,
}: {
  proj: Project;
  page: number;
  transitionSpec: object;
  shouldReduceMotion: boolean | null;
  cont: string;
}) {
  const startIndex = proj.featureGroups.slice(0, page).reduce((sum, count) => sum + count, 0);
  const visibleCount = proj.featureGroups[page] ?? proj.features.length;
  const currentFeatures = proj.features.slice(startIndex, startIndex + visibleCount);
  const currentDesc = page === 0 ? proj.descA : proj.descB;

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
      transition={transitionSpec}
      className="absolute inset-0 w-full flex flex-col justify-start pt-2"
    >
      {page === 0 ? (
        <div className="flex flex-col gap-2 mb-4">
          <p className="font-sans text-[12px] lg:text-[10px] tracking-widest uppercase text-primary">{proj.tag}</p>
          <h3
            className={cn(
              'font-sans font-light leading-tight text-white',
              isLongTitle(proj.title)
                ? 'text-xl md:text-2xl lg:text-[1.7rem]'
                : 'text-3xl md:text-4xl lg:text-5xl',
            )}
            translate="no"
          >
            {proj.title}
          </h3>
        </div>
      ) : (
        <h3
          className={cn(
            'font-sans font-light leading-tight text-white/60 mb-3',
            isLongTitle(proj.title) ? 'text-base md:text-lg' : 'text-2xl',
          )}
          translate="no"
        >
          {proj.title}
          <span className="text-primary text-sm font-sans tracking-widest uppercase ml-3">{cont}</span>
        </h3>
      )}

      {currentDesc && (
        <p className="text-white/60 font-sans text-sm leading-snug mb-5">{currentDesc}</p>
      )}

      <div className="flex flex-col mb-3">
        {currentFeatures.map((feat, i) => (
          <div
            key={i}
            className="py-2.5 border-b border-white/10 text-sm md:text-[0.95rem] font-sans leading-relaxed text-white/80"
          >
            <FeatureText text={feat.text} highlight={feat.highlight} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4">
        {proj.tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 font-mono text-[12px] lg:text-[11px] text-primary/90 leading-none"
          >
            {t}
          </span>
        ))}
      </div>

      {proj.links && (
        <div className="flex flex-wrap gap-4 mt-4">
          {proj.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] py-2 font-sans text-xs tracking-widest uppercase text-white/70 underline underline-offset-4 decoration-white/25 hover:text-primary hover:decoration-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export function ProjectsSection() {
  const ref = useSectionInView(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const ui = useCopy(UI);
  const projects = useCopy(PROJECTS);
  const slots = useMemo(() => buildSlots(projects), [projects]);
  const totalSlots = slots.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeSlot, setActiveSlot] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const slot = Math.min(totalSlots - 1, Math.floor(latest * totalSlots * 0.999));
    if (slot !== activeSlot) setActiveSlot(slot);
  });

  const transitionSpec = {
    duration: shouldReduceMotion ? 0 : 0.65,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const { projIdx, page } = slots[Math.min(activeSlot, totalSlots - 1)];
  const activeProj = projects[projIdx];

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLElement>} className="relative bg-background">
      {/* ── DESKTOP: pinned scroll ── */}
      <div
        ref={containerRef}
        style={{ height: `${totalSlots * 90}vh` }}
        className="hidden lg:block relative"
      >
        <div className="sticky top-0 h-screen h-[100dvh] w-full flex items-start justify-center overflow-hidden pt-14 pb-10">
          {/* Giant background odometer */}
          <Watermark className="text-[35vw] md:text-[40vw] text-transparent">
            <span className="text-white/[0.04]">0</span>
            <div className="h-[0.8em] overflow-hidden relative text-white/[0.06] font-sans font-light">
              <motion.div
                animate={{ y: `calc(-${projIdx} * 0.8em)` }}
                transition={transitionSpec}
                className="flex flex-col"
              >
                {Array.from({ length: projects.length }, (_, i) => i + 1).map((num) => (
                  <div key={num} className="h-[0.8em] flex items-center justify-center pb-2">
                    {num}
                  </div>
                ))}
              </motion.div>
            </div>
          </Watermark>

          <div className="w-full max-w-[90rem] mx-auto px-12 lg:px-24 flex flex-row items-center justify-between gap-16 xl:gap-24 relative z-10 h-full">
            {/* LEFT: media */}
            <div className="flex-1 w-full">
              <ProjectMedia key={activeProj.title} proj={activeProj} />
            </div>

            {/* RIGHT: content */}
            <div className="w-[460px] xl:w-[510px] shrink-0">
              <div className="relative h-[520px] w-full">
                <AnimatePresence mode="popLayout">
                  <DesktopCard
                    key={activeSlot}
                    proj={activeProj}
                    page={page}
                    transitionSpec={transitionSpec}
                    shouldReduceMotion={shouldReduceMotion}
                    cont={ui.cont}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: stacked ── */}
      <div className="block lg:hidden py-32 px-6 md:px-12 relative z-10 w-full max-w-3xl mx-auto">
        <SectionHeader subtitle={ui.kicker} title={ui.title} />

        <div className="flex flex-col gap-28">
          {projects.map((proj, idx) => (
            <div key={proj.title} className="flex flex-col gap-7">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-primary/50 font-sans font-light text-3xl leading-none tracking-tighter">
                    0{idx + 1}
                  </span>
                  <h3
                    className={cn(
                      'font-sans font-light leading-tight text-white',
                      isLongTitle(proj.title) ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl',
                    )}
                    translate="no"
                  >
                    {proj.title}
                  </h3>
                </div>
                <p className="font-sans text-[12px] lg:text-[10px] tracking-widest uppercase text-primary mt-2">
                  {proj.tag}
                </p>
                <p className="text-white/55 font-sans text-sm leading-relaxed mt-2">{proj.descA}</p>
                {proj.descB && (
                  <p className="text-white/45 font-sans text-sm leading-relaxed mt-1">{proj.descB}</p>
                )}
              </div>

              <ProjectMedia proj={proj} compact />

              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 font-mono text-[12px] lg:text-[11px] text-primary/90 leading-none"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col">
                {proj.features.map((feat, i) => (
                  <div
                    key={i}
                    className="py-3 border-b border-white/10 text-sm font-sans leading-relaxed text-white/75 flex items-start gap-2"
                  >
                    <span className="text-primary/50 shrink-0 mt-0.5" aria-hidden="true">
                      —
                    </span>
                    <FeatureText text={feat.text} highlight={feat.highlight} />
                  </div>
                ))}
              </div>

              {proj.links && (
                <div className="flex flex-wrap gap-4">
                  {proj.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[44px] py-2 font-sans text-xs tracking-widest uppercase text-white/70 underline underline-offset-4 decoration-white/25 hover:text-primary transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
