// Application Configuration
const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: '/api',
        TIMEOUT: 30000,
    },

    // Asaas API Configuration
    ASAAS: {
        API_KEY: '', // Will be set in backend
        ENVIRONMENT: 'production', // 'sandbox' or 'production'
        BASE_URL: 'https://www.asaas.com/api/v3',
    },

    // Credit Packages
    CREDIT_PACKAGES: [
        {
            id: 'starter',
            name: 'Pacote Starter',
            credits: 600,
            price: 497.00,
            priceFormatted: 'R$ 497,00',
            popular: false,
            benefits: [
                'Acesso a todos os serviços',
                'Suporte prioritário',
                'Créditos nunca expiram'
            ]
        },
        {
            id: 'business',
            name: 'Pacote Business',
            credits: 1400,
            price: 997.00,
            priceFormatted: 'R$ 997,00',
            popular: true,
            benefits: [
                'Acesso a todos os serviços',
                'Suporte prioritário',
                'Créditos nunca expiram',
                '40% mais créditos'
            ]
        },
        {
            id: 'premium',
            name: 'Pacote Premium',
            credits: 5000,
            price: 2997.00,
            priceFormatted: 'R$ 2.997,00',
            popular: false,
            benefits: [
                'Acesso a todos os serviços',
                'Suporte VIP 24/7',
                'Créditos nunca expiram',
                'Gerente de conta dedicado',
                '67% mais créditos'
            ]
        },
        {
            id: 'empire',
            name: 'Pacote Empire',
            credits: 10000,
            price: 4997.00,
            priceFormatted: 'R$ 4.997,00',
            popular: false,
            benefits: [
                'Acesso a todos os serviços',
                'Suporte VIP 24/7',
                'Créditos nunca expiram',
                'Gerente de conta dedicado',
                'Consultoria estratégica',
                '100% mais créditos'
            ]
        }
    ],

    // Services Catalog
    SERVICES: [
        {
            id: 'llc-usa',
            name: 'LLC EUA Completa',
            description: 'Abertura completa de LLC nos Estados Unidos com EIN, conta bancária e endereço fiscal',
            icon: '🏢',
            credits: 2997,
            category: 'business',
            deliveryTime: '15-20 dias úteis',
            popular: true,
            benefits: [
                'Registro da LLC no estado escolhido',
                'EIN (Tax ID) federal',
                'Endereço fiscal nos EUA',
                'Documentação completa',
                'Suporte pós-abertura'
            ]
        },
        {
            id: 'tiktok-shop-br',
            name: 'TikTok Shop BR',
            description: 'Abertura e configuração completa da TikTok Shop Brasil',
            icon: '🎵',
            credits: 497,
            category: 'ecommerce',
            deliveryTime: '5-7 dias úteis',
            popular: true,
            benefits: [
                'Conta TikTok Shop ativa',
                'Verificação completa',
                'Configuração de pagamentos',
                'Tutorial de uso'
            ]
        },
        {
            id: 'tiktok-shop-us',
            name: 'TikTok Shop US',
            description: 'Abertura e configuração da TikTok Shop Estados Unidos',
            icon: '🎵',
            credits: 997,
            category: 'ecommerce',
            deliveryTime: '7-10 dias úteis',
            popular: false,
            benefits: [
                'Conta TikTok Shop US ativa',
                'Verificação completa',
                'Configuração de pagamentos',
                'Suporte em português'
            ]
        },
        {
            id: 'tiktok-shop-uk',
            name: 'TikTok Shop UK',
            description: 'Abertura e configuração da TikTok Shop Reino Unido',
            icon: '🎵',
            credits: 997,
            category: 'ecommerce',
            deliveryTime: '7-10 dias úteis',
            popular: false,
            benefits: [
                'Conta TikTok Shop UK ativa',
                'Verificação completa',
                'Configuração de pagamentos',
                'Suporte em português'
            ]
        },
        {
            id: 'proxy-br',
            name: 'Proxy Brasil',
            description: 'Proxy residencial brasileiro de alta performance',
            icon: '🌐',
            credits: 37,
            category: 'infrastructure',
            deliveryTime: 'Imediato',
            recurring: 'monthly',
            popular: false,
            benefits: [
                'IP brasileiro',
                'Alta velocidade',
                'Uptime 99.9%',
                'Suporte técnico'
            ]
        },
        {
            id: 'proxy-us',
            name: 'Proxy USA',
            description: 'Proxy residencial americano de alta performance',
            icon: '🌐',
            credits: 65,
            category: 'infrastructure',
            deliveryTime: 'Imediato',
            recurring: 'monthly',
            popular: false,
            benefits: [
                'IP americano',
                'Alta velocidade',
                'Uptime 99.9%',
                'Suporte técnico'
            ]
        },
        {
            id: 'dropshipping-supplier',
            name: 'Fabricante Dropshipping',
            description: 'Conexão com fabricantes confiáveis para dropshipping',
            icon: '📦',
            credits: 97,
            category: 'ecommerce',
            deliveryTime: '3-5 dias úteis',
            popular: false,
            benefits: [
                'Catálogo de produtos',
                'Preços de fábrica',
                'Envio direto',
                'Amostras grátis'
            ]
        },
        {
            id: 'ai-ads',
            name: 'IA Anúncios',
            description: 'Criação de anúncios com inteligência artificial',
            icon: '🤖',
            credits: 147,
            category: 'marketing',
            deliveryTime: 'Imediato',
            recurring: 'monthly',
            popular: true,
            benefits: [
                'Anúncios otimizados',
                'Múltiplas variações',
                'A/B testing',
                'Relatórios mensais'
            ]
        },
        {
            id: 'custom-app',
            name: 'App Personalizado',
            description: 'Desenvolvimento de aplicativo mobile personalizado',
            icon: '📱',
            credits: 4997,
            category: 'development',
            deliveryTime: '30-45 dias úteis',
            popular: false,
            benefits: [
                'App iOS e Android',
                'Design personalizado',
                'Backend completo',
                '6 meses de suporte',
                'Publicação nas stores'
            ]
        },
        {
            id: 'bm-facebook',
            name: 'Business Manager Facebook',
            description: 'Criação e configuração de Business Manager Facebook',
            icon: '👥',
            credits: 350,
            category: 'marketing',
            deliveryTime: '2-3 dias úteis',
            popular: true,
            benefits: [
                'BM verificado',
                'Pixel configurado',
                'Catálogo de produtos',
                'Tutorial completo'
            ]
        },
        {
            id: 'bm-tiktok',
            name: 'Business Manager TikTok',
            description: 'Criação e configuração de TikTok Ads Manager',
            icon: '🎯',
            credits: 300,
            category: 'marketing',
            deliveryTime: '2-3 dias úteis',
            popular: false,
            benefits: [
                'Ads Manager ativo',
                'Pixel configurado',
                'Primeiras campanhas',
                'Suporte técnico'
            ]
        },
        {
            id: 'bm-google',
            name: 'Business Manager Google',
            description: 'Configuração completa de Google Ads e Analytics',
            icon: '🔍',
            credits: 450,
            category: 'marketing',
            deliveryTime: '2-3 dias úteis',
            popular: false,
            benefits: [
                'Google Ads configurado',
                'Google Analytics 4',
                'Tag Manager',
                'Conversões rastreadas'
            ]
        },
        {
            id: 'ecommerce-site',
            name: 'Site Ecommerce',
            description: 'Loja virtual completa pronta para vender',
            icon: '🛒',
            credits: 1997,
            category: 'ecommerce',
            deliveryTime: '10-15 dias úteis',
            popular: true,
            benefits: [
                'Design profissional',
                'Pagamentos integrados',
                'Gestão de produtos',
                'Otimizado para mobile',
                'SEO básico incluído'
            ]
        },
        {
            id: 'legal-consulting',
            name: 'Consultoria Jurídica',
            description: 'Consulta com advogado especializado em negócios digitais',
            icon: '⚖️',
            credits: 180,
            category: 'consulting',
            deliveryTime: '1-2 dias úteis',
            popular: false,
            benefits: [
                '1 hora de consultoria',
                'Advogado especializado',
                'Relatório escrito',
                'Follow-up de 30 dias'
            ]
        }
    ],

    // Service Categories
    CATEGORIES: [
        { id: 'all', name: 'Todos', icon: '🌟' },
        { id: 'business', name: 'Empresarial', icon: '🏢' },
        { id: 'ecommerce', name: 'Ecommerce', icon: '🛒' },
        { id: 'marketing', name: 'Marketing', icon: '📊' },
        { id: 'infrastructure', name: 'Infraestrutura', icon: '🌐' },
        { id: 'development', name: 'Desenvolvimento', icon: '💻' },
        { id: 'consulting', name: 'Consultoria', icon: '💼' }
    ],

    // Order Status
    ORDER_STATUS: {
        PENDING: { label: 'Aguardando Processamento', color: 'warning', icon: '⏳' },
        PROCESSING: { label: 'Em Processamento', color: 'info', icon: '⚙️' },
        AWAITING_INFO: { label: 'Aguardando Informações', color: 'warning', icon: '❓' },
        COMPLETED: { label: 'Concluído', color: 'success', icon: '✅' },
        CANCELLED: { label: 'Cancelado', color: 'error', icon: '❌' }
    },

    // Payment Methods
    PAYMENT_METHODS: {
        PIX: 'PIX',
        CREDIT_CARD: 'Cartão de Crédito'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'malu_auth_token',
        USER_DATA: 'malu_user_data',
        CART: 'malu_cart'
    }
};

// Freeze configuration to prevent modifications
Object.freeze(CONFIG);
