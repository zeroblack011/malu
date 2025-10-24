// Admin Panel
const Admin = {
    currentPage: 'dashboard',
    orders: [],
    users: [],
    stats: {},

    // Initialize
    async init() {
        // Check admin authentication
        const token = Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        if (!token) {
            window.location.href = '/';
            return;
        }

        this.setupNavigation();
        await this.loadPage('dashboard');
    },

    // Setup navigation
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                await this.loadPage(page);
            });
        });

        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.loadPage(this.currentPage);
        });
    },

    // Load page
    async loadPage(page) {
        this.currentPage = page;

        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'orders': 'Gerenciar Pedidos',
            'users': 'Usuários',
            'payments': 'Pagamentos',
            'reports': 'Relatórios',
            'settings': 'Configurações'
        };

        document.getElementById('page-title').textContent = titles[page];

        // Load page content
        const pages = {
            'dashboard': () => this.renderDashboard(),
            'orders': () => this.renderOrders(),
            'users': () => this.renderUsers(),
            'payments': () => this.renderPayments(),
            'reports': () => this.renderReports(),
            'settings': () => this.renderSettings()
        };

        if (pages[page]) {
            Utils.showLoading();
            await pages[page]();
            Utils.hideLoading();
        }
    },

    // Render Dashboard
    async renderDashboard() {
        try {
            this.stats = await AdminAPI.getDashboardStats();

            const html = `
                <!-- Stats Grid -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-label">Receita Total</div>
                                <div class="stat-value">${Utils.formatCurrency(this.stats.totalRevenue || 0)}</div>
                            </div>
                            <div class="stat-icon">💰</div>
                        </div>
                        <div class="stat-change positive">
                            +${this.stats.revenueGrowth || 0}% vs mês anterior
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-label">Pedidos Ativos</div>
                                <div class="stat-value">${this.stats.activeOrders || 0}</div>
                            </div>
                            <div class="stat-icon">📦</div>
                        </div>
                        <div class="stat-change">
                            ${this.stats.pendingOrders || 0} pendentes
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-label">Usuários Ativos</div>
                                <div class="stat-value">${this.stats.activeUsers || 0}</div>
                            </div>
                            <div class="stat-icon">👥</div>
                        </div>
                        <div class="stat-change positive">
                            +${this.stats.newUsers || 0} novos este mês
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div>
                                <div class="stat-label">Créditos em Circulação</div>
                                <div class="stat-value">${Utils.formatNumber(this.stats.totalCredits || 0)}</div>
                            </div>
                            <div class="stat-icon">💎</div>
                        </div>
                        <div class="stat-change">
                            ${Utils.formatCurrency(this.stats.creditsValue || 0)} em valor
                        </div>
                    </div>
                </div>

                <!-- Recent Orders -->
                <div class="data-table">
                    <div class="table-header">
                        <h3 class="table-title">Pedidos Recentes</h3>
                        <button class="btn btn-sm btn-primary" onclick="Admin.loadPage('orders')">
                            Ver Todos
                        </button>
                    </div>
                    <div class="table-content">
                        ${this.renderRecentOrders()}
                    </div>
                </div>
            `;

            document.getElementById('admin-content').innerHTML = html;
        } catch (error) {
            Utils.showToast('Erro ao carregar dashboard', 'error');
        }
    },

    // Render recent orders
    renderRecentOrders() {
        const recentOrders = this.stats.recentOrders || [];

        if (recentOrders.length === 0) {
            return '<div class="empty-table"><p>Nenhum pedido recente</p></div>';
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentOrders.map(order => `
                        <tr>
                            <td>#${order.id.slice(0, 8)}</td>
                            <td>${order.userName}</td>
                            <td>${order.serviceName}</td>
                            <td>
                                <span class="order-status ${order.status.toLowerCase()}">
                                    ${CONFIG.ORDER_STATUS[order.status]?.label || order.status}
                                </span>
                            </td>
                            <td>${Utils.formatDate(order.createdAt)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn" onclick="Admin.viewOrder('${order.id}')">
                                        Ver
                                    </button>
                                    <button class="action-btn" onclick="Admin.updateOrderStatus('${order.id}')">
                                        Atualizar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    // Render Orders
    async renderOrders() {
        try {
            const response = await AdminAPI.getAllOrders();
            this.orders = response.orders || [];

            const html = `
                <!-- Filters -->
                <div class="filters-bar">
                    <div class="filter-group">
                        <label class="filter-label">Status</label>
                        <select class="form-select" id="filter-status" onchange="Admin.filterOrders()">
                            <option value="">Todos</option>
                            ${Object.keys(CONFIG.ORDER_STATUS).map(status => `
                                <option value="${status}">${CONFIG.ORDER_STATUS[status].label}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Serviço</label>
                        <select class="form-select" id="filter-service" onchange="Admin.filterOrders()">
                            <option value="">Todos</option>
                            ${CONFIG.SERVICES.map(s => `
                                <option value="${s.id}">${s.name}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Período</label>
                        <select class="form-select" id="filter-period" onchange="Admin.filterOrders()">
                            <option value="all">Todos</option>
                            <option value="today">Hoje</option>
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mês</option>
                        </select>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="data-table">
                    <div class="table-header">
                        <h3 class="table-title">Todos os Pedidos (${this.orders.length})</h3>
                        <div class="table-actions">
                            <div class="search-box">
                                <span class="search-icon">🔍</span>
                                <input
                                    type="search"
                                    class="form-input"
                                    placeholder="Buscar pedidos..."
                                    id="search-orders"
                                    oninput="Admin.searchOrders(this.value)"
                                />
                            </div>
                        </div>
                    </div>
                    <div id="orders-table-content">
                        ${this.renderOrdersTable(this.orders)}
                    </div>
                </div>
            `;

            document.getElementById('admin-content').innerHTML = html;
        } catch (error) {
            Utils.showToast('Erro ao carregar pedidos', 'error');
        }
    },

    // Render orders table
    renderOrdersTable(orders) {
        if (orders.length === 0) {
            return `
                <div class="empty-table">
                    <div class="empty-table-icon">📦</div>
                    <h3>Nenhum pedido encontrado</h3>
                </div>
            `;
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Créditos</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Responsável</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td><strong>#${order.id.slice(0, 8)}</strong></td>
                            <td>${order.userName}</td>
                            <td>${order.serviceName}</td>
                            <td>
                                <span class="credits-icon">💎</span>
                                ${Utils.formatNumber(order.credits)}
                            </td>
                            <td>
                                <span class="order-status ${order.status.toLowerCase()}">
                                    ${CONFIG.ORDER_STATUS[order.status]?.label || order.status}
                                </span>
                            </td>
                            <td>${Utils.formatDateTime(order.createdAt)}</td>
                            <td>${order.assignedTo || '-'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn" onclick="Admin.viewOrder('${order.id}')">
                                        Ver
                                    </button>
                                    <button class="action-btn" onclick="Admin.updateOrderStatus('${order.id}')">
                                        Status
                                    </button>
                                    <button class="action-btn" onclick="Admin.assignOrder('${order.id}')">
                                        Atribuir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="table-pagination">
                <div class="pagination-info">
                    Mostrando ${orders.length} pedidos
                </div>
            </div>
        `;
    },

    // Filter orders
    filterOrders() {
        const status = document.getElementById('filter-status')?.value;
        const service = document.getElementById('filter-service')?.value;
        const period = document.getElementById('filter-period')?.value;

        let filtered = this.orders;

        if (status) {
            filtered = filtered.filter(o => o.status === status);
        }

        if (service) {
            filtered = filtered.filter(o => o.serviceId === service);
        }

        if (period && period !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (period) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(o => new Date(o.createdAt) >= filterDate);
        }

        document.getElementById('orders-table-content').innerHTML = this.renderOrdersTable(filtered);
    },

    // Search orders
    searchOrders: Utils.debounce(function(query) {
        const filtered = Admin.orders.filter(order =>
            order.id.toLowerCase().includes(query.toLowerCase()) ||
            order.userName.toLowerCase().includes(query.toLowerCase()) ||
            order.serviceName.toLowerCase().includes(query.toLowerCase())
        );

        document.getElementById('orders-table-content').innerHTML = Admin.renderOrdersTable(filtered);
    }, 300),

    // View order
    async viewOrder(orderId) {
        // Redirect to order details modal
        Utils.showToast('Visualizando pedido ' + orderId, 'info');
    },

    // Update order status
    async updateOrderStatus(orderId) {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Atualizar Status do Pedido</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="update-status-form">
                            <div class="form-group">
                                <label class="form-label">Novo Status</label>
                                <select name="status" class="form-select" required>
                                    ${Object.entries(CONFIG.ORDER_STATUS).map(([key, value]) => `
                                        <option value="${key}">${value.label}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Notas</label>
                                <textarea name="notes" class="form-textarea" rows="4"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                Atualizar Status
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        document.getElementById('update-status-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);

            try {
                Utils.showLoading();

                await AdminAPI.updateOrderStatus(
                    orderId,
                    formData.get('status'),
                    formData.get('notes')
                );

                Utils.showToast('Status atualizado com sucesso!', 'success');

                document.getElementById('modal-container').innerHTML = '';

                // Reload orders
                await this.renderOrders();
            } catch (error) {
                Utils.showToast('Erro ao atualizar status', 'error');
            } finally {
                Utils.hideLoading();
            }
        });
    },

    // Assign order
    async assignOrder(orderId) {
        Utils.showToast('Funcionalidade em desenvolvimento', 'info');
    },

    // Render Users
    async renderUsers() {
        const html = `
            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">Usuários</h3>
                </div>
                <div class="empty-table">
                    <div class="empty-table-icon">👥</div>
                    <h3>Em desenvolvimento</h3>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
    },

    // Render Payments
    async renderPayments() {
        const html = `
            <div class="data-table">
                <div class="table-header">
                    <h3 class="table-title">Pagamentos</h3>
                </div>
                <div class="empty-table">
                    <div class="empty-table-icon">💳</div>
                    <h3>Em desenvolvimento</h3>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
    },

    // Render Reports
    async renderReports() {
        const html = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3 class="chart-title">Relatórios</h3>
                </div>
                <div class="empty-table">
                    <div class="empty-table-icon">📈</div>
                    <h3>Em desenvolvimento</h3>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
    },

    // Render Settings
    async renderSettings() {
        const html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Configurações do Sistema</h3>
                </div>
                <div class="card-body">
                    <div class="empty-state">
                        <div class="empty-icon">⚙️</div>
                        <h3>Em desenvolvimento</h3>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('admin-content').innerHTML = html;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
