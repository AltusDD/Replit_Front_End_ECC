import React from "react";

export default class EccErrorBoundary extends React.Component<{children: React.ReactNode},{error?: Error}> {
  state = { error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error){ return { error }; }
  render(){
    if (this.state.error) return <div style={{padding:16}}><h2>Contract violation</h2><pre>{this.state.error.message}</pre></div>;
    return this.props.children;
  }
}