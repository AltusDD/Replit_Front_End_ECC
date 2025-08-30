import React from 'react';
type P = { children: React.ReactNode };
type S = { error: Error | null };
export default class ErrorBoundary extends React.Component<P, S> {
  constructor(p: P) {
    super(p);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(e: Error, info: any) {
    console.error('App error:', e, info);
  }
  render() {
    return this.state.error ? (
      <div className="panel">
        <h2>Something went wrong</h2>
        <pre className="code">{String(this.state.error)}</pre>
      </div>
    ) : (
      this.props.children
    );
  }
}
