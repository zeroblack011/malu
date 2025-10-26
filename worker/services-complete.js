/**
 * TODOS OS 19 SERVIÇOS - DADOS COMPLETOS
 */

export const ALL_SERVICES = {
  // ============== EMPRESARIAL ==============
  'llc-usa': {
    id: 'llc-usa', name: 'LLC EUA Completa', category: 'Empresarial', credits: 2997,
    description: 'Registro completo de LLC nos Estados Unidos incluindo EIN, conta bancária Mercury, operating agreement e documentação digital completa',
    deliveryTime: '15-30 dias úteis',
    icon: 'LLC',
    features: ['Registro oficial da LLC', 'EIN (Tax ID)', 'Conta Mercury', 'Endereço comercial EUA', 'Operating Agreement', 'Suporte 90 dias'],
    fields: [
      { name: 'ownerName', label: 'Nome completo do proprietário', type: 'text', required: true },
      { name: 'document', label: 'CPF ou Passaporte', type: 'text', required: true },
      { name: 'address', label: 'Endereço residencial completo', type: 'textarea', required: true },
      { name: 'phone', label: 'Telefone internacional', type: 'tel', required: true, placeholder: '+55 11 99999-9999' },
      { name: 'email', label: 'Email principal', type: 'email', required: true },
      { name: 'llcName', label: 'Nome desejado para a LLC', type: 'text', required: true },
      { name: 'state', label: 'Estado preferido', type: 'select', required: true, options: ['Delaware', 'Wyoming', 'Florida', 'Nevada', 'Texas'] },
      { name: 'businessActivity', label: 'Atividade principal do negócio', type: 'textarea', required: true },
      { name: 'idDocument', label: 'Documento de identidade', type: 'file', required: true },
      { name: 'proofAddress', label: 'Comprovante de residência', type: 'file', required: true },
      { name: 'members', label: 'Outros membros (se houver)', type: 'textarea', required: false },
      { name: 'businessAddress', label: 'Endereço comercial', type: 'textarea', required: false }
    ]
  },

  'bm-facebook': {
    id: 'bm-facebook', name: 'Business Manager Facebook', category: 'Empresarial', credits: 350,
    description: 'Criação e verificação de Business Manager Facebook com documentação completa',
    deliveryTime: '24-48 horas', icon: 'FB',
    features: ['BM verificado', 'Configuração completa', 'Páginas incluídas', 'Pixel configurado', 'Suporte 30 dias'],
    fields: [
      { name: 'companyName', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'cnpj', label: 'CNPJ ou documento equivalente', type: 'text', required: true },
      { name: 'responsibleName', label: 'Nome do responsável', type: 'text', required: true },
      { name: 'position', label: 'Cargo do responsável', type: 'text', required: true },
      { name: 'phone', label: 'Telefone comercial', type: 'tel', required: true },
      { name: 'email', label: 'Email corporativo', type: 'email', required: true },
      { name: 'website', label: 'Site da empresa', type: 'url', required: false },
      { name: 'sector', label: 'Setor de atuação', type: 'text', required: true },
      { name: 'revenue', label: 'Faturamento mensal aproximado', type: 'select', required: true, options: ['Até R$ 10k', 'R$ 10k - R$ 50k', 'R$ 50k - R$ 100k', 'R$ 100k+'] },
      { name: 'companyDoc', label: 'Documento da empresa', type: 'file', required: true },
      { name: 'responsibleDoc', label: 'Documento do responsável', type: 'file', required: true }
    ]
  },

  'bm-tiktok': {
    id: 'bm-tiktok', name: 'Business Manager TikTok', category: 'Empresarial', credits: 300,
    description: 'Criação e verificação de Business Manager TikTok',
    deliveryTime: '24-48 horas', icon: 'TT',
    features: ['BM TikTok verificado', 'Campanhas ativas', 'Pixel instalado', 'Suporte completo'],
    fields: [
      { name: 'companyName', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
      { name: 'responsibleName', label: 'Nome do representante', type: 'text', required: true },
      { name: 'position', label: 'Cargo', type: 'text', required: true },
      { name: 'phone', label: 'Telefone', type: 'tel', required: true },
      { name: 'email', label: 'Email corporativo', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url', required: false },
      { name: 'sector', label: 'Segmento', type: 'text', required: true },
      { name: 'revenue', label: 'Faturamento mensal', type: 'select', required: true, options: ['Até R$ 10k', 'R$ 10k - R$ 50k', 'R$ 50k+'] },
      { name: 'companyDoc', label: 'Documentos corporativos', type: 'file', required: true }
    ]
  },

  'bm-google': {
    id: 'bm-google', name: 'Business Manager Google', category: 'Empresarial', credits: 450,
    description: 'Criação e verificação de Business Manager Google Ads',
    deliveryTime: '24-72 horas', icon: 'GA',
    features: ['Google Ads Manager', 'Campanhas configuradas', 'Verificação completa', 'Suporte técnico'],
    fields: [
      { name: 'companyName', label: 'Razão social', type: 'text', required: true },
      { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
      { name: 'ownerName', label: 'Nome do proprietário', type: 'text', required: true },
      { name: 'position', label: 'Função', type: 'text', required: true },
      { name: 'phone', label: 'Telefone', type: 'tel', required: true },
      { name: 'email', label: 'Email institucional', type: 'email', required: true },
      { name: 'website', label: 'Domínio do site', type: 'url', required: true },
      { name: 'sector', label: 'Área de atuação', type: 'text', required: true },
      { name: 'companyDoc', label: 'Documentação legal', type: 'file', required: true }
    ]
  },

  // ============== ECOMMERCE ==============
  'tiktok-shop-br': {
    id: 'tiktok-shop-br', name: 'TikTok Shop Brasil', category: 'Ecommerce', credits: 497,
    description: 'Criação e verificação completa de conta TikTok Shop Brasil',
    deliveryTime: '24-48 horas', icon: 'TS',
    features: ['Conta verificada', 'Loja configurada', 'Tutorial completo', 'Suporte 30 dias'],
    fields: [
      { name: 'document', label: 'CPF ou CNPJ', type: 'text', required: true },
      { name: 'fullName', label: 'Nome completo', type: 'text', required: true },
      { name: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'address', label: 'Endereço completo', type: 'textarea', required: true },
      { name: 'phone', label: 'Telefone', type: 'tel', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'storeName', label: 'Nome da loja', type: 'text', required: true },
      { name: 'categories', label: 'Categorias', type: 'multiselect', required: true, options: ['Moda', 'Eletrônicos', 'Casa', 'Beleza', 'Esportes', 'Infantil'] },
      { name: 'storeDesc', label: 'Descrição da loja', type: 'textarea', required: true },
      { name: 'idDoc', label: 'Documento de identidade', type: 'file', required: true },
      { name: 'addressProof', label: 'Comprovante de endereço', type: 'file', required: true }
    ]
  },

  'tiktok-shop-us': {
    id: 'tiktok-shop-us', name: 'TikTok Shop USA', category: 'Ecommerce', credits: 997,
    description: 'Criação de conta TikTok Shop Estados Unidos',
    deliveryTime: '48-72 horas', icon: 'TSU',
    features: ['Conta US verificada', 'Configuração internacional', 'Suporte em inglês'],
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'birthDate', label: 'Birth date', type: 'date', required: true },
      { name: 'usAddress', label: 'US Address', type: 'textarea', required: true },
      { name: 'usPhone', label: 'US Phone', type: 'tel', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'storeName', label: 'Store name', type: 'text', required: true },
      { name: 'categories', label: 'Categories', type: 'multiselect', required: true, options: ['Fashion', 'Electronics', 'Home', 'Beauty', 'Sports'] },
      { name: 'passport', label: 'Passport', type: 'file', required: true },
      { name: 'addressProof', label: 'Address proof', type: 'file', required: true }
    ]
  },

  'tiktok-shop-uk': {
    id: 'tiktok-shop-uk', name: 'TikTok Shop UK', category: 'Ecommerce', credits: 997,
    description: 'Criação de conta TikTok Shop Reino Unido',
    deliveryTime: '48-72 horas', icon: 'TSK',
    features: ['Conta UK verificada', 'Mercado europeu', 'GDPR compliance'],
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'birthDate', label: 'Date of birth', type: 'date', required: true },
      { name: 'ukAddress', label: 'UK Address', type: 'textarea', required: true },
      { name: 'ukPhone', label: 'UK Phone', type: 'tel', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'storeName', label: 'Store name', type: 'text', required: true },
      { name: 'passport', label: 'Passport', type: 'file', required: true },
      { name: 'addressProof', label: 'Address proof', type: 'file', required: true }
    ]
  },

  'ecommerce-site': {
    id: 'ecommerce-site', name: 'Site Ecommerce Completo', category: 'Ecommerce', credits: 1997,
    description: 'Desenvolvimento de site ecommerce pronto com 20 produtos',
    deliveryTime: '5-7 dias úteis', icon: 'EC',
    features: ['Design mobile-first', '20 produtos incluídos', 'Pagamentos integrados', 'Painel admin', 'SEO otimizado'],
    fields: [
      { name: 'companyName', label: 'Nome da empresa', type: 'text', required: true },
      { name: 'primaryColor', label: 'Cor primária', type: 'color', required: true },
      { name: 'secondaryColor', label: 'Cor secundária', type: 'color', required: true },
      { name: 'logo', label: 'Logotipo', type: 'file', required: true },
      { name: 'products', label: 'Lista de produtos (20)', type: 'textarea', required: true, placeholder: 'Nome, descrição, preço de cada produto' },
      { name: 'description', label: 'Descrição do negócio', type: 'textarea', required: true },
      { name: 'targetAudience', label: 'Público-alvo', type: 'text', required: true },
      { name: 'paymentMethods', label: 'Métodos de pagamento', type: 'multiselect', required: true, options: ['PIX', 'Cartão', 'Boleto'] },
      { name: 'shippingInfo', label: 'Informações de entrega', type: 'textarea', required: true }
    ]
  },

  // ============== INFRAESTRUTURA ==============
  'proxy-br': {
    id: 'proxy-br', name: 'Proxy Brasil', category: 'Infraestrutura', credits: 37, recurring: 'mensal',
    description: 'Proxy dedicado no Brasil',
    deliveryTime: '12-24 horas', icon: 'PB',
    features: ['IPs brasileiros', 'Alta velocidade', 'Uptime 99.9%', 'Suporte técnico'],
    fields: [
      { name: 'region', label: 'Estado', type: 'select', required: true, options: ['SP', 'RJ', 'MG', 'PR', 'RS'] },
      { name: 'proxyType', label: 'Tipo', type: 'select', required: true, options: ['Residencial', 'Datacenter'] },
      { name: 'ipQty', label: 'Quantidade de IPs', type: 'number', required: true, min: 1, max: 100 },
      { name: 'protocol', label: 'Protocolo', type: 'select', required: true, options: ['HTTP', 'HTTPS', 'SOCKS5'] },
      { name: 'usage', label: 'Aplicação', type: 'text', required: true },
      { name: 'speed', label: 'Velocidade', type: 'select', required: true, options: ['Baixa', 'Média', 'Alta'] }
    ]
  },

  'proxy-us': {
    id: 'proxy-us', name: 'Proxy USA', category: 'Infraestrutura', credits: 65, recurring: 'mensal',
    description: 'Proxy dedicado nos Estados Unidos',
    deliveryTime: '12-24 horas', icon: 'PU',
    features: ['IPs americanos', 'Múltiplas localizações', 'Alta performance'],
    fields: [
      { name: 'region', label: 'State', type: 'select', required: true, options: ['NY', 'CA', 'FL', 'TX', 'IL'] },
      { name: 'proxyType', label: 'Type', type: 'select', required: true, options: ['Residential', 'Datacenter'] },
      { name: 'ipQty', label: 'Number of IPs', type: 'number', required: true, min: 1 },
      { name: 'protocol', label: 'Protocol', type: 'select', required: true, options: ['HTTP', 'HTTPS', 'SOCKS5'] },
      { name: 'usage', label: 'Application', type: 'text', required: true }
    ]
  },

  'proxy-latam': {
    id: 'proxy-latam', name: 'Proxy LATAM', category: 'Infraestrutura', credits: 57, recurring: 'mensal',
    description: 'Proxy América Latina',
    deliveryTime: '12-24 horas', icon: 'PL',
    features: ['IPs LATAM', 'Múltiplos países', 'Configuração flexível'],
    fields: [
      { name: 'country', label: 'País', type: 'select', required: true, options: ['México', 'Argentina', 'Chile', 'Colômbia'] },
      { name: 'proxyType', label: 'Tipo', type: 'select', required: true, options: ['Residencial', 'Datacenter'] },
      { name: 'ipQty', label: 'Qtd IPs', type: 'number', required: true, min: 1 },
      { name: 'protocol', label: 'Protocolo', type: 'select', required: true, options: ['HTTP', 'HTTPS', 'SOCKS5'] }
    ]
  },

  'proxy-eu': {
    id: 'proxy-eu', name: 'Proxy Europa', category: 'Infraestrutura', credits: 77, recurring: 'mensal',
    description: 'Proxy Europa',
    deliveryTime: '12-24 horas', icon: 'PE',
    features: ['IPs europeus', 'GDPR compliant', 'Múltiplas cidades'],
    fields: [
      { name: 'country', label: 'País', type: 'select', required: true, options: ['UK', 'Alemanha', 'França', 'Holanda'] },
      { name: 'proxyType', label: 'Type', type: 'select', required: true, options: ['Residential', 'Datacenter'] },
      { name: 'ipQty', label: 'IPs', type: 'number', required: true, min: 1 }
    ]
  },

  // ============== MARKETING ==============
  'dropshipping': {
    id: 'dropshipping', name: 'Fabricante Dropshipping', category: 'Marketing', credits: 97,
    description: 'Acesso a fabricante para produtos white-label',
    deliveryTime: '3-5 dias úteis', icon: 'DS',
    features: ['Marca própria', 'Qualidade garantida', 'Produção sob demanda', 'Amostras grátis'],
    fields: [
      { name: 'brandName', label: 'Nome da marca', type: 'text', required: true },
      { name: 'logo', label: 'Logotipo', type: 'file', required: true },
      { name: 'primaryColor', label: 'Cor primária', type: 'color', required: true },
      { name: 'niche', label: 'Nicho', type: 'multiselect', required: true, options: ['Moda', 'Fitness', 'Casa', 'Tech', 'Beleza'] },
      { name: 'monthlyQty', label: 'Qtd mensal', type: 'select', required: true, options: ['50', '100', '200', '500', '1000+'] },
      { name: 'targetAudience', label: 'Público-alvo', type: 'text', required: true },
      { name: 'countries', label: 'Países de entrega', type: 'multiselect', required: true, options: ['Brasil', 'EUA', 'Europa', 'Ásia'] }
    ]
  },

  'ai-ads': {
    id: 'ai-ads', name: 'IA Anúncios', category: 'Marketing', credits: 147, recurring: 'mensal',
    description: 'Sistema de criação automática de anúncios com IA',
    deliveryTime: '24 horas', icon: 'AI',
    features: ['Criação automática', 'Otimização contínua', 'Multi-plataforma', 'Relatórios detalhados'],
    fields: [
      { name: 'product', label: 'Produto/Serviço', type: 'text', required: true },
      { name: 'productDesc', label: 'Descrição detalhada', type: 'textarea', required: true },
      { name: 'targetAge', label: 'Idade do público', type: 'text', required: true },
      { name: 'targetGender', label: 'Gênero', type: 'select', required: true, options: ['Masculino', 'Feminino', 'Todos'] },
      { name: 'budget', label: 'Orçamento diário', type: 'number', required: true },
      { name: 'platforms', label: 'Plataformas', type: 'multiselect', required: true, options: ['Meta', 'TikTok', 'Google'] },
      { name: 'goal', label: 'Objetivo', type: 'select', required: true, options: ['Vendas', 'Leads', 'Tráfego', 'Brand Awareness'] },
      { name: 'tone', label: 'Tom de voz', type: 'select', required: true, options: ['Formal', 'Casual', 'Divertido', 'Urgente'] }
    ]
  },

  // ============== DESENVOLVIMENTO ==============
  'custom-app': {
    id: 'custom-app', name: 'App Personalizado', category: 'Desenvolvimento', credits: 4997,
    description: 'Desenvolvimento de aplicativo mobile completo iOS/Android',
    deliveryTime: '30-60 dias', icon: 'AP',
    features: ['iOS e Android', 'Painel admin', 'Integrações', 'Manutenção inclusa', 'Publicação nas lojas'],
    fields: [
      { name: 'appName', label: 'Nome do app', type: 'text', required: true },
      { name: 'description', label: 'Descrição completa', type: 'textarea', required: true },
      { name: 'features', label: 'Funcionalidades principais', type: 'textarea', required: true },
      { name: 'targetAudience', label: 'Público-alvo', type: 'text', required: true },
      { name: 'primaryColor', label: 'Cor primária', type: 'color', required: true },
      { name: 'logo', label: 'Logotipo', type: 'file', required: true },
      { name: 'platforms', label: 'Plataformas', type: 'multiselect', required: true, options: ['iOS', 'Android', 'Ambos'] },
      { name: 'integrations', label: 'Integrações necessárias', type: 'textarea', required: false },
      { name: 'specialFeatures', label: 'Recursos especiais', type: 'textarea', required: false }
    ]
  },

  // ============== CONSULTORIA ==============
  'legal-consulting': {
    id: 'legal-consulting', name: 'Consultoria Jurídica', category: 'Consultoria', credits: 180,
    description: 'Consultoria jurídica especializada em negócios internacionais',
    deliveryTime: '48 horas', icon: 'CJ',
    features: ['Especialistas internacionais', 'Compliance completo', 'Documentação inclusa', 'Suporte continuado'],
    fields: [
      { name: 'consultType', label: 'Tipo de consultoria', type: 'select', required: true, options: ['LLC', 'Tributação', 'Contratos', 'Compliance', 'Outros'] },
      { name: 'countries', label: 'Países envolvidos', type: 'multiselect', required: true, options: ['Brasil', 'EUA', 'UK', 'Europa', 'Ásia'] },
      { name: 'caseDesc', label: 'Descrição do caso', type: 'textarea', required: true },
      { name: 'revenue', label: 'Faturamento aproximado', type: 'select', required: true, options: ['Até R$ 50k', 'R$ 50k - R$ 200k', 'R$ 200k+'] },
      { name: 'structure', label: 'Estrutura atual', type: 'select', required: true, options: ['MEI', 'LTDA', 'SA', 'LLC', 'Outros'] },
      { name: 'questions', label: 'Dúvidas específicas', type: 'textarea', required: true },
      { name: 'documents', label: 'Documentação existente', type: 'file', required: false }
    ]
  },

  // ============== SUPORTE ==============
  'support-basic': {
    id: 'support-basic', name: 'Suporte Básico', category: 'Suporte', credits: 97, recurring: 'mensal',
    description: 'Suporte por email com resposta em até 2 horas',
    deliveryTime: 'Imediato', icon: 'SB',
    features: ['Email', 'Resposta em 2h', 'Horário comercial', 'Tickets ilimitados'],
    fields: [
      { name: 'email', label: 'Email para suporte', type: 'email', required: true },
      { name: 'phone', label: 'Telefone', type: 'tel', required: false },
      { name: 'businessArea', label: 'Área de atuação', type: 'text', required: true },
      { name: 'needs', label: 'Necessidades principais', type: 'textarea', required: true }
    ]
  },

  'support-premium': {
    id: 'support-premium', name: 'Suporte Premium', category: 'Suporte', credits: 197, recurring: 'mensal',
    description: 'Suporte WhatsApp + Email com resposta em 15 minutos',
    deliveryTime: 'Imediato', icon: 'SP',
    features: ['WhatsApp', 'Email', 'Resposta em 15min', '24/7', 'Prioridade'],
    fields: [
      { name: 'email', label: 'Email principal', type: 'email', required: true },
      { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true },
      { name: 'contactName', label: 'Nome do contato', type: 'text', required: true },
      { name: 'businessArea', label: 'Ramo de atividade', type: 'text', required: true },
      { name: 'needs', label: 'Necessidades específicas', type: 'textarea', required: true }
    ]
  },

  'support-enterprise': {
    id: 'support-enterprise', name: 'Suporte Enterprise', category: 'Suporte', credits: 497, recurring: 'mensal',
    description: 'Suporte prioritário completo com videochamadas',
    deliveryTime: 'Imediato', icon: 'SE',
    features: ['WhatsApp', 'Email', 'Videochamadas', 'Resposta imediata', 'Gerente dedicado', '24/7'],
    fields: [
      { name: 'email', label: 'Email corporativo', type: 'email', required: true },
      { name: 'whatsapp', label: 'WhatsApp prioritário', type: 'tel', required: true },
      { name: 'managerName', label: 'Gerente de conta', type: 'text', required: true },
      { name: 'position', label: 'Cargo', type: 'text', required: true },
      { name: 'businessArea', label: 'Segmento', type: 'text', required: true },
      { name: 'criticalNeeds', label: 'Demandas críticas', type: 'textarea', required: true },
      { name: 'preferredHours', label: 'Horários preferidos', type: 'text', required: false }
    ]
  }
};

export const CREDIT_PACKAGES = {
  'starter': { id: 'starter', name: 'Starter', credits: 600, price: 497.00, popular: false,
    description: 'Ideal para começar', features: ['600 créditos', 'Todos os serviços', 'Suporte por email', 'Validade 6 meses'] },
  'business': { id: 'business', name: 'Business', credits: 1400, price: 997.00, popular: true,
    description: 'Para negócios em crescimento', features: ['1.400 créditos', 'Todos os serviços', 'Suporte prioritário', 'Validade 12 meses', '15% de economia'] },
  'premium': { id: 'premium', name: 'Premium', credits: 5000, price: 2997.00, popular: false,
    description: 'Máximo valor', features: ['5.000 créditos', 'Todos os serviços', 'Suporte dedicado', 'Validade 24 meses', '30% de economia'] },
  'empire': { id: 'empire', name: 'Empire', credits: 10000, price: 4997.00, popular: false,
    description: 'Solução enterprise', features: ['10.000 créditos', 'Todos os serviços', 'Gerente de conta', 'Validade ilimitada', '45% de economia', 'Acesso VIP'] }
};
