/**
 * Frontend Profissional - Sistema Completo com PIX
 * SEM emojis tradicionais - Design corporativo
 */

export function getIndexHTML() {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Malu Digital Services - Serviços Digitais Empresariais</title>
    <meta name="description" content="LLC EUA, TikTok Shop, Business Manager, Google Ads, Stripe - Serviços digitais profissionais para empresas">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0066FF;
            --primary-dark: #0052CC;
            --secondary: #00C853;
            --dark: #1A202C;
            --gray: #4A5568;
            --light-gray: #EDF2F7;
            --white: #FFFFFF;
            --border: #E2E8F0;
            --success: #48BB78;
            --error: #F56565;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--white);
            color: var(--dark);
            line-height: 1.6;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* Header */
        header {
            background: var(--white);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .header-content {
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            color: var(--primary);
            letter-spacing: -0.5px;
        }

        .header-actions {
            display: flex;
            gap: 16px;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            font-size: 15px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--primary);
            color: var(--white);
        }

        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,102,255,0.3);
        }

        .btn-outline {
            border: 2px solid var(--border);
            color: var(--dark);
            background: transparent;
        }

        .btn-outline:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-success:hover {
            background: #38A169;
        }

        /* Hero */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: var(--white);
            padding: 100px 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30 0v60M0 30h60" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none"/></svg>');
            opacity: 0.3;
        }

        .hero-content {
            position: relative;
            z-index: 1;
        }

        .hero h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 24px;
            letter-spacing: -1px;
        }

        .hero p {
            font-size: 22px;
            opacity: 0.95;
            max-width: 700px;
            margin: 0 auto 40px;
        }

        .hero-stats {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin-top: 60px;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 42px;
            font-weight: 800;
            display: block;
            margin-bottom: 8px;
        }

        .stat-label {
            font-size: 16px;
            opacity: 0.9;
        }

        /* Services */
        .services-section {
            padding: 100px 24px;
            background: var(--light-gray);
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-title {
            font-size: 42px;
            font-weight: 800;
            color: var(--dark);
            margin-bottom: 16px;
        }

        .section-subtitle {
            font-size: 20px;
            color: var(--gray);
            max-width: 600px;
            margin: 0 auto;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 32px;
            max-width: 1280px;
            margin: 0 auto;
        }

        .service-card {
            background: var(--white);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
            transition: all 0.3s;
            border: 2px solid transparent;
        }

        .service-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.12);
            border-color: var(--primary);
        }

        .service-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            font-size: 28px;
            color: white;
            font-weight: 700;
        }

        .service-header {
            margin-bottom: 20px;
        }

        .service-name {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 8px;
        }

        .service-price {
            font-size: 32px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 4px;
        }

        .service-delivery {
            display: inline-block;
            background: var(--light-gray);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            color: var(--gray);
            font-weight: 600;
        }

        .service-description {
            color: var(--gray);
            margin-bottom: 24px;
            line-height: 1.7;
            font-size: 15px;
        }

        .service-features {
            list-style: none;
            margin-bottom: 32px;
        }

        .service-features li {
            padding: 12px 0;
            padding-left: 32px;
            position: relative;
            color: var(--dark);
            font-size: 15px;
            border-bottom: 1px solid var(--light-gray);
        }

        .service-features li:last-child {
            border-bottom: none;
        }

        .service-features li:before {
            content: "\\f00c";
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            left: 0;
            color: var(--success);
            font-size: 14px;
        }

        .service-actions {
            display: flex;
            gap: 12px;
        }

        .btn-block {
            width: 100%;
            justify-content: center;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.75);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: var(--white);
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }

        .modal-header {
            padding: 32px;
            border-bottom: 1px solid var(--border);
        }

        .modal-title {
            font-size: 28px;
            font-weight: 800;
            color: var(--dark);
        }

        .modal-body {
            padding: 32px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--dark);
        }

        .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(0,102,255,0.1);
        }

        .pix-container {
            text-align: center;
            padding: 40px;
        }

        .pix-qrcode {
            background: var(--white);
            padding: 24px;
            border-radius: 12px;
            border: 2px solid var(--border);
            margin: 24px 0;
            display: inline-block;
        }

        .pix-qrcode img {
            width: 280px;
            height: 280px;
        }

        .pix-code {
            background: var(--light-gray);
            padding: 16px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            word-break: break-all;
            margin: 16px 0;
        }

        .copy-btn {
            margin-top: 16px;
        }

        .status-pending {
            background: #FED7AA;
            color: #92400E;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .status-confirmed {
            background: #A7F3D0;
            color: #065F46;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        /* Footer */
        footer {
            background: var(--dark);
            color: var(--white);
            padding: 60px 24px 30px;
        }

        .footer-content {
            max-width: 1280px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }

        .footer-section h3 {
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .footer-links {
            list-style: none;
        }

        .footer-links li {
            margin-bottom: 12px;
        }

        .footer-links a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: var(--white);
        }

        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.6);
        }

        .loading {
            text-align: center;
            padding: 60px;
        }

        .spinner {
            border: 4px solid var(--light-gray);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
            }

            .hero p {
                font-size: 18px;
            }

            .hero-stats {
                flex-direction: column;
                gap: 30px;
            }

            .services-grid {
                grid-template-columns: 1fr;
            }

            .service-actions {
                flex-direction: column;
            }

            .section-title {
                font-size: 32px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">MALU</div>
            <div class="header-actions">
                <a href="#servicos" class="btn btn-outline">Serviços</a>
                <a href="#contato" class="btn btn-primary">Contato</a>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h1>Serviços Digitais Empresariais</h1>
            <p>Soluções profissionais para alavancar seu negócio digital. LLC EUA, TikTok Shop, Business Manager, Google Ads, Stripe e mais.</p>
            <a href="#servicos" class="btn btn-success btn-lg">Ver Serviços</a>

            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-value">500+</span>
                    <span class="stat-label">Clientes Atendidos</span>
                </div>
                <div class="stat">
                    <span class="stat-value">98%</span>
                    <span class="stat-label">Satisfação</span>
                </div>
                <div class="stat">
                    <span class="stat-value">24h</span>
                    <span class="stat-label">Suporte</span>
                </div>
            </div>
        </div>
    </section>

    <section class="services-section" id="servicos">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Nossos Serviços</h2>
                <p class="section-subtitle">Escolha o serviço ideal para impulsionar seu negócio digital</p>
            </div>

            <div id="services-container" class="loading">
                <div class="spinner"></div>
                <p>Carregando serviços...</p>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-content container">
            <div class="footer-section">
                <h3>Malu Digital Services</h3>
                <p>Serviços digitais profissionais para empresas que querem crescer no mercado digital.</p>
            </div>
            <div class="footer-section">
                <h3>Serviços</h3>
                <ul class="footer-links">
                    <li><a href="#llc">LLC EUA</a></li>
                    <li><a href="#tiktok">TikTok Shop</a></li>
                    <li><a href="#bm">Business Manager</a></li>
                    <li><a href="#ads">Google Ads</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Empresa</h3>
                <ul class="footer-links">
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#contato">Contato</a></li>
                    <li><a href="#termos">Termos de Uso</a></li>
                    <li><a href="#privacidade">Privacidade</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Suporte</h3>
                <ul class="footer-links">
                    <li><a href="#faq">FAQ</a></li>
                    <li><a href="#ajuda">Central de Ajuda</a></li>
                    <li><a href="#status">Status</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom container">
            <p>&copy; 2025 Malu Digital Services. Todos os direitos reservados.</p>
        </div>
    </footer>

    <!-- Modal Checkout -->
    <div id="checkout-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="modal-title">Finalizar Compra</h2>
            </div>
            <div class="modal-body" id="modal-body">
                <!-- Conteúdo dinâmico -->
            </div>
        </div>
    </div>

    <script>
        let currentService = null;

        // Icons map
        const serviceIcons = {
            'llc-usa': 'LLC',
            'tiktok-shop': 'TT',
            'bm-250': 'BM',
            'bm-unlimited': 'BMU',
            'google-ads': 'GA',
            'stripe': 'ST'
        };

        // Load services
        async function loadServices() {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();

                const container = document.getElementById('services-container');
                container.className = 'services-grid';
                container.innerHTML = '';

                data.services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.innerHTML = \`
                        <div class="service-icon">\${serviceIcons[service.id]}</div>
                        <div class="service-header">
                            <div class="service-name">\${service.name}</div>
                            <div class="service-price">R$ \${service.price.toFixed(2).replace('.', ',')}</div>
                            <div class="service-delivery"><i class="far fa-clock"></i> \${service.deliveryTime}</div>
                        </div>
                        <div class="service-description">\${service.description}</div>
                        <ul class="service-features">
                            \${service.features.map(f => \`<li>\${f}</li>\`).join('')}
                        </ul>
                        <div class="service-actions">
                            <button class="btn btn-primary btn-block" onclick="startCheckout('\${service.id}')">
                                <i class="fas fa-shopping-cart"></i> Comprar via PIX
                            </button>
                        </div>
                    \`;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error('Error loading services:', error);
                document.getElementById('services-container').innerHTML = '<div class="loading"><p>Erro ao carregar serviços.</p></div>';
            }
        }

        // Start checkout
        async function startCheckout(serviceId) {
            const response = await fetch('/api/services');
            const data = await response.json();
            currentService = data.services.find(s => s.id === serviceId);

            showCustomerForm();
        }

        // Show customer form
        function showCustomerForm() {
            const modal = document.getElementById('checkout-modal');
            const title = document.getElementById('modal-title');
            const body = document.getElementById('modal-body');

            title.textContent = \`Comprar: \${currentService.name}\`;
            body.innerHTML = \`
                <form id="customer-form">
                    <div class="form-group">
                        <label class="form-label">Nome Completo</label>
                        <input type="text" class="form-input" name="name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="tel" class="form-input" name="phone" placeholder="(11) 99999-9999" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">CPF/CNPJ</label>
                        <input type="text" class="form-input" name="cpf" placeholder="000.000.000-00" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-qrcode"></i> Gerar PIX
                    </button>
                    <button type="button" class="btn btn-outline btn-block" onclick="closeModal()" style="margin-top: 12px;">
                        Cancelar
                    </button>
                </form>
            \`;

            modal.classList.add('active');

            document.getElementById('customer-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const customer = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    cpf: formData.get('cpf')
                };

                await processPayment(customer);
            });
        }

        // Process payment
        async function processPayment(customer) {
            const body = document.getElementById('modal-body');
            body.innerHTML = '<div class="loading"><div class="spinner"></div><p>Gerando PIX...</p></div>';

            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: currentService.id,
                        customer
                    })
                });

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                showPixPayment(data);
            } catch (error) {
                body.innerHTML = \`<div class="loading"><p style="color: var(--error);">Erro: \${error.message}</p></div>\`;
            }
        }

        // Show PIX payment
        function showPixPayment(payment) {
            const body = document.getElementById('modal-body');
            body.innerHTML = \`
                <div class="pix-container">
                    <h3>Pagamento via PIX</h3>
                    <p style="color: var(--gray); margin-bottom: 24px;">Escaneie o QR Code ou copie o código PIX</p>

                    <div class="pix-qrcode">
                        <img src="\${payment.pixQrCode}" alt="QR Code PIX">
                    </div>

                    <div class="pix-code" id="pix-code">\${payment.pixCode}</div>

                    <button class="btn btn-primary copy-btn" onclick="copyPixCode()">
                        <i class="fas fa-copy"></i> Copiar Código PIX
                    </button>

                    <div style="margin-top: 32px;">
                        <div class="status-pending" id="payment-status">
                            <i class="fas fa-clock"></i> Aguardando pagamento...
                        </div>
                    </div>

                    <button class="btn btn-outline btn-block" onclick="closeModal()" style="margin-top: 24px;">
                        Fechar
                    </button>
                </div>
            \`;

            // Check payment status
            window.paymentCheckInterval = setInterval(() => checkPaymentStatus(payment.paymentId), 3000);
        }

        // Check payment status
        async function checkPaymentStatus(paymentId) {
            try {
                const response = await fetch(\`/api/payment/\${paymentId}/status\`);
                const data = await response.json();

                if (data.paid) {
                    clearInterval(window.paymentCheckInterval);
                    const statusEl = document.getElementById('payment-status');
                    if (statusEl) {
                        statusEl.className = 'status-confirmed';
                        statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Pagamento confirmado!';
                    }
                }
            } catch (error) {
                console.error('Error checking payment:', error);
            }
        }

        // Copy PIX code
        function copyPixCode() {
            const code = document.getElementById('pix-code').textContent;
            navigator.clipboard.writeText(code);
            alert('Código PIX copiado!');
        }

        // Close modal
        function closeModal() {
            if (window.paymentCheckInterval) {
                clearInterval(window.paymentCheckInterval);
            }
            document.getElementById('checkout-modal').classList.remove('active');
        }

        // Load on start
        loadServices();
    </script>
</body>
</html>`;
}
