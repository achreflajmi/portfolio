import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-background text-foreground px-6 text-center">
      <p className="font-mono text-xs tracking-widest uppercase text-primary">404</p>
      <h1 className="text-4xl md:text-5xl font-sans font-light">This page doesn&rsquo;t exist.</h1>
      <Link
        href="/"
        className="mt-4 px-7 py-3.5 rounded-full border border-white/15 font-sans text-xs tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
      >
        Back to the portfolio
      </Link>
    </div>
  );
}
