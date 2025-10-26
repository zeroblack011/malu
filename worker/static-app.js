/**
 * Malu Digital Services - Ultra Professional PWA
 * Enterprise-grade marketplace design
 */

export const getIndexHTML = () => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0F172A">
    <title>Malu Digital Services - Premium Digital Solutions</title>
    <style>
        :root {
            --primary: #3B82F6;
            --primary-dark: #2563EB;
            --secondary: #10B981;
            --dark: #0F172A;
            --dark-light: #1E293B;
            --gray: #64748B;
            --gray-light: #F1F5F9;
            --white: #FFFFFF;
            --success: #10B981;
            --warning: #F59E0B;
            --error: #EF4444;
            --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: var(--gray-light);
            color: var(--dark);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .topbar {
            background: var(--dark);
            color: var(--white);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        }

        .topbar-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .topbar-actions {
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }

        .credits-display {
            background: var(--dark-light);
            padding: 0.5rem 1.25rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .credits-amount {
            color: var(--secondary);
            margin-left: 0.5rem;
            font-size: 1rem;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        .hero {
            background: linear-gradient(135deg, var(--dark) 0%, var(--dark-light) 100%);
            color: var(--white);
            padding: 4rem 2rem;
            margin: -3rem -2rem 3rem -2rem;
            border-radius: 0 0 2rem 2rem;
        }

        .hero-content {
            max-width: 1400px;
            margin: 0 auto;
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
            line-height: 1.2;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--gray);
            max-width: 600px;
            line-height: 1.6;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .stat-label {
            color: var(--gray);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.5rem;
        }

        .section-header {
            margin-bottom: 2rem;
        }

        .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }

        .section-description {
            font-size: 1.125rem;
            color: var(--gray);
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .service-card {
            background: var(--white);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: var(--shadow);
            border: 1px solid #E2E8F0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transition: transform 0.3s;
        }

        .service-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary);
        }

        .service-card:hover::before {
            transform: scaleX(1);
        }

        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1.5rem;
        }

        .service-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-weight: 700;
            font-size: 1.25rem;
        }

        .service-badge {
            background: var(--success);
            color: var(--white);
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .service-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.75rem;
        }

        .service-description {
            color: var(--gray);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .service-features {
            list-style: none;
            margin-bottom: 1.5rem;
        }

        .service-features li {
            padding: 0.5rem 0;
            color: var(--dark);
            position: relative;
            padding-left: 1.5rem;
        }

        .service-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--success);
            font-weight: 700;
        }

        .service-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem;
            border-top: 1px solid #E2E8F0;
        }

        .service-price {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--dark);
        }

        .price-label {
            font-size: 0.875rem;
            color: var(--gray);
            font-weight: 400;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--primary);
            color: var(--white);
        }

        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
            background: var(--gray-light);
            color: var(--dark);
        }

        .btn-secondary:hover {
            background: #E2E8F0;
        }

        .btn-block {
            width: 100%;
            justify-content: center;
        }

        .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--dark) 0%, var(--dark-light) 100%);
            padding: 2rem;
        }

        .auth-card {
            background: var(--white);
            border-radius: 1rem;
            padding: 3rem;
            max-width: 480px;
            width: 100%;
            box-shadow: var(--shadow-xl);
        }

        .auth-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .auth-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }

        .auth-subtitle {
            color: var(--gray);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--dark);
            font-weight: 600;
            font-size: 0.875rem;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #E2E8F0;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;
            background: var(--white);
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-hint {
            font-size: 0.75rem;
            color: var(--gray);
            margin-top: 0.25rem;
        }

        .divider {
            text-align: center;
            margin: 1.5rem 0;
            position: relative;
        }

        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #E2E8F0;
        }

        .divider span {
            background: var(--white);
            padding: 0 1rem;
            position: relative;
            color: var(--gray);
            font-size: 0.875rem;
        }

        .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .package-card {
            background: var(--white);
            border-radius: 1rem;
            padding: 2rem;
            border: 2px solid #E2E8F0;
            transition: all 0.3s;
            position: relative;
        }

        .package-card.featured {
            border-color: var(--primary);
            transform: scale(1.05);
            box-shadow: var(--shadow-xl);
        }

        .package-card.featured::after {
            content: 'MAIS POPULAR';
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary);
            color: var(--white);
            padding: 0.25rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .package-card:hover {
            border-color: var(--primary);
            box-shadow: var(--shadow-lg);
        }

        .package-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 0.5rem;
        }

        .package-description {
            color: var(--gray);
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }

        .package-price {
            font-size: 3rem;
            font-weight: 800;
            color: var(--dark);
            margin-bottom: 0.25rem;
        }

        .package-price small {
            font-size: 1.5rem;
            font-weight: 400;
            color: var(--gray);
        }

        .package-credits {
            color: var(--success);
            font-weight: 600;
            margin-bottom: 1.5rem;
        }

        .package-features {
            list-style: none;
            margin: 1.5rem 0;
        }

        .package-features li {
            padding: 0.5rem 0;
            color: var(--dark);
            position: relative;
            padding-left: 1.5rem;
            font-size: 0.875rem;
        }

        .package-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--success);
            font-weight: 700;
        }

        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: var(--shadow-xl);
            border-left: 4px solid var(--success);
            z-index: 9999;
            animation: slideUp 0.3s;
            max-width: 400px;
        }

        .toast.error {
            border-left-color: var(--error);
        }

        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .nav-tabs {
            display: flex;
            gap: 2rem;
            border-bottom: 2px solid #E2E8F0;
            margin-bottom: 2rem;
        }

        .nav-tab {
            padding: 1rem 0;
            background: none;
            border: none;
            color: var(--gray);
            font-weight: 600;
            cursor: pointer;
            position: relative;
            transition: color 0.2s;
        }

        .nav-tab.active {
            color: var(--primary);
        }

        .nav-tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--primary);
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }
            .services-grid { grid-template-columns: 1fr; }
            .packages-grid { grid-template-columns: 1fr; }
            .package-card.featured { transform: scale(1); }
            .topbar-content { padding: 0 1rem; }
            .container { padding: 2rem 1rem; }
        }

        .loading {
            text-align: center;
            padding: 4rem 0;
            color: var(--gray);
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script>
        const API_BASE = '';
        let currentUser = null;
        let currentView = 'auth';

        const SERVICES = [
            {
                id: 'llc-usa',
                title: 'LLC Company Formation - USA',
                description: 'Abertura completa de empresa LLC nos Estados Unidos com documentação oficial, EIN, e suporte durante todo o processo.',
                credits: 600,
                badge: 'Premium',
                icon: 'LLC',
                features: [
                    'Registro oficial em Delaware, Wyoming ou Nevada',
                    'EIN (Employer Identification Number)',
                    'Operating Agreement personalizado',
                    'Suporte jurídico completo',
                    'Conta bancária business nos EUA',
                    'Endereço comercial virtual incluído',
                    'Annual Report do primeiro ano grátis'
                ],
                deliveryTime: '15-20 dias úteis',
                support: 'Suporte prioritário via WhatsApp'
            },
            {
                id: 'tiktok-shop',
                title: 'TikTok Shop Seller Account',
                description: 'Conta de vendedor TikTok Shop aprovada e verificada, pronta para começar a vender com alcance global.',
                credits: 400,
                badge: 'Trending',
                icon: 'TT',
                features: [
                    'Conta verificada e aprovada',
                    'Configuração completa de pagamentos',
                    'Integração com fulfillment centers',
                    'Tutorial completo de uso',
                    'Primeiros produtos cadastrados',
                    'Estratégias de venda incluídas',
                    '30 dias de suporte pós-entrega'
                ],
                deliveryTime: '5-7 dias úteis',
                support: 'Suporte via ticket'
            },
            {
                id: 'bm-250',
                title: 'Business Manager 250 Limit',
                description: 'Facebook Business Manager com limite de gastos de $250, ideal para começar campanhas de tráfego pago.',
                credits: 100,
                badge: 'Starter',
                icon: 'BM',
                features: [
                    'Limite de $250 aprovado',
                    'Conta publicitária configurada',
                    'Pixel instalado e testado',
                    'Acesso admin completo',
                    'Métodos de pagamento configurados',
                    'Proteção contra ban por 30 dias'
                ],
                deliveryTime: '24-48 horas',
                support: 'Suporte via email'
            },
            {
                id: 'bm-unlimited',
                title: 'Business Manager Unlimited',
                description: 'Facebook Business Manager com limite ilimitado, perfeito para escalar suas campanhas sem restrições.',
                credits: 200,
                badge: 'Pro',
                icon: 'BM+',
                features: [
                    'Sem limite de gastos',
                    'Múltiplas contas publicitárias',
                    'Histórico de gastos positivo',
                    'Proteção antiban avançada',
                    'Suporte prioritário 24/7',
                    'Substituição gratuita em caso de ban',
                    'Warm-up de conta incluído'
                ],
                deliveryTime: '3-5 dias úteis',
                support: 'Suporte prioritário 24/7'
            },
            {
                id: 'google-ads',
                title: 'Google Ads Account - Verified',
                description: 'Conta Google Ads verificada com histórico, ideal para campanhas de alto volume sem restrições.',
                credits: 300,
                badge: 'Premium',
                icon: 'GA',
                features: [
                    'Conta verificada e aged',
                    'Histórico de campanhas positivo',
                    'Threshold alto aprovado',
                    'Múltiplas campanhas permitidas',
                    'Acesso completo ao Google Analytics',
                    'Remarketing configurado',
                    'Proteção contra suspensão'
                ],
                deliveryTime: '7-10 dias úteis',
                support: 'Suporte via WhatsApp'
            },
            {
                id: 'stripe-account',
                title: 'Stripe Business Account',
                description: 'Conta Stripe business verificada para processar pagamentos internacionais com baixas taxas.',
                credits: 500,
                badge: 'Premium',
                icon: 'ST',
                features: [
                    'Conta verificada e ativada',
                    'Processamento internacional',
                    'Low risk profile',
                    'Integração com principais plataformas',
                    'Dashboard completo configurado',
                    'Sem hold de fundos inicial',
                    'Suporte na primeira transação'
                ],
                deliveryTime: '10-15 dias úteis',
                support: 'Suporte prioritário'
            }
        ];

        const PACKAGES = [
            {
                id: 'starter',
                name: 'Starter',
                description: 'Ideal para começar no digital',
                credits: 600,
                price: 497,
                features: [
                    '600 créditos inclusos',
                    'Acesso a todos os serviços',
                    'Suporte via email',
                    'Documentação completa',
                    'Validade de 90 dias'
                ]
            },
            {
                id: 'business',
                name: 'Business',
                description: 'Melhor custo-benefício',
                credits: 1400,
                price: 997,
                featured: true,
                features: [
                    '1.400 créditos inclusos',
                    'Acesso prioritário',
                    'Suporte via WhatsApp',
                    'Consultoria estratégica',
                    'Validade de 180 dias',
                    '15% de economia'
                ]
            },
            {
                id: 'premium',
                name: 'Premium',
                description: 'Para profissionais sérios',
                credits: 5000,
                price: 2997,
                features: [
                    '5.000 créditos inclusos',
                    'Suporte VIP 24/7',
                    'Account manager dedicado',
                    'Setup personalizado',
                    'Validade de 365 dias',
                    '30% de economia'
                ]
            },
            {
                id: 'empire',
                name: 'Empire',
                description: 'Solução enterprise completa',
                credits: 10000,
                price: 4997,
                features: [
                    '10.000 créditos inclusos',
                    'Suporte enterprise',
                    'Equipe dedicada',
                    'SLA garantido',
                    'Sem validade',
                    '45% de economia',
                    'Serviços customizados'
                ]
            }
        ];

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

            try {
                const response = await fetch(API_BASE + endpoint, options);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Erro na requisição');
                }

                return result;
            } catch (error) {
                throw error;
            }
        }

        async function handleRegister(e) {
            e.preventDefault();
            const formData = new FormData(e.target);

            try {
                await apiCall('/api/auth/register', 'POST', {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    password: formData.get('password')
                });

                showToast('Cadastro realizado com sucesso! Faça login para continuar.');
                currentView = 'auth';
                render();
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
                currentView = 'home';
                render();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }

        function renderAuth() {
            const isLogin = currentView === 'auth';
            return \`
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="logo" style="margin-bottom: 1rem;">Malu Digital Services</div>
                            <h2 class="auth-title">\${isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}</h2>
                            <p class="auth-subtitle">\${isLogin ? 'Acesse sua conta para continuar' : 'Comece sua jornada digital hoje'}</p>
                        </div>

                        <form onsubmit="\${isLogin ? 'handleLogin' : 'handleRegister'}(event)">
                            \${!isLogin ? \`
                                <div class="form-group">
                                    <label class="form-label">Nome Completo</label>
                                    <input type="text" name="name" class="form-input" placeholder="João Silva" required>
                                </div>
                            \` : ''}

                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-input" placeholder="seu@email.com" required>
                            </div>

                            \${!isLogin ? \`
                                <div class="form-group">
                                    <label class="form-label">Telefone</label>
                                    <input type="tel" name="phone" class="form-input" placeholder="(11) 99999-9999" required>
                                    <span class="form-hint">Usado para suporte prioritário</span>
                                </div>
                            \` : ''}

                            <div class="form-group">
                                <label class="form-label">Senha</label>
                                <input type="password" name="password" class="form-input" placeholder="••••••••" required>
                                \${!isLogin ? '<span class="form-hint">Mínimo 6 caracteres</span>' : ''}
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                \${isLogin ? 'Entrar na plataforma' : 'Criar minha conta'}
                            </button>
                        </form>

                        <div class="divider">
                            <span>\${isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}</span>
                        </div>

                        <button class="btn btn-secondary btn-block" onclick="currentView = '\${isLogin ? 'register' : 'auth'}'; render();">
                            \${isLogin ? 'Criar nova conta' : 'Fazer login'}
                        </button>
                    </div>
                </div>
            \`;
        }

        function renderTopbar() {
            return \`
                <div class="topbar">
                    <div class="topbar-content">
                        <div class="logo">Malu Digital Services</div>
                        <div class="topbar-actions">
                            <div class="credits-display">
                                Créditos disponíveis:<span class="credits-amount">\${currentUser?.credits || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderServices() {
            return \`
                <div class="section-header">
                    <h2 class="section-title">Serviços Disponíveis</h2>
                    <p class="section-description">Soluções digitais premium com entrega garantida e suporte especializado</p>
                </div>

                <div class="services-grid">
                    \${SERVICES.map(service => \`
                        <div class="service-card">
                            <div class="service-header">
                                <div class="service-icon">\${service.icon}</div>
                                <div class="service-badge">\${service.badge}</div>
                            </div>
                            <h3 class="service-title">\${service.title}</h3>
                            <p class="service-description">\${service.description}</p>

                            <ul class="service-features">
                                \${service.features.map(f => \`<li>\${f}</li>\`).join('')}
                            </ul>

                            <div class="service-footer">
                                <div>
                                    <div class="service-price">\${service.credits} <span class="price-label">créditos</span></div>
                                    <div style="font-size: 0.75rem; color: var(--gray); margin-top: 0.25rem;">
                                        Entrega: \${service.deliveryTime}
                                    </div>
                                </div>
                                <button class="btn btn-primary" onclick="orderService('\${service.id}')">
                                    Solicitar serviço
                                </button>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        function renderPackages() {
            return \`
                <div class="section-header">
                    <h2 class="section-title">Pacotes de Créditos</h2>
                    <p class="section-description">Escolha o melhor plano para suas necessidades e economize até 45%</p>
                </div>

                <div class="packages-grid">
                    \${PACKAGES.map(pkg => \`
                        <div class="package-card \${pkg.featured ? 'featured' : ''}">
                            <div class="package-name">\${pkg.name}</div>
                            <div class="package-description">\${pkg.description}</div>
                            <div class="package-price">\${formatCurrency(pkg.price)}</div>
                            <div class="package-credits">\${pkg.credits.toLocaleString()} créditos</div>

                            <ul class="package-features">
                                \${pkg.features.map(f => \`<li>\${f}</li>\`).join('')}
                            </ul>

                            <button class="btn btn-primary btn-block" onclick="buyPackage('\${pkg.id}')">
                                Adquirir \${pkg.name}
                            </button>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        function renderHome() {
            return \`
                \${renderTopbar()}

                <div class="hero">
                    <div class="hero-content">
                        <h1>Soluções Digitais Premium</h1>
                        <p>Plataforma completa de serviços digitais com qualidade enterprise, entrega garantida e suporte especializado para acelerar seu negócio online.</p>

                        <div class="stats">
                            <div class="stat-item">
                                <div class="stat-value">5,000+</div>
                                <div class="stat-label">Clientes ativos</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">99.8%</div>
                                <div class="stat-label">Taxa de sucesso</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">24/7</div>
                                <div class="stat-label">Suporte disponível</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="nav-tabs">
                        <button class="nav-tab \${currentView === 'home' ? 'active' : ''}" onclick="currentView = 'home'; render();">
                            Serviços
                        </button>
                        <button class="nav-tab \${currentView === 'packages' ? 'active' : ''}" onclick="currentView = 'packages'; render();">
                            Pacotes de Créditos
                        </button>
                    </div>

                    \${currentView === 'home' ? renderServices() : renderPackages()}
                </div>
            \`;
        }

        function orderService(serviceId) {
            const service = SERVICES.find(s => s.id === serviceId);
            if (currentUser.credits < service.credits) {
                showToast('Créditos insuficientes. Adquira mais créditos para continuar.', 'error');
                currentView = 'packages';
                render();
                return;
            }
            showToast('Funcionalidade de pedidos será ativada em breve. Entre em contato com suporte.');
        }

        function buyPackage(packageId) {
            showToast('Funcionalidade de pagamento será ativada em breve. Entre em contato com suporte.');
        }

        function render() {
            const app = document.getElementById('app');

            if (!currentUser && currentView !== 'register') {
                currentView = 'auth';
            }

            if (currentView === 'auth' || currentView === 'register') {
                app.innerHTML = renderAuth();
            } else {
                app.innerHTML = renderHome();
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Simular usuário logado para demonstração
                currentUser = { token, credits: 1200 };
                currentView = 'home';
            }
            render();
        });
    </script>
</body>
</html>`;
