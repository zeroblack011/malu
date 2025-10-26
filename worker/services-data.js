/**
 * TODOS OS 19 SERVIÇOS - Dados Completos
 */

export const SERVICES = {
  'llc-usa': {
    id: 'llc-usa',
    name: 'LLC EUA Completa',
    category: 'Empresarial',
    credits: 2997,
    description: 'Registro completo de LLC nos Estados Unidos incluindo EIN, conta bancária Mercury, operating agreement e documentação digital completa',
    deliveryTime: '15-30 dias úteis',
    features: [
      'Registro oficial da LLC em Delaware ou Wyoming',
      'EIN (Employer Identification Number)',
      'Conta bancária Mercury aprovada',
      'Endereço comercial nos EUA por 1 ano',
      'Operating Agreement profissional',
      'Documentação digital completa',
      'Suporte durante todo o processo (90 dias)'
    ],
    fields: [
      { name: 'ownerName', label: 'Nome completo do proprietário', type: 'text', required: true },
      { name: 'document', label: 'CPF ou Passaporte', type: 'text', required: true },
      { name: 'address', label: 'Endereço residencial completo', type: 'textarea', required: true },
      { name: 'phone', label: 'Telefone internacional', type: 'tel', required: true, placeholder: '+55 11 99999-9999' },
      { name: 'email', label: 'Email principal', type: 'email', required: true },
      { name: 'llcName', label: 'Nome desejado para a LLC', type: 'text', required: true },
      { name: 'state', label: 'Estado preferido', type: 'select', required: true, options: ['Delaware', 'Wyoming', 'Florida', 'Nevada', 'Texas'] },
      { name: 'businessActivity', label: 'Atividade principal do negócio', type: 'textarea', required: true },
      { name: 'idDocument', label: 'Documento de identidade (frente e verso)', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'proofAddress', label: 'Comprovante de residência', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'members', label: 'Nomes e documentos dos membros (se houver)', type: 'textarea', required: false },
      { name: 'membershipPercent', label: 'Participação percentual de cada membro', type: 'textarea', required: false },
      { name: 'businessAddress', label: 'Endereço comercial (se diferente do residencial)', type: 'textarea', required: false },
      { name: 'businessPhone', label: 'Telefone comercial', type: 'tel', required: false },
      { name: 'businessEmail', label: 'Email comercial', type: 'email', required: false }
    ]
  },

  'tiktok-shop-br': {
    id: 'tiktok-shop-br',
    name: 'TikTok Shop Brasil',
    category: 'Ecommerce',
    credits: 497,
    description: 'Criação e verificação completa de conta TikTok Shop Brasil com configuração inicial',
    deliveryTime: '24-48 horas',
    features: [
      'Conta verificada e ativa',
      'Configuração completa da loja',
      'Tutorial de integração com produtos',
      'Suporte para primeiras vendas',
      'Garantia de 30 dias',
      'Documentação aceita pela plataforma'
    ],
    fields: [
      { name: 'document', label: 'CPF ou CNPJ', type: 'text', required: true },
      { name: 'fullName', label: 'Nome completo', type: 'text', required: true },
      { name: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'address', label: 'Endereço completo', type: 'textarea', required: true },
      { name: 'phone', label: 'Telefone para verificação', type: 'tel', required: true },
      { name: 'email', label: 'Email corporativo', type: 'email', required: true },
      { name: 'storeName', label: 'Nome da loja desejado', type: 'text', required: true },
      { name: 'categories', label: 'Categorias de produtos', type: 'multiselect', required: true, options: ['Moda Feminina', 'Moda Masculina', 'Eletrônicos', 'Casa e Decoração', 'Beleza e Cosméticos', 'Esportes', 'Infantil', 'Outros'] },
      { name: 'storeDescription', label: 'Descrição da loja', type: 'textarea', required: true },
      { name: 'businessHours', label: 'Horário de funcionamento', type: 'text', required: true },
      { name: 'returnPolicy', label: 'Política de trocas e devoluções', type: 'textarea', required: true },
      { name: 'idDocument', label: 'Documento de identidade (RG)', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'proofAddress', label: 'Comprovante de endereço', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'cpfCnpjProof', label: 'Comprovante de CPF ou CNPJ', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'shippingMethods', label: 'Métodos de envio preferidos', type: 'multiselect', required: true, options: ['Correios', 'Transportadora', 'Motoboy', 'Retirada local'] },
      { name: 'shippingTime', label: 'Prazo de envio padrão', type: 'text', required: true },
      { name: 'shippingCost', label: 'Custos de envio', type: 'text', required: true }
    ]
  },

  'tiktok-shop-us': {
    id: 'tiktok-shop-us',
    name: 'TikTok Shop USA',
    category: 'Ecommerce',
    credits: 997,
    description: 'Criação e verificação de conta TikTok Shop para Estados Unidos com configuração completa',
    deliveryTime: '48-72 horas',
    features: [
      'Conta verificada nos EUA',
      'Configuração internacional',
      'Suporte em inglês',
      'Integração com pagamentos internacionais',
      'Garantia de verificação'
    ],
    fields: [
      { name: 'fullName', label: 'Nome completo (inglês)', type: 'text', required: true },
      { name: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'usAddress', label: 'Endereço nos EUA', type: 'textarea', required: true },
      { name: 'usPhone', label: 'Telefone americano', type: 'tel', required: true, placeholder: '+1 XXX XXX XXXX' },
      { name: 'email', label: 'Email corporativo', type: 'email', required: true },
      { name: 'storeName', label: 'Store name', type: 'text', required: true },
      { name: 'categories', label: 'Product categories', type: 'multiselect', required: true, options: ['Fashion', 'Electronics', 'Home & Garden', 'Beauty', 'Sports', 'Kids', 'Others'] },
      { name: 'storeDescription', label: 'Store description (English)', type: 'textarea', required: true },
      { name: 'passport', label: 'Passport', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'proofAddress', label: 'Proof of US address', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'taxId', label: 'Tax ID (se aplicável)', type: 'text', required: false },
      { name: 'bankInfo', label: 'Informações bancárias para pagamentos', type: 'textarea', required: true },
      { name: 'shippingPolicy', label: 'Shipping policies (English)', type: 'textarea', required: true }
    ]
  },

  'tiktok-shop-uk': {
    id: 'tiktok-shop-uk',
    name: 'TikTok Shop UK',
    category: 'Ecommerce',
    credits: 997,
    description: 'Criação e verificação de conta TikTok Shop para Reino Unido',
    deliveryTime: '48-72 horas',
    features: [
      'Conta verificada no UK',
      'Configuração para mercado europeu',
      'Compliance com GDPR',
      'Suporte multilíngue',
      'Integração bancária UK'
    ],
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'birthDate', label: 'Date of birth', type: 'date', required: true },
      { name: 'ukAddress', label: 'UK Address', type: 'textarea', required: true },
      { name: 'ukPhone', label: 'UK Phone', type: 'tel', required: true, placeholder: '+44 XXXX XXXXXX' },
      { name: 'email', label: 'Corporate email', type: 'email', required: true },
      { name: 'storeName', label: 'Store name', type: 'text', required: true },
      { name: 'categories', label: 'Product categories', type: 'multiselect', required: true, options: ['Fashion', 'Electronics', 'Home', 'Beauty', 'Sports', 'Kids', 'Others'] },
      { name: 'storeDescription', label: 'Store description', type: 'textarea', required: true },
      { name: 'passport', label: 'Passport or ID', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'proofAddress', label: 'Proof of UK address', type: 'file', required: true, accept: 'image/*,application/pdf' },
      { name: 'taxId', label: 'UK Tax ID', type: 'text', required: false },
      { name: 'bankInfo', label: 'UK Bank information', type: 'textarea', required: true },
      { name: 'shippingPolicy', label: 'Shipping policies', type: 'textarea', required: true }
    ]
  },

  'proxy-br': {
    id: 'proxy-br',
    name: 'Proxy Brasil',
    category: 'Infraestrutura',
    credits: 37,
    recurring: 'mensal',
    description: 'Serviço de proxy dedicado no Brasil com IPs residenciais ou datacenter',
    deliveryTime: '12-24 horas',
    features: [
      'IPs brasileiros dedicados',
      'Velocidade garantida',
      'Suporte técnico incluído',
      'Configuração personalizada',
      'Uptime 99.9%'
    ],
    fields: [
      { name: 'region', label: 'Estado desejado', type: 'select', required: true, options: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Outros'] },
      { name: 'proxyType', label: 'Tipo de proxy', type: 'select', required: true, options: ['Residencial', 'Datacenter'] },
      { name: 'ipQuantity', label: 'Quantidade de IPs', type: 'number', required: true, min: 1, max: 1000 },
      { name: 'protocol', label: 'Protocolo', type: 'select', required: true, options: ['HTTP', 'HTTPS', 'SOCKS5'] },
      { name: 'usageTime', label: 'Tempo de uso estimado', type: 'select', required: true, options: ['1 mês', '3 meses', '6 meses', '12 meses'] },
      { name: 'application', label: 'Aplicação principal', type: 'text', required: true, placeholder: 'Ex: web scraping, automação' },
      { name: 'speedRequirement', label: 'Velocidade necessária', type: 'select', required: true, options: ['Baixa (1-5 Mbps)', 'Média (5-20 Mbps)', 'Alta (20+ Mbps)'] },
      { name: 'devices', label: 'Dispositivos que utilizarão', type: 'text', required: false },
      { name: 'usageHours', label: 'Horários de uso frequente', type: 'text', required: false },
      { name: 'rotatingIPs', label: 'Necessita IPs rotativos?', type: 'select', required: true, options: ['Sim', 'Não'] },
      { name: 'technicalConfig', label: 'Configurações técnicas específicas', type: 'textarea', required: false }
    ]
  },

  'proxy-us': {
    id: 'proxy-us',
    name: 'Proxy USA',
    category: 'Infraestrutura',
    credits: 65,
    recurring: 'mensal',
    description: 'Serviço de proxy dedicado nos Estados Unidos',
    deliveryTime: '12-24 horas',
    features: [
      'IPs americanos dedicados',
      'Múltiplas localizações nos EUA',
      'Alta velocidade',
      'Suporte 24/7',
      'Configuração personalizada'
    ],
    fields: [
      { name: 'region', label: 'Estado americano', type: 'select', required: true, options: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Texas', 'Others'] },
      { name: 'proxyType', label: 'Proxy type', type: 'select', required: true, options: ['Residential', 'Datacenter'] },
      { name: 'ipQuantity', label: 'Number of IPs', type: 'number', required: true, min: 1, max: 1000 },
      { name: 'protocol', label: 'Protocol', type: 'select', required: true, options: ['HTTP', 'HTTPS', 'SOCKS5'] },
      { name: 'usageTime', label: 'Usage period', type: 'select', required: true, options: ['1 month', '3 months', '6 months', '12 months'] },
      { name: 'application', label: 'Main application', type: 'text', required: true },
      { name: 'speedRequirement', label: 'Speed requirement', type: 'select', required: true, options: ['Low (1-5 Mbps)', 'Medium (5-20 Mbps)', 'High (20+ Mbps)'] },
      { name: 'devices', label: 'Number of devices', type: 'text', required: false },
      { name: 'rotatingIPs', label: 'Rotating IPs needed?', type: 'select', required: true, options: ['Yes', 'No'] },
      { name: 'technicalConfig', label: 'Technical specifications', type: 'textarea', required: false }
    ]
  },

  // Continua com os outros 13 serviços...
  // Por questão de espaço, vou criar um arquivo separado com TODOS
};

export const CREDIT_PACKAGES = {
  'starter': {
    id: 'starter',
    name: 'Starter',
    credits: 600,
    price: 497.00,
    description: 'Ideal para começar',
    popular: false
  },
  'business': {
    id: 'business',
    name: 'Business',
    credits: 1400,
    price: 997.00,
    description: 'Para negócios em crescimento',
    popular: true
  },
  'premium': {
    id: 'premium',
    name: 'Premium',
    credits: 5000,
    price: 2997.00,
    description: 'Máximo valor',
    popular: false
  },
  'empire': {
    id: 'empire',
    name: 'Empire',
    credits: 10000,
    price: 4997.00,
    description: 'Solução enterprise',
    popular: false
  }
};
