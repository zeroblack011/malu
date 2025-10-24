// Main Application
const App = {
    currentPage: 'home',

    // Initialize application
    async init() {
        // Initialize authentication
        Auth.init();

        // Check if user is authenticated
        const isAuth = await Auth.checkAuth();

        if (!isAuth) {
            Utils.hideLoading();
            return;
        }

        // Initialize modules
        await this.initModules();

        // Setup navigation
        this.setupNavigation();

        // Setup PWA install prompt
        this.setupPWAInstall();

        // Navigate to home page
        await this.navigate('home');

        // Show app
        document.getElementById('app').style.display = 'flex';
        Utils.hideLoading();
    },

    // Initialize modules
    async initModules() {
        try {
            // Initialize credits
            await Credits.init();

            // Initialize orders
            await Orders.init();

            // Initialize notifications
            await Notifications.init();

            // Initialize services
            await Services.init();
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    },

    // Setup navigation
    setupNavigation() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigate(page);
            });
        });

        // Notifications button
        document.getElementById('notifications-btn')?.addEventListener('click', () => {
            Notifications.showPanel();
        });

        // Credits badge
        document.getElementById('credits-badge')?.addEventListener('click', () => {
            this.navigate('credits');
        });
    },

    // Navigate to page
    async navigate(page) {
        this.currentPage = page;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Load page content
        await this.loadPage(page);
    },

    // Load page content
    async loadPage(page) {
        const pages = {
            'home': () => this.renderHomePage(),
            'credits': () => Credits.showCreditsPage(),
            'orders': () => Orders.render(),
            'profile': () => this.renderProfilePage()
        };

        if (pages[page]) {
            await pages[page]();
        }
    },

    // Render home page
    renderHomePage() {
        const user = Auth.getCurrentUser();

        const html = `
            <div class="home-page">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <h2 class="welcome-title">Olá, ${user?.name?.split(' ')[0] || 'Cliente'}! 👋</h2>
                    <p class="welcome-text">
                        Você tem <strong>${Utils.formatNumber(Credits.balance)} créditos</strong> disponíveis
                    </p>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <button class="action-card" onclick="Credits.showPurchaseModal()">
                        <span class="action-icon">💎</span>
                        <div class="action-info">
                            <strong>Comprar Créditos</strong>
                            <small>Adicione mais créditos</small>
                        </div>
                    </button>

                    <button class="action-card" onclick="App.navigate('orders')">
                        <span class="action-icon">📦</span>
                        <div class="action-info">
                            <strong>Meus Pedidos</strong>
                            <small>Acompanhe seus serviços</small>
                        </div>
                    </button>
                </div>

                <!-- Services Section -->
                <div class="services-section">
                    <div class="section-header">
                        <h3>Nossos Serviços</h3>
                    </div>
                    ${Services.renderServices()}
                </div>

                <!-- Popular Services -->
                <div class="popular-services mt-4">
                    <div class="section-header">
                        <h3>Serviços Populares</h3>
                    </div>
                    ${this.renderPopularServices()}
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = html;
    },

    // Render popular services
    renderPopularServices() {
        const popular = CONFIG.SERVICES.filter(s => s.popular).slice(0, 3);

        return `
            <div class="grid grid-cols-1">
                ${popular.map(service => `
                    <div class="service-card-horizontal" onclick="Services.viewService('${service.id}')">
                        <div class="service-icon-large">${service.icon}</div>
                        <div class="service-content">
                            <h4 class="service-name">${service.name}</h4>
                            <p class="service-description">${service.description}</p>
                            <div class="service-meta">
                                <span class="service-price-tag">
                                    <span class="credits-icon">💎</span>
                                    ${Utils.formatNumber(service.credits)}
                                </span>
                                <span class="service-delivery-tag">
                                    ⏱️ ${service.deliveryTime}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Render profile page
    renderProfilePage() {
        const user = Auth.getCurrentUser();

        const html = `
            <div class="profile-page">
                <div class="page-header">
                    <h2 class="page-title">Meu Perfil</h2>
                </div>

                <!-- User Info Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Informações Pessoais</h3>
                    </div>
                    <div class="card-body">
                        <div class="profile-info">
                            <div class="info-item">
                                <span class="info-label">Nome:</span>
                                <span class="info-value">${user?.name || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${user?.email || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Telefone:</span>
                                <span class="info-value">${user?.phone ? Utils.formatPhone(user.phone) : '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">CPF:</span>
                                <span class="info-value">${user?.cpf ? Utils.formatCPF(user.cpf) : '-'}</span>
                            </div>
                        </div>

                        <button class="btn btn-outline mt-3" onclick="App.showEditProfile()">
                            Editar Perfil
                        </button>
                    </div>
                </div>

                <!-- Account Stats -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Estatísticas da Conta</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value">${Utils.formatNumber(Credits.balance)}</div>
                                <div class="stat-label">Créditos Disponíveis</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${Orders.orders.length}</div>
                                <div class="stat-label">Pedidos Realizados</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${Orders.orders.filter(o => o.status === 'COMPLETED').length}</div>
                                <div class="stat-label">Pedidos Concluídos</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Configurações</h3>
                    </div>
                    <div class="card-body">
                        <div class="settings-list">
                            <button class="setting-item" onclick="Payment.showHistory()">
                                <span class="setting-icon">💳</span>
                                <span class="setting-label">Histórico de Pagamentos</span>
                                <span class="setting-arrow">›</span>
                            </button>

                            <button class="setting-item" onclick="App.showChangePassword()">
                                <span class="setting-icon">🔒</span>
                                <span class="setting-label">Alterar Senha</span>
                                <span class="setting-arrow">›</span>
                            </button>

                            <button class="setting-item" onclick="App.showSupport()">
                                <span class="setting-icon">💬</span>
                                <span class="setting-label">Suporte</span>
                                <span class="setting-arrow">›</span>
                            </button>

                            <button class="setting-item" onclick="App.showAbout()">
                                <span class="setting-icon">ℹ️</span>
                                <span class="setting-label">Sobre o App</span>
                                <span class="setting-arrow">›</span>
                            </button>

                            <button class="setting-item" onclick="Auth.logout()">
                                <span class="setting-icon">🚪</span>
                                <span class="setting-label">Sair</span>
                                <span class="setting-arrow">›</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = html;
    },

    // Show edit profile
    showEditProfile() {
        const user = Auth.getCurrentUser();

        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Editar Perfil</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-profile-form">
                            <div class="form-group">
                                <label class="form-label">Nome Completo</label>
                                <input type="text" name="name" class="form-input" value="${user?.name || ''}" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Telefone</label>
                                <input type="tel" name="phone" class="form-input" value="${user?.phone || ''}" required>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleEditProfile(e.target);
        });
    },

    // Handle edit profile
    async handleEditProfile(form) {
        const formData = new FormData(form);

        try {
            Utils.showLoading();

            const data = {
                name: formData.get('name'),
                phone: formData.get('phone').replace(/\D/g, '')
            };

            await AuthAPI.updateProfile(data);

            Utils.showToast('Perfil atualizado com sucesso!', 'success');

            document.getElementById('modal-container').innerHTML = '';

            // Reload profile page
            this.renderProfilePage();
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao atualizar perfil', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Show change password
    showChangePassword() {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Alterar Senha</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="change-password-form">
                            <div class="form-group">
                                <label class="form-label">Senha Atual</label>
                                <input type="password" name="currentPassword" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Nova Senha</label>
                                <input type="password" name="newPassword" class="form-input" required minlength="6">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Confirmar Nova Senha</label>
                                <input type="password" name="confirmPassword" class="form-input" required>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                Alterar Senha
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        document.getElementById('change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            Utils.showToast('Funcionalidade em desenvolvimento', 'info');
        });
    },

    // Show support
    showSupport() {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Suporte</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="support-info">
                            <h3>Como podemos ajudar?</h3>

                            <div class="contact-methods">
                                <a href="https://wa.me/5511999999999" class="contact-btn" target="_blank">
                                    <span class="contact-icon">💬</span>
                                    <div class="contact-info">
                                        <strong>WhatsApp</strong>
                                        <small>Resposta rápida</small>
                                    </div>
                                </a>

                                <a href="mailto:suporte@malu.com.br" class="contact-btn">
                                    <span class="contact-icon">✉️</span>
                                    <div class="contact-info">
                                        <strong>Email</strong>
                                        <small>suporte@malu.com.br</small>
                                    </div>
                                </a>
                            </div>

                            <div class="faq-section mt-4">
                                <h4>Perguntas Frequentes</h4>
                                <div class="faq-item">
                                    <strong>Como funcionam os créditos?</strong>
                                    <p>Os créditos são utilizados para adquirir serviços na plataforma. Eles nunca expiram e podem ser usados a qualquer momento.</p>
                                </div>
                                <div class="faq-item">
                                    <strong>Quanto tempo leva para processar um pedido?</strong>
                                    <p>O prazo varia de acordo com o serviço. Você pode conferir o prazo estimado na página de cada serviço.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
    },

    // Show about
    showAbout() {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Sobre o Malu Digital</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="about-content">
                            <p class="text-center mb-3">
                                <strong class="text-primary" style="font-size: 2rem;">Malu Digital Services</strong>
                            </p>

                            <p>
                                Somos uma plataforma completa de serviços digitais, oferecendo soluções profissionais
                                para empreendedores e empresas que desejam crescer no mundo digital.
                            </p>

                            <h4 class="mt-3">Nossa Missão</h4>
                            <p>
                                Facilitar o acesso a serviços digitais de alta qualidade através de um sistema
                                simples, transparente e eficiente de créditos.
                            </p>

                            <h4 class="mt-3">Versão do App</h4>
                            <p>1.0.0</p>

                            <div class="text-center mt-4">
                                <p class="text-secondary">
                                    © 2024 Malu Digital Services<br>
                                    Todos os direitos reservados
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
    },

    // Setup PWA install prompt
    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button if not standalone
            if (!Utils.isStandalone()) {
                this.showInstallPrompt(deferredPrompt);
            }
        });

        window.addEventListener('appinstalled', () => {
            Utils.showToast('App instalado com sucesso!', 'success');
            deferredPrompt = null;
        });
    },

    // Show install prompt
    showInstallPrompt(deferredPrompt) {
        // Only show once per session
        if (sessionStorage.getItem('installPromptShown')) {
            return;
        }

        setTimeout(() => {
            const banner = `
                <div class="install-banner">
                    <div class="install-content">
                        <span class="install-icon">📱</span>
                        <div class="install-text">
                            <strong>Instale o App</strong>
                            <small>Acesso rápido direto da tela inicial</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary" id="install-btn">Instalar</button>
                    <button class="btn btn-sm btn-outline" id="dismiss-install">Depois</button>
                </div>
            `;

            const div = document.createElement('div');
            div.innerHTML = banner;
            document.body.appendChild(div.firstElementChild);

            document.getElementById('install-btn').addEventListener('click', async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;

                if (outcome === 'accepted') {
                    Utils.showToast('Instalação iniciada!', 'success');
                }

                document.querySelector('.install-banner').remove();
                sessionStorage.setItem('installPromptShown', 'true');
            });

            document.getElementById('dismiss-install').addEventListener('click', () => {
                document.querySelector('.install-banner').remove();
                sessionStorage.setItem('installPromptShown', 'true');
            });
        }, 3000);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
