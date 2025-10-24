// Authentication Manager
const Auth = {
    currentUser: null,

    // Initialize
    init() {
        this.currentUser = Utils.storage.get(CONFIG.STORAGE_KEYS.USER_DATA);
        this.checkAuth();
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    },

    // Check authentication status
    async checkAuth() {
        if (!this.isAuthenticated()) {
            this.showLoginForm();
            return false;
        }

        try {
            const user = await AuthAPI.getCurrentUser();
            this.currentUser = user;
            Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, user);
            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            this.logout();
            return false;
        }
    },

    // Show login form
    showLoginForm() {
        const modal = this.createAuthModal();
        document.getElementById('modal-container').innerHTML = modal;
        this.attachAuthEvents();
    },

    // Create auth modal
    createAuthModal() {
        return `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Bem-vindo ao Malu Digital</h2>
                    </div>
                    <div class="modal-body">
                        <div id="auth-tabs" class="auth-tabs">
                            <button class="auth-tab active" data-tab="login">Login</button>
                            <button class="auth-tab" data-tab="register">Cadastro</button>
                        </div>

                        <!-- Login Form -->
                        <form id="login-form" class="auth-form">
                            <div class="form-group">
                                <label class="form-label">Email <span class="form-required">*</span></label>
                                <input type="email" name="email" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Senha <span class="form-required">*</span></label>
                                <input type="password" name="password" class="form-input" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block btn-lg">
                                Entrar
                            </button>
                            <div class="text-center mt-2">
                                <a href="#" id="forgot-password-link" class="text-primary">Esqueci minha senha</a>
                            </div>
                        </form>

                        <!-- Register Form -->
                        <form id="register-form" class="auth-form hidden">
                            <div class="form-group">
                                <label class="form-label">Nome Completo <span class="form-required">*</span></label>
                                <input type="text" name="name" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email <span class="form-required">*</span></label>
                                <input type="email" name="email" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Telefone <span class="form-required">*</span></label>
                                <input type="tel" name="phone" class="form-input" placeholder="(00) 00000-0000" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">CPF <span class="form-required">*</span></label>
                                <input type="text" name="cpf" class="form-input" placeholder="000.000.000-00" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Senha <span class="form-required">*</span></label>
                                <input type="password" name="password" class="form-input" required minlength="6">
                                <span class="form-help">Mínimo 6 caracteres</span>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Confirmar Senha <span class="form-required">*</span></label>
                                <input type="password" name="confirmPassword" class="form-input" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block btn-lg">
                                Criar Conta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    // Attach auth events
    attachAuthEvents() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                const tabName = e.target.dataset.tab;
                document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
                document.getElementById('register-form').classList.toggle('hidden', tabName !== 'register');
            });
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(e.target);
        });

        // Forgot password
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordForm();
        });

        // Input formatting
        const phoneInput = document.querySelector('input[name="phone"]');
        phoneInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = Utils.formatPhone(value);
        });

        const cpfInput = document.querySelector('input[name="cpf"]');
        cpfInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = Utils.formatCPF(value);
        });
    },

    // Handle login
    async handleLogin(form) {
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            Utils.showLoading();
            const response = await AuthAPI.login(data);

            this.currentUser = response.user;
            document.getElementById('modal-container').innerHTML = '';

            Utils.showToast('Login realizado com sucesso!', 'success');

            // Initialize app
            if (window.App) {
                await App.init();
            }
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao fazer login', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Handle register
    async handleRegister(form) {
        const formData = new FormData(form);

        // Validate passwords match
        if (formData.get('password') !== formData.get('confirmPassword')) {
            Utils.showToast('As senhas não coincidem', 'error');
            return;
        }

        // Validate CPF
        const cpf = formData.get('cpf').replace(/\D/g, '');
        if (!Utils.validateCPF(cpf)) {
            Utils.showToast('CPF inválido', 'error');
            return;
        }

        // Validate phone
        const phone = formData.get('phone').replace(/\D/g, '');
        if (!Utils.validatePhone(phone)) {
            Utils.showToast('Telefone inválido', 'error');
            return;
        }

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: phone,
            cpf: cpf,
            password: formData.get('password')
        };

        try {
            Utils.showLoading();
            await AuthAPI.register(data);

            Utils.showToast('Conta criada com sucesso! Faça login para continuar.', 'success');

            // Switch to login tab
            document.querySelector('.auth-tab[data-tab="login"]').click();
            form.reset();
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao criar conta', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Show forgot password form
    showForgotPasswordForm() {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Recuperar Senha</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="forgot-password-form">
                            <p class="text-secondary mb-3">
                                Digite seu email para receber instruções de recuperação de senha.
                            </p>
                            <div class="form-group">
                                <label class="form-label">Email <span class="form-required">*</span></label>
                                <input type="email" name="email" class="form-input" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = new FormData(e.target).get('email');

            try {
                Utils.showLoading();
                await AuthAPI.requestPasswordReset(email);
                Utils.showToast('Instruções enviadas para seu email!', 'success');
                document.getElementById('modal-container').innerHTML = '';
            } catch (error) {
                Utils.showToast(error.message || 'Erro ao enviar email', 'error');
            } finally {
                Utils.hideLoading();
            }
        });
    },

    // Logout
    logout() {
        AuthAPI.logout();
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    },

    // Update user data
    updateUser(userData) {
        this.currentUser = { ...this.currentUser, ...userData };
        Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, this.currentUser);
    }
};
