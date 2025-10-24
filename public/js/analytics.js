/**
 * ANALYTICS & TRACKING
 * Track user behavior and performance
 */

const Analytics = {
    sessionId: null,
    events: [],

    // Initialize analytics
    init() {
        this.sessionId = this.generateSessionId();
        this.trackPageView();
        this.trackPerformance();
        this.setupEventTracking();
        this.trackErrors();
    },

    // Generate unique session ID
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Track page view
    trackPageView() {
        this.track('page_view', {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    },

    // Track custom event
    track(eventName, properties = {}) {
        const event = {
            event: eventName,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            ...properties,
            // User context
            user: Auth.getCurrentUser()?.id || 'anonymous',
            // Browser context
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        this.events.push(event);

        // Send to backend (batch every 10 events or 30 seconds)
        if (this.events.length >= 10) {
            this.flush();
        }

        // Debug log
        if (window.location.hostname === 'localhost') {
            console.log('📊 Analytics:', eventName, properties);
        }
    },

    // Send events to backend
    async flush() {
        if (this.events.length === 0) return;

        const eventsToSend = [...this.events];
        this.events = [];

        try {
            await fetch('/api/analytics/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ events: eventsToSend })
            });
        } catch (error) {
            console.error('Analytics error:', error);
            // Put events back if failed
            this.events = [...eventsToSend, ...this.events];
        }
    },

    // Track performance metrics
    trackPerformance() {
        // Wait for page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                const firstPaintTime = performance.getEntriesByType('paint')[0]?.startTime || 0;

                this.track('performance', {
                    pageLoadTime,
                    domContentLoadedTime,
                    firstPaintTime,
                    connectionType: navigator.connection?.effectiveType || 'unknown'
                });
            }, 0);
        });
    },

    // Setup automatic event tracking
    setupEventTracking() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                const action = target.dataset.track;
                const label = target.dataset.trackLabel || target.textContent;
                this.track('click', { action, label });
            }

            // Track button clicks
            const button = e.target.closest('button, .btn');
            if (button && !button.dataset.track) {
                this.track('button_click', {
                    text: button.textContent.trim(),
                    class: button.className
                });
            }

            // Track link clicks
            const link = e.target.closest('a');
            if (link) {
                this.track('link_click', {
                    href: link.href,
                    text: link.textContent.trim()
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.track('form_submit', {
                formId: form.id,
                formAction: form.action
            });
        });

        // Track service views
        const originalViewService = Services.viewService;
        Services.viewService = function(serviceId) {
            Analytics.track('service_view', { serviceId });
            return originalViewService.call(this, serviceId);
        };

        // Track credit purchases
        const originalSelectPackage = Credits.selectPackage;
        Credits.selectPackage = function(packageId) {
            Analytics.track('credit_package_selected', { packageId });
            return originalSelectPackage.call(this, packageId);
        };

        // Track orders
        const originalCreateOrder = Forms.submitForm;
        Forms.submitForm = async function(form) {
            const serviceId = Forms.currentService?.id;
            Analytics.track('order_created', { serviceId });
            return originalCreateOrder.call(this, form);
        };
    },

    // Track errors
    trackErrors() {
        window.addEventListener('error', (e) => {
            this.track('error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.track('unhandled_rejection', {
                reason: e.reason?.toString(),
                promise: e.promise
            });
        });
    },

    // Track conversion funnel
    trackFunnel(step, data = {}) {
        this.track('funnel_step', {
            step,
            ...data
        });
    },

    // Track user engagement
    trackEngagement() {
        let lastActivity = Date.now();
        let totalEngagedTime = 0;

        const updateEngagement = () => {
            const now = Date.now();
            const elapsed = now - lastActivity;

            // Consider engaged if activity within last 30 seconds
            if (elapsed < 30000) {
                totalEngagedTime += elapsed;
            }

            lastActivity = now;
        };

        // Track user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateEngagement, { passive: true });
        });

        // Send engagement data every minute
        setInterval(() => {
            if (totalEngagedTime > 0) {
                this.track('engagement', {
                    engagedTime: totalEngagedTime,
                    timeOnPage: Date.now() - this.sessionStart
                });
                totalEngagedTime = 0;
            }
        }, 60000);
    },

    // Custom dimensions
    setUserProperty(key, value) {
        this.track('user_property', {
            key,
            value
        });
    }
};

// Initialize analytics
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}

// Flush events before page unload
window.addEventListener('beforeunload', () => {
    Analytics.flush();
});
