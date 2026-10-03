import { Route, Switch } from 'wouter';
import Home from '@/pages/home';
import Article from '@/pages/article';
import NotFound from '@/pages/not-found';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/writing/:slug" component={Article} />
      <Route component={NotFound} />
    </Switch>
  );
}
