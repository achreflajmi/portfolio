import { useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Home from '@/pages/home';
import Article from '@/pages/article';
import NotFound from '@/pages/not-found';
import { LanguageProvider, storedLang } from '@/lib/i18n';

/**
 * Sends a returning visitor who last chose French to /fr, but only from the
 * bare root — never from a link someone shared, which must stay where it points.
 *
 * This fires once, on first load, and never again. Re-running it on every
 * navigation made the toggle look broken: clicking EN from /fr landed on /,
 * which the stored "fr" preference immediately bounced back to /fr. An explicit
 * click has to beat a remembered preference.
 */
function RememberLanguage() {
  const [location, navigate] = useLocation();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (location === '/' && storedLang() === 'fr') navigate('/fr', { replace: true });
  }, [location, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <RememberLanguage />
      <Switch>
        <Route path="/">
          <LanguageProvider lang="en">
            <Home />
          </LanguageProvider>
        </Route>

        <Route path="/fr">
          <LanguageProvider lang="fr">
            <Home />
          </LanguageProvider>
        </Route>

        {/* The long-form write-ups stay in English; the French site links to
            them and labels them as such. */}
        <Route path="/writing/:slug">
          <LanguageProvider lang="en">
            <Article />
          </LanguageProvider>
        </Route>

        <Route>
          <LanguageProvider lang="en">
            <NotFound />
          </LanguageProvider>
        </Route>
      </Switch>
    </>
  );
}
