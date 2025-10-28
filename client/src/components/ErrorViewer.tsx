import { useState, useMemo } from 'react';
import { useErrorTracking } from '@/contexts/ErrorTrackingContext';
import { ErrorLog, ErrorType, ErrorSeverity } from '@/services/errorTracking.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  Download,
  Trash2,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorViewer() {
  const {
    errors,
    errorCount,
    newErrorsCount,
    clearErrors,
    exportErrors,
    markErrorsAsViewed,
  } = useErrorTracking();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<ErrorType | 'ALL'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<ErrorSeverity | 'ALL'>('ALL');
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  // Filtrar erros
  const filteredErrors = useMemo(() => {
    return errors.filter((error) => {
      if (filterType !== 'ALL' && error.type !== filterType) return false;
      if (filterSeverity !== 'ALL' && error.severity !== filterSeverity)
        return false;
      return true;
    });
  }, [errors, filterType, filterSeverity]);

  // Marcar como visualizado ao abrir
  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && newErrorsCount > 0) {
      markErrorsAsViewed();
    }
  };

  // Toggle expansão de erro
  const toggleExpand = (errorId: string) => {
    setExpandedErrors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(errorId)) {
        newSet.delete(errorId);
      } else {
        newSet.add(errorId);
      }
      return newSet;
    });
  };

  // Cor do badge por severidade
  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
    }
  };

  // Cor do badge por tipo
  const getTypeColor = (type: ErrorType) => {
    switch (type) {
      case 'CORS':
        return 'bg-purple-500 text-white';
      case 'API':
        return 'bg-indigo-500 text-white';
      case 'NETWORK':
        return 'bg-cyan-500 text-white';
      case 'RENDER':
        return 'bg-pink-500 text-white';
      case 'JAVASCRIPT':
        return 'bg-amber-500 text-white';
      case 'PROMISE_REJECTION':
        return 'bg-rose-500 text-white';
      case 'RESOURCE_LOAD':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative"
          title="Ver erros do sistema"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Erros ({errorCount})
          {newErrorsCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {newErrorsCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Log de Erros do Sistema
          </DialogTitle>
          <DialogDescription>
            {errorCount === 0
              ? 'Nenhum erro registado.'
              : `${errorCount} erro${errorCount > 1 ? 's' : ''} registado${errorCount > 1 ? 's' : ''}.`}
          </DialogDescription>
        </DialogHeader>

        {/* Filtros e Ações */}
        <div className="flex flex-wrap gap-2 items-center justify-between border-b pb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as ErrorType | 'ALL')}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="CORS">CORS</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="NETWORK">Network</SelectItem>
                <SelectItem value="RENDER">Render</SelectItem>
                <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                <SelectItem value="PROMISE_REJECTION">Promise</SelectItem>
                <SelectItem value="RESOURCE_LOAD">Resource</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterSeverity}
              onValueChange={(value) =>
                setFilterSeverity(value as ErrorSeverity | 'ALL')
              }
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {(filterType !== 'ALL' || filterSeverity !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterType('ALL');
                  setFilterSeverity('ALL');
                }}
                className="h-8"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportErrors('json')}
              disabled={errorCount === 0}
              className="h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportErrors('txt')}
              disabled={errorCount === 0}
              className="h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              TXT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportErrors('csv')}
              disabled={errorCount === 0}
              className="h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearErrors}
              disabled={errorCount === 0}
              className="h-8"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Lista de Erros */}
        <ScrollArea className="flex-1 pr-4">
          {filteredErrors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {errorCount === 0
                ? 'Nenhum erro registado. 🎉'
                : 'Nenhum erro corresponde aos filtros selecionados.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredErrors.map((error) => (
                <ErrorItem
                  key={error.id}
                  error={error}
                  isExpanded={expandedErrors.has(error.id)}
                  onToggle={() => toggleExpand(error.id)}
                  getSeverityColor={getSeverityColor}
                  getTypeColor={getTypeColor}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface ErrorItemProps {
  error: ErrorLog;
  isExpanded: boolean;
  onToggle: () => void;
  getSeverityColor: (severity: ErrorSeverity) => string;
  getTypeColor: (type: ErrorType) => string;
}

function ErrorItem({
  error,
  isExpanded,
  onToggle,
  getSeverityColor,
  getTypeColor,
}: ErrorItemProps) {
  return (
    <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
      {/* Header */}
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="mt-0.5">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge className={cn('text-xs', getSeverityColor(error.severity))}>
              {error.severity.toUpperCase()}
            </Badge>
            <Badge className={cn('text-xs', getTypeColor(error.type))}>
              {error.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(error.timestamp).toLocaleString('pt-PT')}
            </span>
          </div>

          <p className="text-sm font-medium truncate">{error.message}</p>

          {error.user && (
            <p className="text-xs text-muted-foreground mt-1">
              Usuário: {error.user.name} ({error.user.email})
            </p>
          )}
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {isExpanded && (
        <div className="mt-3 pl-7 space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">URL:</p>
            <p className="text-xs text-muted-foreground break-all">{error.url}</p>
          </div>

          {error.stack && (
            <div>
              <p className="font-medium mb-1">Stack Trace:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {error.stack}
              </pre>
            </div>
          )}

          {error.componentStack && (
            <div>
              <p className="font-medium mb-1">Component Stack:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {error.componentStack}
              </pre>
            </div>
          )}

          {error.context && (
            <div>
              <p className="font-medium mb-1">Contexto:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(error.context, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <p className="font-medium mb-1">User Agent:</p>
            <p className="text-xs text-muted-foreground break-all">
              {error.userAgent}
            </p>
          </div>

          <div>
            <p className="font-medium mb-1">ID do Erro:</p>
            <p className="text-xs text-muted-foreground font-mono">{error.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}
