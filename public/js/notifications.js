// Notifications Manager
const Notifications = {
    notifications: [],
    unreadCount: 0,

    // Initialize
    async init() {
        await this.loadUnreadCount();
        this.updateBadge();

        // Poll for new notifications every 30 seconds
        setInterval(() => this.checkForNew(), 30000);
    },

    // Load unread count
    async loadUnreadCount() {
        try {
            const response = await NotificationsAPI.getUnreadCount();
            this.unreadCount = response.count || 0;
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    },

    // Update badge
    updateBadge() {
        const badge = document.getElementById('notification-count');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // Check for new notifications
    async checkForNew() {
        await this.loadUnreadCount();
        this.updateBadge();
    },

    // Show notifications panel
    async showPanel() {
        try {
            Utils.showLoading();

            const response = await NotificationsAPI.getNotifications({ limit: 50 });
            this.notifications = response.notifications || [];

            const modal = `
                <div class="modal-overlay">
                    <div class="modal">
                        <div class="modal-header">
                            <h2 class="modal-title">Notificações</h2>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            ${this.unreadCount > 0 ? `
                                <div class="notifications-actions">
                                    <button class="btn btn-sm btn-outline" onclick="Notifications.markAllAsRead()">
                                        Marcar todas como lidas
                                    </button>
                                </div>
                            ` : ''}

                            <div class="notifications-list">
                                ${this.renderNotifications()}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('modal-container').innerHTML = modal;
        } catch (error) {
            Utils.showToast('Erro ao carregar notificações', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Render notifications
    renderNotifications() {
        if (this.notifications.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🔔</div>
                    <h3 class="empty-title">Nenhuma notificação</h3>
                    <p class="empty-description">Você está em dia!</p>
                </div>
            `;
        }

        return this.notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="Notifications.markAsRead('${notif.id}')">
                <div class="notification-icon">${this.getNotificationIcon(notif.type)}</div>
                <div class="notification-content">
                    <h4 class="notification-title">${notif.title}</h4>
                    <p class="notification-message">${notif.message}</p>
                    <small class="notification-time">${Utils.formatDateTime(notif.createdAt)}</small>
                </div>
                ${!notif.read ? '<div class="notification-badge"></div>' : ''}
            </div>
        `).join('');
    },

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            'order_update': '📦',
            'payment_confirmed': '💳',
            'credits_added': '💎',
            'system': '⚙️',
            'support': '💬',
            'delivery': '✅'
        };

        return icons[type] || '🔔';
    },

    // Mark as read
    async markAsRead(notificationId) {
        try {
            await NotificationsAPI.markAsRead(notificationId);

            // Update local state
            const notif = this.notifications.find(n => n.id === notificationId);
            if (notif && !notif.read) {
                notif.read = true;
                this.unreadCount = Math.max(0, this.unreadCount - 1);
                this.updateBadge();

                // Re-render
                const list = document.querySelector('.notifications-list');
                if (list) {
                    list.innerHTML = this.renderNotifications();
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    // Mark all as read
    async markAllAsRead() {
        try {
            Utils.showLoading();

            await NotificationsAPI.markAllAsRead();

            this.notifications.forEach(n => n.read = true);
            this.unreadCount = 0;
            this.updateBadge();

            // Re-render
            const list = document.querySelector('.notifications-list');
            if (list) {
                list.innerHTML = this.renderNotifications();
            }

            Utils.showToast('Todas as notificações foram marcadas como lidas', 'success');
        } catch (error) {
            Utils.showToast('Erro ao marcar notificações', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Request permission for push notifications
    async requestPermission() {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    // Show browser notification
    showBrowserNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/assets/icon-192.png',
                badge: '/assets/icon-192.png',
                ...options
            });
        }
    }
};
