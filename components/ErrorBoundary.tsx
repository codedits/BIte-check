"use client";
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState { error: Error | null }

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error', error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center p-8">
          <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
          <p className="text-sm text-gray-400 max-w-md">{this.state.error.message}</p>
          <button onClick={this.reset} className="glass-button bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-100">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
