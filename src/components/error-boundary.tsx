import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-6 text-center">
          <p className="font-sans text-xs tracking-widest uppercase text-primary">Something broke</p>
          <h1 className="text-3xl font-sans font-light">This page failed to render.</h1>
          <a
            href="/"
            className="mt-2 px-6 py-3 rounded-full border border-white/15 font-sans text-xs tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
          >
            Reload
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}
