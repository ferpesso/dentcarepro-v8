import { useState, useEffect } from 'react';
import { useErrorTracking } from '@/contexts/ErrorTrackingContext';
import { ErrorViewer } from './ErrorViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Botão flutuante que aparece quando há erros
 * Permite acesso rápido ao visualizador de erros
 */
export function ErrorFloatingButton() {
  const { errorCount, newErrorsCount } = useErrorTracking();
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Mostrar botão quando houver erros
  useEffect(() => {
    setIsVisible(errorCount > 0);
  }, [errorCount]);

  // Animar quando houver novos erros
  useEffect(() => {
    if (newErrorsCount > 0) {
      setIsPulsing(true);
      const timeout = setTimeout(() => setIsPulsing(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [newErrorsCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <ErrorViewer />
        
        {/* Badge de novos erros */}
        {newErrorsCount > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              'absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold',
              isPulsing && 'animate-pulse'
            )}
          >
            {newErrorsCount}
          </Badge>
        )}

        {/* Indicador de pulsação */}
        {isPulsing && (
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping" />
        )}
      </div>
    </div>
  );
}
