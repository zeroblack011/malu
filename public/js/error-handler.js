/**
 * ADVANCED ERROR HANDLING
 * Catch, log, and display errors gracefully
 */

const ErrorHandler = {
    errors: [],
    maxErrors: 50,

    // Initialize error handling
    init() {
        this.setupGlobalHandlers();
        this.setupNetworkErrorHandling();
        this.setupPromiseRejectionHandling();
    },

    // Setup global error handlers
    setupGlobalHandlers() {
        window.addEventListener('error', (e) => {
            this.handleError({
                type: 'runtime_error',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: new Date().toISOString()
            });
        });
    },

    // Handle promise rejections
    setupPromiseRejectionHandling() {
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError({
                type: 'unhandled_rejection',
                message: e.reason?.message || e.reason?.toString() || 'Unknown error',
                stack: e.reason?.stack,
                timestamp: new Date().toISOString()
            });

            e.preventDefault(); // Prevent console error
        });
    },

    // Handle network errors
    setupNetworkErrorHandling() {
        // Wrap fetch to handle network errors
        const originalFetch = window.fetch;

        window.fetch = async function(...args) {
            try {
                const response = await originalFetch(...args);

                if (!response.ok) {
                    ErrorHandler.handleError({
                        type: 'network_error',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        url: args[0],
                        status: response.status,
                        timestamp: new Date().toISOString()
                    });
                }

                return response;
            } catch (error) {
                ErrorHandler.handleError({
                    type: 'network_error',
                    message: error.message,
                    url: args[0],
                    timestamp: new Date().toISOString()
                });

                throw error;
            }
        };
    },

    // Handle error
    handleError(error) {
        // Store error
        this.errors.push(error);

        // Limit stored errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.error('🔴 Error:', error);
        }

        // Send to backend
        this.reportError(error);

        // Show user-friendly message for critical errors
        if (this.isCriticalError(error)) {
            this.showErrorDialog(error);
        }
    },

    // Check if error is critical
    isCriticalError(error) {
        const criticalPatterns = [
            /payment/i,
            /authentication/i,
            /authorization/i,
            /database/i,
            /server/i
        ];

        return criticalPatterns.some(pattern =>
            pattern.test(error.message) || pattern.test(error.type)
        );
    },

    // Show error dialog
    showErrorDialog(error) {
        const userMessage = this.getUserFriendlyMessage(error);

        const modal = `
            <div class="modal-overlay modal-backdrop">
                <div class="modal modal-premium" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3 class="modal-title" style="color: var(--error-color);">⚠️ Ops! Algo deu errado</h3>
                    </div>
                    <div class="modal-body">
                        <p>${userMessage}</p>
                        <details class="mt-3" style="cursor: pointer;">
                            <summary style="font-size: 0.875rem; color: var(--text-secondary);">
                                Detalhes técnicos
                            </summary>
                            <pre style="font-size: 0.75rem; background: var(--surface); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; margin-top: 0.5rem;">${JSON.stringify(error, null, 2)}</pre>
                        </details>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">
                            Fechar
                        </button>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            Recarregar Página
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        if (container) {
            container.innerHTML = modal;
        }
    },

    // Get user-friendly error message
    getUserFriendlyMessage(error) {
        const messages = {
            'network_error': 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            'runtime_error': 'Ocorreu um erro inesperado. Tente recarregar a página.',
            'unhandled_rejection': 'Ocorreu um erro ao processar sua solicitação.',
            'payment_error': 'Erro ao processar o pagamento. Tente novamente ou entre em contato com o suporte.',
            'authentication_error': 'Erro de autenticação. Faça login novamente.',
            'validation_error': 'Por favor, verifique os dados informados.'
        };

        // Check for specific error patterns
        if (error.status === 401 || error.status === 403) {
            return 'Sua sessão expirou. Faça login novamente.';
        }

        if (error.status === 404) {
            return 'O recurso solicitado não foi encontrado.';
        }

        if (error.status >= 500) {
            return 'Erro no servidor. Tente novamente em alguns instantes.';
        }

        return messages[error.type] || 'Ocorreu um erro inesperado. Tente novamente.';
    },

    // Report error to backend
    async reportError(error) {
        try {
            await fetch('/api/errors/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    user: Auth.getCurrentUser()?.id || 'anonymous'
                })
            });
        } catch (e) {
            // Silently fail - don't create error loop
            console.error('Failed to report error:', e);
        }
    },

    // Wrap async function with error handling
    wrapAsync(fn) {
        return async function(...args) {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                ErrorHandler.handleError({
                    type: 'async_error',
                    message: error.message,
                    stack: error.stack,
                    function: fn.name,
                    timestamp: new Date().toISOString()
                });

                throw error;
            }
        };
    },

    // Get all errors
    getErrors() {
        return [...this.errors];
    },

    // Clear errors
    clearErrors() {
        this.errors = [];
    },

    // Export errors (for debugging)
    exportErrors() {
        const data = JSON.stringify(this.errors, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `errors_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Initialize error handling
ErrorHandler.init();

// Expose for debugging
window.ErrorHandler = ErrorHandler;
