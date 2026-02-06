import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  featureName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary base reutilizável
 * Captura erros JavaScript em componentes filhos e exibe UI de fallback
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    console.error(`[ErrorBoundary${this.props.featureName ? ` - ${this.props.featureName}` : ''}]`, error, errorInfo)
    
    // Callback opcional para tratamento externo
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Se houver um fallback customizado, use-o
      if (this.props.fallback) {
        return this.props.fallback
      }

      // UI de fallback padrão
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">
              {this.props.featureName 
                ? `Erro na ${this.props.featureName}` 
                : 'Algo deu errado'}
            </h2>
            <p className="error-boundary-message">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="error-boundary-details">
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button 
              className="error-boundary-button"
              onClick={this.handleReset}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
