import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Download } from "lucide-react";
import { Component, ReactNode, ErrorInfo } from "react";
import { errorTrackingService } from "@/services/errorTracking.service";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Registrar erro no sistema de tracking
    errorTrackingService.logError({
      type: 'RENDER',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      severity: 'critical',
      context: {
        errorInfo: errorInfo.componentStack,
      },
    });

    // Atualizar estado com informações do erro
    this.setState({
      errorInfo,
    });

    // Log no console (desenvolvimento)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleExportError = () => {
    if (!this.state.error) return;

    const errorReport = {
      timestamp: new Date().toISOString(),
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-2 font-semibold">
              Ocorreu um erro inesperado
            </h2>

            <p className="text-sm text-muted-foreground mb-6 text-center">
              O erro foi automaticamente registado. Pode recarregar a página ou
              exportar os detalhes do erro.
            </p>

            <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 max-h-96">
              <p className="text-sm font-semibold mb-2">Mensagem:</p>
              <pre className="text-sm text-muted-foreground whitespace-break-spaces mb-4">
                {this.state.error?.message}
              </pre>

              <p className="text-sm font-semibold mb-2">Stack Trace:</p>
              <pre className="text-xs text-muted-foreground whitespace-break-spaces">
                {this.state.error?.stack}
              </pre>

              {this.state.errorInfo?.componentStack && (
                <>
                  <p className="text-sm font-semibold mb-2 mt-4">
                    Component Stack:
                  </p>
                  <pre className="text-xs text-muted-foreground whitespace-break-spaces">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-primary text-primary-foreground",
                  "hover:opacity-90 cursor-pointer transition-opacity"
                )}
              >
                <RotateCcw size={16} />
                Recarregar Página
              </button>

              <button
                onClick={this.handleExportError}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-secondary text-secondary-foreground",
                  "hover:opacity-90 cursor-pointer transition-opacity"
                )}
              >
                <Download size={16} />
                Exportar Erro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
