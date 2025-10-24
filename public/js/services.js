// Services Manager
const Services = {
    services: [],
    currentCategory: 'all',

    // Initialize
    async init() {
        this.services = CONFIG.SERVICES;
        this.render();
    },

    // Render services page
    render() {
        const html = `
            <div class="services-page">
                <!-- Categories Filter -->
                <div class="categories-filter">
                    ${this.renderCategories()}
                </div>

                <!-- Search Bar -->
                <div class="search-container">
                    <input
                        type="search"
                        id="service-search"
                        class="form-input"
                        placeholder="Buscar serviços..."
                    />
                </div>

                <!-- Services Grid -->
                <div class="services-grid" id="services-grid">
                    ${this.renderServices()}
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = html;
        this.attachEvents();
    },

    // Render categories
    renderCategories() {
        return CONFIG.CATEGORIES.map(cat => `
            <button
                class="category-btn ${cat.id === this.currentCategory ? 'active' : ''}"
                data-category="${cat.id}"
            >
                <span class="category-icon">${cat.icon}</span>
                <span class="category-name">${cat.name}</span>
            </button>
        `).join('');
    },

    // Render services
    renderServices() {
        const filtered = this.getFilteredServices();

        if (filtered.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3 class="empty-title">Nenhum serviço encontrado</h3>
                    <p class="empty-description">Tente ajustar os filtros de busca</p>
                </div>
            `;
        }

        return filtered.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-name">${service.name}</h3>
                <p class="service-description">${service.description}</p>

                <div class="service-meta">
                    <span class="service-delivery">
                        <span>⏱️</span>
                        ${service.deliveryTime}
                    </span>
                    ${service.popular ? '<span class="service-badge">POPULAR</span>' : ''}
                </div>

                <div class="service-price">
                    <div class="service-credits">
                        <span class="credits-icon">💎</span>
                        ${Utils.formatNumber(service.credits)}
                    </div>
                    ${service.recurring ? `<small class="text-secondary">/${service.recurring === 'monthly' ? 'mês' : 'ano'}</small>` : ''}
                </div>

                <button
                    class="btn btn-primary btn-block"
                    onclick="Services.viewService('${service.id}')"
                >
                    Ver Detalhes
                </button>
            </div>
        `).join('');
    },

    // Get filtered services
    getFilteredServices() {
        let filtered = this.services;

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(s => s.category === this.currentCategory);
        }

        // Filter by search
        const searchTerm = document.getElementById('service-search')?.value?.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm) ||
                s.description.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    },

    // Attach events
    attachEvents() {
        // Category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.currentTarget.dataset.category;
                this.render();
            });
        });

        // Search
        const searchInput = document.getElementById('service-search');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                document.getElementById('services-grid').innerHTML = this.renderServices();
            }, 300));
        }
    },

    // View service details
    viewService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;

        const modal = `
            <div class="modal-overlay">
                <div class="modal modal-wide">
                    <div class="modal-header">
                        <h2 class="modal-title">${service.icon} ${service.name}</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="service-detail">
                            <p class="service-description-full">${service.description}</p>

                            <div class="service-info-grid">
                                <div class="info-item">
                                    <span class="info-label">Custo</span>
                                    <span class="info-value">
                                        <span class="credits-icon">💎</span>
                                        ${Utils.formatNumber(service.credits)} créditos
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Prazo de Entrega</span>
                                    <span class="info-value">${service.deliveryTime}</span>
                                </div>
                            </div>

                            <div class="benefits-section">
                                <h4>O que está incluído:</h4>
                                <ul class="benefits-list">
                                    ${service.benefits.map(b => `<li>✓ ${b}</li>`).join('')}
                                </ul>
                            </div>

                            <div class="balance-check">
                                <p>
                                    <strong>Seu saldo:</strong>
                                    <span class="credits-icon">💎</span>
                                    ${Utils.formatNumber(Credits.balance)} créditos
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">
                            Cancelar
                        </button>
                        <button class="btn btn-primary btn-lg" onclick="Services.purchaseService('${service.id}')">
                            ${Credits.hasEnoughCredits(service.credits) ? 'Usar Créditos' : 'Comprar Créditos'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
    },

    // Purchase service
    async purchaseService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;

        // Check if user has enough credits
        if (!Credits.hasEnoughCredits(service.credits)) {
            document.getElementById('modal-container').innerHTML = '';
            Credits.showPurchaseModal(true);
            return;
        }

        // Close current modal
        document.getElementById('modal-container').innerHTML = '';

        // Show service form
        Forms.showServiceForm(service);
    }
};
