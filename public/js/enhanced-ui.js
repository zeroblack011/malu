/**
 * ENHANCED UI COMPONENTS
 * Premium interactions and animations
 */

const EnhancedUI = {
    // Initialize all enhancements
    init() {
        this.initAnimateOnScroll();
        this.initTooltips();
        this.initRippleEffect();
        this.initLoadingStates();
        this.enhanceToasts();
        this.initKeyboardShortcuts();
    },

    // Animate elements on scroll
    initAnimateOnScroll() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    },

    // Enhanced tooltips
    initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.classList.add('tooltip');
        });
    },

    // Material-style ripple effect
    initRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn');
            if (!button) return;

            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        // Add ripple animation
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Enhanced loading states
    initLoadingStates() {
        // Replace loading spinners with skeleton screens
        const originalShowLoading = Utils.showLoading;
        Utils.showLoading = function() {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.innerHTML = `
                <div class="skeleton-container">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 80%"></div>
                    <div class="skeleton skeleton-card mt-4"></div>
                </div>
            `;
            loadingScreen.style.display = 'flex';
        };
    },

    // Premium toast notifications
    enhanceToasts() {
        const originalShowToast = Utils.showToast;

        Utils.showToast = function(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast-premium ${type}`;

            const icons = {
                success: '✓',
                error: '✕',
                warning: '!',
                info: 'i'
            };

            toast.innerHTML = `
                <div class="toast-premium-icon">${icons[type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()"
                    style="background: none; border: none; color: currentColor; cursor: pointer; padding: 0.5rem; margin-left: auto;">
                    ✕
                </button>
            `;

            container.appendChild(toast);

            // Auto-dismiss
            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => toast.remove(), 300);
            }, 5000);

            // Add slide out animation
            if (!document.getElementById('toast-animations')) {
                const style = document.createElement('style');
                style.id = 'toast-animations';
                style.textContent = `
                    @keyframes slideOutRight {
                        to {
                            transform: translateX(120%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        };
    },

    // Keyboard shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K: Search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) searchInput.focus();
            }

            // Cmd/Ctrl + B: Toggle sidebar (admin)
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                const sidebar = document.querySelector('.admin-sidebar');
                if (sidebar) sidebar.classList.toggle('collapsed');
            }

            // Escape: Close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay');
                if (modal) modal.remove();
            }
        });
    },

    // Show loading skeleton
    showSkeleton(container, type = 'card') {
        const skeletons = {
            card: `
                <div class="skeleton skeleton-card"></div>
            `,
            list: `
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 90%"></div>
                <div class="skeleton skeleton-text" style="width: 80%"></div>
            `,
            table: `
                <div class="skeleton skeleton-text" style="height: 3rem"></div>
                <div class="skeleton skeleton-text mt-2" style="height: 2rem"></div>
                <div class="skeleton skeleton-text mt-2" style="height: 2rem"></div>
                <div class="skeleton skeleton-text mt-2" style="height: 2rem"></div>
            `,
            form: `
                <div class="skeleton skeleton-text" style="height: 3rem"></div>
                <div class="skeleton skeleton-text mt-3" style="height: 3rem"></div>
                <div class="skeleton skeleton-text mt-3" style="height: 3rem"></div>
                <div class="skeleton skeleton-text mt-3" style="height: 3rem; width: 40%"></div>
            `
        };

        container.innerHTML = skeletons[type] || skeletons.card;
    },

    // Progress indicator
    showProgress(percent, container) {
        const progressHTML = `
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
            </div>
        `;

        if (typeof container === 'string') {
            document.getElementById(container).innerHTML = progressHTML;
        } else {
            container.innerHTML = progressHTML;
        }
    },

    // Confetti animation (for success celebrations)
    showConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#10b981', '#f59e0b'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    opacity: 1;
                    transform: rotate(${Math.random() * 360}deg);
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                    pointer-events: none;
                    z-index: 10000;
                `;

                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }

        // Add confetti animation
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Copy to clipboard with feedback
    async copyWithFeedback(text, message = 'Copiado!') {
        const success = await Utils.copyToClipboard(text);
        if (success) {
            Utils.showToast(message, 'success');
        } else {
            Utils.showToast('Erro ao copiar', 'error');
        }
    },

    // Confirmation dialog
    async confirm(message, title = 'Confirmação') {
        return new Promise((resolve) => {
            const modal = `
                <div class="modal-overlay modal-backdrop">
                    <div class="modal modal-premium" style="max-width: 400px;">
                        <div class="modal-header">
                            <h3 class="modal-title">${title}</h3>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline" id="confirm-cancel">Cancelar</button>
                            <button class="btn btn-primary" id="confirm-ok">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('modal-container').innerHTML = modal;

            document.getElementById('confirm-ok').onclick = () => {
                document.getElementById('modal-container').innerHTML = '';
                resolve(true);
            };

            document.getElementById('confirm-cancel').onclick = () => {
                document.getElementById('modal-container').innerHTML = '';
                resolve(false);
            };
        });
    },

    // Input mask
    maskInput(input, mask) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let masked = '';
            let valueIndex = 0;

            for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
                if (mask[i] === '9') {
                    masked += value[valueIndex];
                    valueIndex++;
                } else {
                    masked += mask[i];
                }
            }

            e.target.value = masked;
        });
    },

    // Real-time validation
    validateInput(input, validator, errorMessage) {
        let timeout;

        input.addEventListener('input', () => {
            clearTimeout(timeout);

            // Remove previous error
            const prevError = input.parentElement.querySelector('.validation-error');
            if (prevError) prevError.remove();

            // Add loading state
            input.classList.add('validating');

            timeout = setTimeout(() => {
                const isValid = validator(input.value);
                input.classList.remove('validating');

                if (!isValid && input.value) {
                    input.classList.add('input-error');
                    const error = document.createElement('div');
                    error.className = 'validation-error text-error';
                    error.style.fontSize = '0.875rem';
                    error.style.marginTop = '0.25rem';
                    error.textContent = errorMessage;
                    input.parentElement.appendChild(error);
                } else {
                    input.classList.remove('input-error');
                }
            }, 500);
        });

        // Add validation styles
        if (!document.getElementById('validation-styles')) {
            const style = document.createElement('style');
            style.id = 'validation-styles';
            style.textContent = `
                .input-error {
                    border-color: var(--error-color) !important;
                }
                .validating {
                    opacity: 0.7;
                }
                .validation-error {
                    animation: slideInUp 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EnhancedUI.init());
} else {
    EnhancedUI.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedUI;
}
