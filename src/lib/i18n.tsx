import { createContext, useContext, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'fr';

export const LANGS: Lang[] = ['en', 'fr'];

const STORAGE_KEY = 'al-lang';

const LangContext = createContext<Lang>('en');

/* Mirrors what scripts/prerender-meta.mjs bakes into each HTML entry point.
   Crawlers read the prerendered head; this keeps the live tab correct when the
   toggle switches language without a page load. */
const HEAD: Record<Lang, { title: string; description: string }> = {
  en: {
    title: 'Achref Lajmi',
    description:
      'Achref Lajmi — backend, full-stack and applied AI engineer in Berlin. Building systems that survive contact with production.',
  },
  fr: {
    title: 'Achref Lajmi — Ingénieur backend, full-stack & IA appliquée',
    description:
      'Achref Lajmi, ingénieur logiciel à Berlin : backend, full-stack et IA appliquée. Je conçois des systèmes qui survivent au contact de la production.',
  },
};

export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = lang;

    // An article sets its own title and restores it on unmount, so only touch
    // the head here when the home page is what is showing.
    const onHome = location.pathname === '/' || location.pathname === '/fr';
    if (onHome) {
      document.title = HEAD[lang].title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', HEAD[lang].description);
      document.querySelector('link[rel="canonical"]')
        ?.setAttribute('href', `https://achreflajmi.netlify.app${lang === 'fr' ? '/fr' : '/'}`);
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode / blocked storage — the prefix in the URL still works */
    }
  }, [lang]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Picks the copy for the active language out of a bilingual record. */
export function useCopy<T>(dict: Record<Lang, T>): T {
  return dict[useLang()];
}

/** Reads the language a returning visitor last chose. */
export function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'en' || v === 'fr' ? v : null;
  } catch {
    return null;
  }
}

/** Prefixes an in-site path with the language segment. */
export function path(lang: Lang, to = '/') {
  const clean = to === '/' ? '' : to;
  return lang === 'fr' ? `/fr${clean}` : clean || '/';
}

/** The CV that matches the language on screen. */
export function cvHref(lang: Lang) {
  return lang === 'fr' ? '/cv/Achref_Lajmi_CV_FR.pdf' : '/cv/Achref_Lajmi_CV.pdf';
}
