// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error in ${this.props.fallbackName || 'a component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-tactical-surface border border-tactical-red/30 text-slate-300">
          <AlertTriangle className="text-tactical-red mb-2" size={32} />
          <h2 className="text-tactical-red font-bold font-mono tracking-widest mb-2">SYSTEM ERROR</h2>
          <p className="text-xs text-center font-mono opacity-80">
            Module [{this.props.fallbackName || 'UNKNOWN'}] failed to load.
          </p>
          <button 
            className="mt-4 px-3 py-1 bg-tactical-border hover:bg-slate-700 text-xs font-mono transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            REBOOT MODULE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
