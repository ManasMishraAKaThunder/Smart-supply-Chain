import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary — catches unhandled React rendering errors
 * and shows a user-friendly fallback UI instead of a blank screen.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production, send this to your error reporting service
    // e.g. Sentry, LogRocket, etc.
    void error;
    void errorInfo;
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: "#0f0f23",
            color: "#e2e8f0",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              textAlign: "center",
              padding: "3rem",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                color: "#f8fafc",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#94a3b8",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred. Please try refreshing the page. If
              the issue persists, contact support.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 8px 25px rgba(99,102,241,0.4)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
