/**
 * Error Tracking Service
 * Sistema de captura, armazenamento e exportação de erros
 */

export interface ErrorLog {
  id: string;
  timestamp: Date;
  type: ErrorType;
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  context?: Record<string, any>;
  severity: ErrorSeverity;
}

export type ErrorType =
  | 'CORS'
  | 'API'
  | 'NETWORK'
  | 'RENDER'
  | 'JAVASCRIPT'
  | 'PROMISE_REJECTION'
  | 'RESOURCE_LOAD'
  | 'UNKNOWN';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

class ErrorTrackingService {
  private errors: ErrorLog[] = [];
  private maxErrors = 100; // Máximo de erros armazenados
  private listeners: Set<(errors: ErrorLog[]) => void> = new Set();
  private isInitialized = false;

  /**
   * Inicializar o serviço de error tracking
   */
  initialize() {
    if (this.isInitialized) return;

    // Carregar erros salvos do localStorage
    this.loadFromStorage();

    // Capturar erros globais de JavaScript
    window.addEventListener('error', this.handleGlobalError.bind(this));

    // Capturar promessas rejeitadas não tratadas
    window.addEventListener(
      'unhandledrejection',
      this.handleUnhandledRejection.bind(this)
    );

    // Capturar erros de recursos (imagens, scripts, etc)
    window.addEventListener(
      'error',
      this.handleResourceError.bind(this),
      true // useCapture
    );

    this.isInitialized = true;
    console.log('[ErrorTracking] Serviço inicializado');
  }

  /**
   * Capturar erro global de JavaScript
   */
  private handleGlobalError(event: ErrorEvent) {
    event.preventDefault(); // Prevenir log padrão do console

    this.logError({
      type: this.detectErrorType(event.message),
      message: event.message,
      stack: event.error?.stack,
      severity: this.calculateSeverity(event.error),
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  }

  /**
   * Capturar promessas rejeitadas não tratadas
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    event.preventDefault();

    const reason = event.reason;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : 'Promise rejection sem mensagem';

    this.logError({
      type: 'PROMISE_REJECTION',
      message,
      stack: reason instanceof Error ? reason.stack : undefined,
      severity: 'high',
      context: {
        reason: String(reason),
      },
    });
  }

  /**
   * Capturar erros de carregamento de recursos
   */
  private handleResourceError(event: Event) {
    const target = event.target as HTMLElement;

    // Ignorar se não for erro de recurso
    if (
      !target ||
      !(target instanceof HTMLImageElement) &&
      !(target instanceof HTMLScriptElement) &&
      !(target instanceof HTMLLinkElement)
    ) {
      return;
    }

    const resourceUrl =
      (target as HTMLImageElement).src ||
      (target as HTMLScriptElement).src ||
      (target as HTMLLinkElement).href;

    this.logError({
      type: 'RESOURCE_LOAD',
      message: `Falha ao carregar recurso: ${resourceUrl}`,
      severity: 'medium',
      context: {
        resourceType: target.tagName,
        resourceUrl,
      },
    });
  }

  /**
   * Detectar tipo de erro baseado na mensagem
   */
  private detectErrorType(message: string): ErrorType {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('cors') || lowerMessage.includes('access-control')) {
      return 'CORS';
    }
    if (lowerMessage.includes('fetch') || lowerMessage.includes('network')) {
      return 'NETWORK';
    }
    if (lowerMessage.includes('api') || lowerMessage.includes('trpc')) {
      return 'API';
    }
    if (
      lowerMessage.includes('render') ||
      lowerMessage.includes('component') ||
      lowerMessage.includes('react')
    ) {
      return 'RENDER';
    }

    return 'JAVASCRIPT';
  }

  /**
   * Calcular severidade do erro
   */
  private calculateSeverity(error: Error | undefined): ErrorSeverity {
    if (!error) return 'medium';

    const message = error.message.toLowerCase();

    // Erros críticos
    if (
      message.includes('cannot read') ||
      message.includes('undefined') ||
      message.includes('null')
    ) {
      return 'critical';
    }

    // Erros de alta prioridade
    if (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('cors')
    ) {
      return 'high';
    }

    // Erros de média prioridade
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Registrar um erro manualmente
   */
  logError(params: {
    type: ErrorType;
    message: string;
    stack?: string;
    componentStack?: string;
    severity: ErrorSeverity;
    context?: Record<string, any>;
  }) {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      type: params.type,
      message: params.message,
      stack: params.stack,
      componentStack: params.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      user: this.getCurrentUser(),
      context: params.context,
      severity: params.severity,
    };

    // Adicionar ao início do array
    this.errors.unshift(errorLog);

    // Limitar número de erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Salvar no localStorage
    this.saveToStorage();

    // Notificar listeners
    this.notifyListeners();

    // Log no console (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.error('[ErrorTracking]', errorLog);
    }
  }

