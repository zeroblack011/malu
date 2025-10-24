/**
 * ACCESSIBILITY ENHANCEMENTS
 * WCAG 2.1 Level AA compliance
 */

const Accessibility = {
    // Initialize accessibility features
    init() {
        this.addARIALabels();
        this.improveKeyboardNavigation();
        this.addFocusIndicators();
        this.setupSkipLinks();
        this.improveFormAccessibility();
        this.addLiveRegions();
    },

    // Add ARIA labels to elements
    addARIALabels() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            item.setAttribute('role', 'tab');
            item.setAttribute('aria-label', item.querySelector('.nav-label')?.textContent || `Navigation ${index + 1}`);
        });

        // Buttons
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Images
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', '');
        });

        // Links
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            if (!link.getAttribute('aria-label') && link.textContent.trim()) {
                link.setAttribute('aria-label', link.textContent.trim());
            }
        });
    },

    // Improve keyboard navigation
    improveKeyboardNavigation() {
        // Make custom elements focusable
        document.querySelectorAll('.service-card, .credit-package').forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }

            // Add keyboard activation
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });

        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal-overlay');
            if (!modal) return;

            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    },

    // Add visible focus indicators
    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--primary-color);
                outline-offset: 2px;
            }

            button:focus-visible,
            .btn:focus-visible {
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
            }
        `;
        document.head.appendChild(style);
    },

    // Setup skip links
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            z-index: 10000;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    // Improve form accessibility
    improveFormAccessibility() {
        // Associate labels with inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (!input.id) {
                input.id = `input_${Math.random().toString(36).substr(2, 9)}`;
            }

            const label = input.closest('.form-group')?.querySelector('label');
            if (label && !label.getAttribute('for')) {
                label.setAttribute('for', input.id);
            }

            // Add aria-required
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }

            // Add aria-invalid for errors
            input.addEventListener('invalid', () => {
                input.setAttribute('aria-invalid', 'true');
            });

            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    input.removeAttribute('aria-invalid');
                }
            });
        });

        // Add error announcement
        document.querySelectorAll('.form-error').forEach(error => {
            error.setAttribute('role', 'alert');
            error.setAttribute('aria-live', 'polite');
        });
    },

    // Add live regions for dynamic content
    addLiveRegions() {
        // Create announcement region
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    },

    // Announce message to screen readers
    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },

    // Check color contrast
    checkContrast(foreground, background) {
        // Convert hex to RGB
        const getRGB = (color) => {
            const hex = color.replace('#', '');
            return {
                r: parseInt(hex.substr(0, 2), 16),
                g: parseInt(hex.substr(2, 2), 16),
                b: parseInt(hex.substr(4, 2), 16)
            };
        };

        // Calculate relative luminance
        const getLuminance = (rgb) => {
            const a = [rgb.r, rgb.g, rgb.b].map(v => {
                v = v / 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        };

        const l1 = getLuminance(getRGB(foreground));
        const l2 = getLuminance(getRGB(background));

        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

        return {
            ratio,
            AA: ratio >= 4.5,
            AAA: ratio >= 7
        };
    }
};

// Initialize accessibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Accessibility.init());
} else {
    Accessibility.init();
}

// Export
window.Accessibility = Accessibility;
