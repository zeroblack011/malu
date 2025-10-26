/**
 * Static PWA App - Inline version for dashboard deployment
 */

export const getIndexHTML = () => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#2563eb">
    <title>Malu Digital Services</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .app-container { max-width: 1200px; margin: 0 auto; padding: 20px; }

        .header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .logo { font-size: 24px; font-weight: 700; color: #667eea; }

        .credits-badge {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
        }

        .auth-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            max-width: 400px;
            margin: 40px auto;
        }

        .auth-section h2 {
            color: #667eea;
            margin-bottom: 20px;
            text-align: center;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #374151;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }

        .btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            margin-top: 10px;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .service-card {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            cursor: pointer;
        }

        .service-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .service-card h3 {
            color: #667eea;
            margin-bottom: 10px;
        }

        .service-card .price {
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
            margin: 10px 0;
        }

        .credits-packages {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .package-card {
            background: white;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            cursor: pointer;
        }

        .package-card:hover {
            transform: scale(1.05);
        }

        .package-card.popular {
            border: 3px solid #fbbf24;
            position: relative;
        }

        .package-card .package-name {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
        }

        .package-card .package-credits {
            font-size: 36px;
            font-weight: 700;
            color: #10b981;
            margin: 15px 0;
        }

        .package-card .package-price {
            font-size: 28px;
            font-weight: 700;
            color: #374151;
        }

        .hidden { display: none !important; }

        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 24px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s;
        }

        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .toast.success { border-left: 4px solid #10b981; }
        .toast.error { border-left: 4px solid #ef4444; }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            display: flex;
            justify-content: space-around;
            padding: 12px 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px 16px;
            color: #9ca3af;
            transition: color 0.3s;
        }

        .nav-item.active {
            color: #667eea;
        }

        .nav-icon {
            font-size: 24px;
            margin-bottom: 4px;
        }

        .nav-label {
            font-size: 12px;
        }

        .content-section {
            margin-bottom: 80px;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script>
        const API_BASE = '';
        let currentUser = null;
        let currentPage = 'auth';

        // Utils
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = \`toast \${type}\`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        }

        // API Calls
        async function apiCall(endpoint, method = 'GET', data = null) {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };

            if (currentUser?.token) {
                options.headers['Authorization'] = \`Bearer \${currentUser.token}\`;
            }

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(API_BASE + endpoint, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro na requisição');
            }

            return result;
        }

        // Auth
        async function handleRegister(e) {
            e.preventDefault();
            const formData = new FormData(e.target);

            try {
                const result = await apiCall('/api/auth/register', 'POST', {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    password: formData.get('password')
                });

                showToast('Cadastro realizado! Faça login.');
                renderLoginForm();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            const formData = new FormData(e.target);

            try {
                const result = await apiCall('/api/auth/login', 'POST', {
                    email: formData.get('email'),
                    password: formData.get('password')
                });

                currentUser = result;
                localStorage.setItem('token', result.token);
                showToast('Login realizado com sucesso!');
                currentPage = 'home';
                render();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }

        // Services Data
        const services = [
            { id: 'llc-usa', name: 'Empresa LLC USA', credits: 600, description: 'Abertura completa de LLC nos EUA' },
            { id: 'tiktok-shop', name: 'TikTok Shop', credits: 400, description: 'Conta TikTok Shop aprovada' },
            { id: 'bm-250', name: 'BM 250', credits: 100, description: 'Business Manager 250 limite' },
            { id: 'bm-unlimited', name: 'BM Ilimitado', credits: 200, description: 'Business Manager ilimitado' },
        ];

        const packages = [
            { id: 'starter', name: 'Starter', credits: 600, price: 497 },
            { id: 'business', name: 'Business', credits: 1400, price: 997, popular: true },
            { id: 'premium', name: 'Premium', credits: 5000, price: 2997 },
            { id: 'empire', name: 'Empire', credits: 10000, price: 4997 },
        ];

        // Render Functions
        function renderLoginForm() {
            return \`
                <div class="auth-section">
                    <h2>Login</h2>
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Senha</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Entrar</button>
                        <button type="button" class="btn btn-secondary" onclick="renderRegisterForm()">Criar Conta</button>
                    </form>
                </div>
            \`;
        }

        function renderRegisterForm() {
            document.getElementById('app').innerHTML = \`
                <div class="auth-section">
                    <h2>Criar Conta</h2>
                    <form onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label>Nome</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="tel" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label>Senha</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                        <button type="button" class="btn btn-secondary" onclick="render()">Já tenho conta</button>
                    </form>
                </div>
            \`;
        }

        function renderHome() {
            return \`
                <div class="app-container content-section">
                    <div class="header">
                        <div class="logo">🚀 Malu Digital</div>
                        <div class="credits-badge">💎 \${currentUser.credits || 0} créditos</div>
                    </div>

                    <h2 style="color: white; margin: 20px 0;">Serviços Disponíveis</h2>
                    <div class="services-grid">
                        \${services.map(s => \`
                            <div class="service-card">
                                <h3>\${s.name}</h3>
                                <p>\${s.description}</p>
                                <div class="price">\${s.credits} créditos</div>
                                <button class="btn btn-primary" onclick="orderService('\${s.id}')">Solicitar</button>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
        }

        function renderCredits() {
            return \`
                <div class="app-container content-section">
                    <div class="header">
                        <div class="logo">💳 Comprar Créditos</div>
                        <div class="credits-badge">💎 \${currentUser.credits || 0} créditos</div>
                    </div>

                    <div class="credits-packages">
                        \${packages.map(p => \`
                            <div class="package-card \${p.popular ? 'popular' : ''}">
                                <div class="package-name">\${p.name}</div>
                                <div class="package-credits">\${p.credits}</div>
                                <div style="color: #9ca3af; margin: 10px 0;">créditos</div>
                                <div class="package-price">\${formatCurrency(p.price)}</div>
                                <button class="btn btn-primary" style="margin-top: 20px;" onclick="buyPackage('\${p.id}')">Comprar</button>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
        }

        function renderBottomNav() {
            return \`
                <div class="bottom-nav">
                    <button class="nav-item \${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">
                        <div class="nav-icon">🏠</div>
                        <div class="nav-label">Início</div>
                    </button>
                    <button class="nav-item \${currentPage === 'credits' ? 'active' : ''}" onclick="navigateTo('credits')">
                        <div class="nav-icon">💳</div>
                        <div class="nav-label">Créditos</div>
                    </button>
                    <button class="nav-item" onclick="logout()">
                        <div class="nav-icon">🚪</div>
                        <div class="nav-label">Sair</div>
                    </button>
                </div>
            \`;
        }

        function navigateTo(page) {
            currentPage = page;
            render();
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('token');
            currentPage = 'auth';
            render();
        }

        async function orderService(serviceId) {
            showToast('Funcionalidade de pedidos em breve!');
        }

        async function buyPackage(packageId) {
            showToast('Funcionalidade de pagamento em breve!');
        }

        function render() {
            const app = document.getElementById('app');

            if (!currentUser) {
                app.innerHTML = renderLoginForm();
                return;
            }

            let content = '';
            if (currentPage === 'home') content = renderHome();
            else if (currentPage === 'credits') content = renderCredits();

            app.innerHTML = content + renderBottomNav();
        }

        // Init
        window.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            if (token) {
                // TODO: Validate token
                // currentUser = { token };
            }
            render();
        });
    </script>
</body>
</html>`;
