/**
 * VERSÃO SIMPLIFICADA - SEM LOGIN
 * Catálogo direto com botões de WhatsApp
 */

export function getIndexHTML() {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Malu Digital Services - Serviços Digitais Profissionais</title>
    <meta name="description" content="LLC EUA, TikTok Shop, Business Manager, Google Ads, Stripe - Serviços digitais de alta qualidade">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #10b981;
            --dark: #1f2937;
            --light: #f9fafb;
            --border: #e5e7eb;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--light);
            color: var(--dark);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header */
        header {
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
        }

        .whatsapp-btn {
            background: #25D366;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Hero */
        .hero {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 60px 20px;
            text-align: center;
        }

        .hero h1 {
            font-size: 42px;
            margin-bottom: 20px;
        }

        .hero p {
            font-size: 20px;
            opacity: 0.9;
        }

        /* Services Grid */
        .services {
            padding: 60px 20px;
        }

        .services h2 {
            text-align: center;
            font-size: 36px;
            margin-bottom: 40px;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .service-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
        }

        .service-name {
            font-size: 22px;
            font-weight: 700;
            color: var(--dark);
        }

        .service-price {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
            white-space: nowrap;
        }

        .service-description {
            color: #6b7280;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .service-features {
            list-style: none;
            margin-bottom: 20px;
        }

        .service-features li {
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
            color: #4b5563;
        }

        .service-features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--secondary);
            font-weight: 700;
        }

        .delivery-time {
            background: #f3f4f6;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 20px;
            display: inline-block;
        }

        .order-btn {
            width: 100%;
            background: #25D366;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .order-btn:hover {
            background: #20BA5A;
        }

        /* Footer */
        footer {
            background: var(--dark);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        .footer-links a:hover {
            opacity: 1;
        }

        /* Loading */
        .loading {
            text-align: center;
            padding: 60px 20px;
        }

        .spinner {
            border: 4px solid #f3f4f6;
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 32px;
            }

            .services-grid {
                grid-template-columns: 1fr;
            }

            .service-header {
                flex-direction: column;
                gap: 10px;
            }

            .footer-links {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="header-content">
            <div class="logo">MALU</div>
            <a href="https://wa.me/5511999999999" class="whatsapp-btn">
                <span>💬</span>
                WhatsApp
            </a>
        </div>
    </header>

    <!-- Hero -->
    <section class="hero">
        <div class="container">
            <h1>Serviços Digitais Profissionais</h1>
            <p>LLC EUA, TikTok Shop, Business Manager, Google Ads e mais</p>
        </div>
    </section>

    <!-- Services -->
    <section class="services">
        <div class="container">
            <h2>Nossos Serviços</h2>
            <div id="services-container" class="loading">
                <div class="spinner"></div>
                <p>Carregando serviços...</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-links">
                <a href="#servicos">Serviços</a>
                <a href="https://wa.me/5511999999999">Contato</a>
                <a href="#politica">Política de Privacidade</a>
                <a href="#termos">Termos de Uso</a>
            </div>
            <p>© 2025 Malu Digital Services. Todos os direitos reservados.</p>
        </div>
    </footer>

    <script>
        // Load services from API
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
                        <div class="service-header">
                            <div class="service-name">\${service.name}</div>
                            <div class="service-price">\${service.price}</div>
                        </div>
                        <div class="service-description">\${service.description}</div>
                        <div class="delivery-time">⏱️ Entrega: \${service.deliveryTime}</div>
                        <ul class="service-features">
                            \${service.features.map(f => \`<li>\${f}</li>\`).join('')}
                        </ul>
                        <button class="order-btn" onclick="openWhatsApp('\${service.whatsappMessage}')">
                            <span>💬</span>
                            Comprar via WhatsApp
                        </button>
                    \`;
                    container.appendChild(card);
                });
            } catch (error) {
                document.getElementById('services-container').innerHTML = \`
                    <div class="loading">
                        <p>Erro ao carregar serviços. Tente novamente.</p>
                    </div>
                \`;
            }
        }

        // Open WhatsApp with pre-filled message
        function openWhatsApp(message) {
            const whatsappNumber = '5511999999999'; // COLOQUE SEU NÚMERO AQUI
            const url = \`https://wa.me/\${whatsappNumber}?text=\${encodeURIComponent(message)}\`;
            window.open(url, '_blank');
        }

        // Load services on page load
        loadServices();
    </script>
</body>
</html>`;
}
