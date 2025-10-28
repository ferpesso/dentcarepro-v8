import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  errorTrackingService,
  ErrorLog,
  ErrorType,
  ErrorSeverity,
} from '@/services/errorTracking.service';

interface ErrorTrackingContextType {
  errors: ErrorLog[];
  errorCount: number;
  newErrorsCount: number;
  logError: (params: {
    type: ErrorType;
    message: string;
    stack?: string;
    severity: ErrorSeverity;
    context?: Record<string, any>;
  }) => void;
  clearErrors: () => void;
  exportErrors: (format: 'json' | 'txt' | 'csv') => void;
  markErrorsAsViewed: () => void;
  getStats: () => ReturnType<typeof errorTrackingService.getStats>;
}

const ErrorTrackingContext = createContext<ErrorTrackingContextType | undefined>(
  undefined
);

export function ErrorTrackingProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [viewedErrorsCount, setViewedErrorsCount] = useState(0);

  // Inicializar serviço
  useEffect(() => {
    errorTrackingService.initialize();

    // Carregar erros iniciais
    setErrors(errorTrackingService.getErrors());

    // Carregar contador de erros visualizados
    const viewed = localStorage.getItem('viewed_errors_count');
    if (viewed) {
      setViewedErrorsCount(parseInt(viewed, 10));
    }

    // Adicionar listener para mudanças
    const handleErrorsChange = (newErrors: ErrorLog[]) => {
      setErrors(newErrors);
    };

    errorTrackingService.addListener(handleErrorsChange);

    return () => {
      errorTrackingService.removeListener(handleErrorsChange);
    };
  }, []);

  // Registrar erro manualmente
  const logError = useCallback(
    (params: {
      type: ErrorType;
      message: string;
      stack?: string;
      severity: ErrorSeverity;
      context?: Record<string, any>;
    }) => {
      errorTrackingService.logError(params);
    },
    []
  );

  // Limpar todos os erros
  const clearErrors = useCallback(() => {
    errorTrackingService.clearErrors();
    setViewedErrorsCount(0);
    localStorage.removeItem('viewed_errors_count');
  }, []);

  // Exportar erros
  const exportErrors = useCallback((format: 'json' | 'txt' | 'csv') => {
    errorTrackingService.export(format);
  }, []);

  // Marcar erros como visualizados
  const markErrorsAsViewed = useCallback(() => {
    const currentCount = errors.length;
    setViewedErrorsCount(currentCount);
    localStorage.setItem('viewed_errors_count', currentCount.toString());
  }, [errors.length]);

  // Obter estatísticas
  const getStats = useCallback(() => {
    return errorTrackingService.getStats();
  }, []);

  // Calcular novos erros
  const newErrorsCount = Math.max(0, errors.length - viewedErrorsCount);

  const value: ErrorTrackingContextType = {
    errors,
    errorCount: errors.length,
    newErrorsCount,
    logError,
    clearErrors,
    exportErrors,
    markErrorsAsViewed,
    getStats,
  };

  return (
    <ErrorTrackingContext.Provider value={value}>
      {children}
    </ErrorTrackingContext.Provider>
  );
}

export function useErrorTracking() {
  const context = useContext(ErrorTrackingContext);
  if (!context) {
    throw new Error('useErrorTracking must be used within ErrorTrackingProvider');
  }
  return context;
}

/**
 * Hook para capturar erros de componentes React
 */
export function useErrorBoundary() {
  const { logError } = useErrorTracking();

  return useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      logError({
        type: 'RENDER',
        message: error.message,
        stack: error.stack,
        severity: 'high',
        context: {
          componentStack: errorInfo.componentStack,
        },
      });
    },
    [logError]
  );
}
