import React, { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep logs for local debugging; can be connected to monitoring in production.
    console.error('Unexpected UI error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem',
          }}
        >
          <section
            style={{
              maxWidth: '540px',
              width: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              background: '#fff',
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <h1 style={{ margin: 0 }}>Something went wrong</h1>
            <p style={{ color: '#475569' }}>
              The dashboard hit an unexpected error. Please refresh the page to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 0.9rem',
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Refresh page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
