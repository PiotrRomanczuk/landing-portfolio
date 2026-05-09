"use client";

import * as React from "react";

type Props = {
  name: string;
  fallback?: (error: Error) => React.ReactNode;
  children: React.ReactNode;
};

type State = { error: Error | null };

export class SectionBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[v5/${this.props.name}]`, error, info);
    }
  }

  render() {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) return this.props.fallback(error);
      return (
        <div role="alert" className="v5-fallback">
          <b>{this.props.name}</b> failed to render. The rest of the page is unaffected.
        </div>
      );
    }
    return this.props.children;
  }
}

export default SectionBoundary;