  /**
   * Obter usuário atual do localStorage
   */
  private getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    } catch (e) {
      // Ignorar erro
    }
    return undefined;
  }

  /**
   * Gerar ID único para o erro
   */
  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Salvar erros no localStorage
   */
  private saveToStorage() {
    try {
      localStorage.setItem('error_logs', JSON.stringify(this.errors));
    } catch (e) {
      console.error('[ErrorTracking] Falha ao salvar no localStorage', e);
    }
  }

  /**
   * Carregar erros do localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('error_logs');
      if (stored) {
        this.errors = JSON.parse(stored).map((err: any) => ({
          ...err,
          timestamp: new Date(err.timestamp),
        }));
      }
    } catch (e) {
      console.error('[ErrorTracking] Falha ao carregar do localStorage', e);
      this.errors = [];
    }
  }

  /**
   * Obter todos os erros
   */
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * Obter erros filtrados
   */
  getFilteredErrors(filters: {
    type?: ErrorType;
    severity?: ErrorSeverity;
    startDate?: Date;
    endDate?: Date;
  }): ErrorLog[] {
    return this.errors.filter((error) => {
      if (filters.type && error.type !== filters.type) return false;
      if (filters.severity && error.severity !== filters.severity) return false;
      if (filters.startDate && error.timestamp < filters.startDate) return false;
      if (filters.endDate && error.timestamp > filters.endDate) return false;
      return true;
    });
  }

  /**
   * Limpar todos os erros
   */
  clearErrors() {
    this.errors = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Exportar erros como JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  /**
   * Exportar erros como texto formatado
   */
  exportAsText(): string {
    let text = '='.repeat(80) + '\n';
    text += 'DENTCARE PRO - LOG DE ERROS\n';
    text += `Exportado em: ${new Date().toLocaleString('pt-PT')}\n`;
    text += `Total de erros: ${this.errors.length}\n`;
    text += '='.repeat(80) + '\n\n';

    this.errors.forEach((error, index) => {
      text += `-`.repeat(80) + '\n';
      text += `ERRO #${index + 1}\n`;
      text += `-`.repeat(80) + '\n';
      text += `ID: ${error.id}\n`;
      text += `Timestamp: ${error.timestamp.toLocaleString('pt-PT')}\n`;
      text += `Tipo: ${error.type}\n`;
      text += `Severidade: ${error.severity.toUpperCase()}\n`;
      text += `Mensagem: ${error.message}\n`;
      text += `URL: ${error.url}\n`;

      if (error.user) {
        text += `Usuário: ${error.user.name} (${error.user.email})\n`;
      }

      if (error.stack) {
        text += `\nStack Trace:\n${error.stack}\n`;
      }

      if (error.componentStack) {
        text += `\nComponent Stack:\n${error.componentStack}\n`;
      }

      if (error.context) {
        text += `\nContexto:\n${JSON.stringify(error.context, null, 2)}\n`;
      }

      text += '\n';
    });

    return text;
  }

  /**
   * Exportar erros como CSV
   */
  exportAsCSV(): string {
    const headers = [
      'ID',
      'Timestamp',
      'Tipo',
      'Severidade',
      'Mensagem',
      'URL',
      'Usuário',
      'User Agent',
    ];

    let csv = headers.join(',') + '\n';

    this.errors.forEach((error) => {
      const row = [
        error.id,
        error.timestamp.toISOString(),
        error.type,
        error.severity,
        `"${error.message.replace(/"/g, '""')}"`, // Escapar aspas
        error.url,
        error.user ? `"${error.user.name} (${error.user.email})"` : '',
        `"${error.userAgent}"`,
      ];

      csv += row.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Fazer download de arquivo
   */
  downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exportar e fazer download
   */
  export(format: 'json' | 'txt' | 'csv' = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = this.exportAsJSON();
        filename = `dentcare-errors-${timestamp}.json`;
        mimeType = 'application/json';
        break;
      case 'txt':
        content = this.exportAsText();
        filename = `dentcare-errors-${timestamp}.txt`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = this.exportAsCSV();
        filename = `dentcare-errors-${timestamp}.csv`;
        mimeType = 'text/csv';
        break;
    }

    this.downloadFile(content, filename, mimeType);
  }

  /**
   * Adicionar listener para mudanças
   */
  addListener(callback: (errors: ErrorLog[]) => void) {
    this.listeners.add(callback);
  }

  /**
   * Remover listener
   */
  removeListener(callback: (errors: ErrorLog[]) => void) {
    this.listeners.delete(callback);
  }

  /**
   * Notificar todos os listeners
   */
  private notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback([...this.errors]);
      } catch (e) {
        console.error('[ErrorTracking] Erro ao notificar listener', e);
      }
    });
  }

  /**
   * Obter estatísticas de erros
   */
  getStats() {
    const stats = {
      total: this.errors.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      last24h: 0,
      lastHour: 0,
    };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    this.errors.forEach((error) => {
      // Por tipo
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;

      // Por severidade
      stats.bySeverity[error.severity] =
        (stats.bySeverity[error.severity] || 0) + 1;

      // Últimas 24h
      if (error.timestamp >= oneDayAgo) {
        stats.last24h++;
      }

      // Última hora
      if (error.timestamp >= oneHourAgo) {
        stats.lastHour++;
      }
    });

    return stats;
  }
}

// Singleton
export const errorTrackingService = new ErrorTrackingService();
