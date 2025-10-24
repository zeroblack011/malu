// Orders Manager
const Orders = {
    orders: [],
    currentFilter: 'all',

    // Initialize
    async init() {
        await this.loadOrders();
    },

    // Load orders
    async loadOrders(params = {}) {
        try {
            const response = await OrdersAPI.getOrders(params);
            this.orders = response.orders || [];
            return this.orders;
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    },

    // Render orders page
    async render() {
        await this.loadOrders();

        const html = `
            <div class="orders-page">
                <div class="page-header">
                    <h2 class="page-title">Meus Pedidos</h2>
                </div>

                <!-- Status Filter -->
                <div class="status-filter">
                    ${this.renderStatusFilter()}
                </div>

                <!-- Orders List -->
                <div class="orders-list" id="orders-list">
                    ${this.renderOrdersList()}
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = html;
        this.attachEvents();
    },

    // Render status filter
    renderStatusFilter() {
        const statuses = [
            { value: 'all', label: 'Todos' },
            ...Object.entries(CONFIG.ORDER_STATUS).map(([key, value]) => ({
                value: key,
                label: value.label
            }))
        ];

        return statuses.map(status => `
            <button
                class="filter-btn ${status.value === this.currentFilter ? 'active' : ''}"
                data-filter="${status.value}"
            >
                ${status.label}
            </button>
        `).join('');
    },

    // Render orders list
    renderOrdersList() {
        const filtered = this.getFilteredOrders();

        if (filtered.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h3 class="empty-title">Nenhum pedido encontrado</h3>
                    <p class="empty-description">
                        ${this.currentFilter === 'all'
                            ? 'Você ainda não fez nenhum pedido'
                            : 'Nenhum pedido com este status'
                        }
                    </p>
                    ${this.currentFilter === 'all' ? `
                        <button class="btn btn-primary mt-3" onclick="App.navigate('home')">
                            Ver Serviços
                        </button>
                    ` : ''}
                </div>
            `;
        }

        return filtered.map(order => {
            const service = CONFIG.SERVICES.find(s => s.id === order.serviceId);
            const status = CONFIG.ORDER_STATUS[order.status] || CONFIG.ORDER_STATUS.PENDING;

            return `
                <div class="order-card" onclick="Orders.viewOrder('${order.id}')">
                    <div class="order-header">
                        <div class="order-info">
                            <div class="order-icon">${service?.icon || '📦'}</div>
                            <div>
                                <h4 class="order-title">${service?.name || 'Serviço'}</h4>
                                <p class="order-id">#${order.id.slice(0, 8)}</p>
                            </div>
                        </div>
                        <span class="badge badge-${status.color}">
                            ${status.icon} ${status.label}
                        </span>
                    </div>

                    <div class="order-details">
                        <div class="detail-item">
                            <span class="detail-label">Data:</span>
                            <span class="detail-value">${Utils.formatDate(order.createdAt)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Créditos:</span>
                            <span class="detail-value">
                                <span class="credits-icon">💎</span>
                                ${Utils.formatNumber(order.credits)}
                            </span>
                        </div>
                    </div>

                    ${order.deliveryDate ? `
                        <div class="order-delivery">
                            <span>📅</span>
                            Entrega prevista: ${Utils.formatDate(order.deliveryDate)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    // Get filtered orders
    getFilteredOrders() {
        if (this.currentFilter === 'all') {
            return this.orders;
        }
        return this.orders.filter(o => o.status === this.currentFilter);
    },

    // Attach events
    attachEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                document.querySelector('#orders-list').innerHTML = this.renderOrdersList();

                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    },

    // View order details
    async viewOrder(orderId) {
        try {
            Utils.showLoading();

            const order = await OrdersAPI.getOrder(orderId);
            const service = CONFIG.SERVICES.find(s => s.id === order.serviceId);
            const status = CONFIG.ORDER_STATUS[order.status] || CONFIG.ORDER_STATUS.PENDING;

            const modal = `
                <div class="modal-overlay">
                    <div class="modal modal-wide">
                        <div class="modal-header">
                            <h2 class="modal-title">
                                ${service?.icon || '📦'} Pedido #${order.id.slice(0, 8)}
                            </h2>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="order-detail-view">
                                <!-- Status -->
                                <div class="status-section">
                                    <span class="badge badge-${status.color} badge-lg">
                                        ${status.icon} ${status.label}
                                    </span>
                                </div>

                                <!-- Service Info -->
                                <div class="card mt-3">
                                    <div class="card-header">
                                        <h3 class="card-title">Informações do Serviço</h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="info-grid">
                                            <div class="info-item">
                                                <span class="info-label">Serviço:</span>
                                                <span class="info-value">${service?.name}</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">Data do Pedido:</span>
                                                <span class="info-value">${Utils.formatDateTime(order.createdAt)}</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="info-label">Créditos Utilizados:</span>
                                                <span class="info-value">
                                                    <span class="credits-icon">💎</span>
                                                    ${Utils.formatNumber(order.credits)}
                                                </span>
                                            </div>
                                            ${order.deliveryDate ? `
                                                <div class="info-item">
                                                    <span class="info-label">Previsão de Entrega:</span>
                                                    <span class="info-value">${Utils.formatDate(order.deliveryDate)}</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>

                                <!-- Order Data -->
                                ${order.formData ? `
                                    <div class="card mt-3">
                                        <div class="card-header">
                                            <h3 class="card-title">Dados Fornecidos</h3>
                                        </div>
                                        <div class="card-body">
                                            ${this.renderFormData(order.formData)}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Attached Files -->
                                ${order.files && order.files.length > 0 ? `
                                    <div class="card mt-3">
                                        <div class="card-header">
                                            <h3 class="card-title">Arquivos Anexados</h3>
                                        </div>
                                        <div class="card-body">
                                            ${this.renderFiles(order.files, order.id)}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Updates -->
                                ${order.updates && order.updates.length > 0 ? `
                                    <div class="card mt-3">
                                        <div class="card-header">
                                            <h3 class="card-title">Atualizações</h3>
                                        </div>
                                        <div class="card-body">
                                            ${this.renderUpdates(order.updates)}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Deliverables -->
                                ${order.deliverables && order.deliverables.length > 0 ? `
                                    <div class="card mt-3">
                                        <div class="card-header">
                                            <h3 class="card-title">Arquivos de Entrega</h3>
                                        </div>
                                        <div class="card-body">
                                            ${this.renderDeliverables(order.deliverables, order.id)}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="modal-footer">
                            ${order.status === 'PENDING' || order.status === 'PROCESSING' ? `
                                <button class="btn btn-outline" onclick="Orders.cancelOrder('${order.id}')">
                                    Cancelar Pedido
                                </button>
                            ` : ''}
                            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('modal-container').innerHTML = modal;
        } catch (error) {
            Utils.showToast('Erro ao carregar detalhes do pedido', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Render form data
    renderFormData(formData) {
        return Object.entries(formData).map(([key, value]) => {
            if (typeof value === 'object') return '';

            const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());

            return `
                <div class="form-data-item">
                    <strong>${label}:</strong>
                    <span>${Utils.sanitizeHTML(value)}</span>
                </div>
            `;
        }).join('');
    },

    // Render files
    renderFiles(files, orderId) {
        return files.map(file => `
            <div class="file-item">
                <span class="file-icon">📄</span>
                <span class="file-name">${file.name}</span>
                <button
                    class="btn btn-sm btn-outline"
                    onclick="OrdersAPI.downloadFile('${orderId}', '${file.id}')"
                >
                    Download
                </button>
            </div>
        `).join('');
    },

    // Render updates
    renderUpdates(updates) {
        return updates.map(update => `
            <div class="update-item">
                <div class="update-header">
                    <span class="update-date">${Utils.formatDateTime(update.date)}</span>
                    ${update.important ? '<span class="badge badge-warning">Importante</span>' : ''}
                </div>
                <p class="update-message">${Utils.sanitizeHTML(update.message)}</p>
            </div>
        `).join('');
    },

    // Render deliverables
    renderDeliverables(deliverables, orderId) {
        return deliverables.map(file => `
            <div class="deliverable-item">
                <div class="deliverable-info">
                    <span class="file-icon">📦</span>
                    <div>
                        <strong>${file.name}</strong>
                        <small>${Utils.formatFileSize(file.size)}</small>
                    </div>
                </div>
                <button
                    class="btn btn-primary"
                    onclick="OrdersAPI.downloadFile('${orderId}', '${file.id}')"
                >
                    Download
                </button>
            </div>
        `).join('');
    },

    // Cancel order
    async cancelOrder(orderId) {
        const reason = prompt('Por favor, informe o motivo do cancelamento:');

        if (!reason) return;

        try {
            Utils.showLoading();

            await OrdersAPI.cancelOrder(orderId, reason);

            Utils.showToast('Pedido cancelado com sucesso', 'success');

            document.getElementById('modal-container').innerHTML = '';

            // Reload orders
            await this.render();
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao cancelar pedido', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
};
