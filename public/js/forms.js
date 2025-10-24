// Forms Manager
const Forms = {
    currentService: null,
    formData: {},
    uploadedFiles: {},

    // Show service form
    showServiceForm(service) {
        this.currentService = service;
        this.formData = {};
        this.uploadedFiles = {};

        const formHTML = this.getFormForService(service);

        const modal = `
            <div class="modal-overlay">
                <div class="modal modal-wide">
                    <div class="modal-header">
                        <h2 class="modal-title">${service.icon} ${service.name}</h2>
                        <button class="modal-close" onclick="Forms.closeForm()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-intro">
                            <p>Preencha as informações abaixo para solicitar este serviço.</p>
                            <p class="text-secondary">
                                <strong>Custo:</strong> ${Utils.formatNumber(service.credits)} créditos
                            </p>
                        </div>

                        <form id="service-form" class="service-form">
                            ${formHTML}

                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" onclick="Forms.closeForm()">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn btn-primary btn-lg">
                                    Confirmar Pedido
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
        this.attachFormEvents();
    },

    // Get form for service
    getFormForService(service) {
        const forms = {
            'llc-usa': this.getLLCUSAForm(),
            'tiktok-shop-br': this.getTikTokShopBRForm(),
            'tiktok-shop-us': this.getTikTokShopUSForm(),
            'tiktok-shop-uk': this.getTikTokShopUKForm(),
            'proxy-br': this.getProxyForm('Brasil'),
            'proxy-us': this.getProxyForm('USA'),
            'dropshipping-supplier': this.getDropshippingForm(),
            'ai-ads': this.getAIAdsForm(),
            'custom-app': this.getCustomAppForm(),
            'bm-facebook': this.getBusinessManagerForm('Facebook'),
            'bm-tiktok': this.getBusinessManagerForm('TikTok'),
            'bm-google': this.getBusinessManagerForm('Google'),
            'ecommerce-site': this.getEcommerceSiteForm(),
            'legal-consulting': this.getLegalConsultingForm()
        };

        return forms[service.id] || this.getGenericForm();
    },

    // LLC USA Form
    getLLCUSAForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome Completo do Proprietário <span class="form-required">*</span></label>
                <input type="text" name="ownerName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">CPF ou Passaporte <span class="form-required">*</span></label>
                <input type="text" name="document" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Endereço Residencial Completo <span class="form-required">*</span></label>
                <textarea name="address" class="form-textarea" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Telefone Internacional <span class="form-required">*</span></label>
                <input type="tel" name="phone" class="form-input" placeholder="+55 (00) 00000-0000" required>
            </div>

            <div class="form-group">
                <label class="form-label">Email Principal <span class="form-required">*</span></label>
                <input type="email" name="email" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Nome Desejado para a LLC <span class="form-required">*</span></label>
                <input type="text" name="llcName" class="form-input" placeholder="Example LLC" required>
                <span class="form-help">O nome será verificado quanto à disponibilidade</span>
            </div>

            <div class="form-group">
                <label class="form-label">Estado Preferido <span class="form-required">*</span></label>
                <select name="state" class="form-select" required>
                    <option value="">Selecione um estado</option>
                    <option value="DE">Delaware</option>
                    <option value="WY">Wyoming</option>
                    <option value="NV">Nevada</option>
                    <option value="FL">Florida</option>
                    <option value="TX">Texas</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Atividade Principal do Negócio <span class="form-required">*</span></label>
                <textarea name="businessActivity" class="form-textarea" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Documento de Identidade <span class="form-required">*</span></label>
                <input type="file" name="idDocument" class="file-upload-input" accept="image/*,.pdf" required>
                <label class="file-upload-label">
                    📄 Clique para selecionar arquivo
                </label>
                <div class="file-upload-preview"></div>
            </div>

            <div class="form-group">
                <label class="form-label">Comprovante de Residência <span class="form-required">*</span></label>
                <input type="file" name="proofOfAddress" class="file-upload-input" accept="image/*,.pdf" required>
                <label class="file-upload-label">
                    📄 Clique para selecionar arquivo
                </label>
                <div class="file-upload-preview"></div>
            </div>

            <div class="form-group">
                <label class="form-label">Nomes dos Membros Adicionais (se houver)</label>
                <textarea name="additionalMembers" class="form-textarea" placeholder="Liste os nomes separados por vírgula"></textarea>
            </div>
        `;
    },

    // TikTok Shop BR Form
    getTikTokShopBRForm() {
        return `
            <div class="form-group">
                <label class="form-label">CPF ou CNPJ <span class="form-required">*</span></label>
                <input type="text" name="cpfCnpj" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Nome Completo <span class="form-required">*</span></label>
                <input type="text" name="fullName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Data de Nascimento <span class="form-required">*</span></label>
                <input type="date" name="birthDate" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Endereço Completo <span class="form-required">*</span></label>
                <textarea name="address" class="form-textarea" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Telefone para Verificação <span class="form-required">*</span></label>
                <input type="tel" name="phone" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Email Corporativo <span class="form-required">*</span></label>
                <input type="email" name="email" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Nome da Loja Desejado <span class="form-required">*</span></label>
                <input type="text" name="storeName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Categorias de Produtos <span class="form-required">*</span></label>
                <select name="categories" class="form-select" multiple required>
                    <option value="fashion">Moda e Vestuário</option>
                    <option value="beauty">Beleza e Cuidados</option>
                    <option value="electronics">Eletrônicos</option>
                    <option value="home">Casa e Decoração</option>
                    <option value="sports">Esportes e Lazer</option>
                    <option value="toys">Brinquedos</option>
                    <option value="food">Alimentos e Bebidas</option>
                </select>
                <span class="form-help">Segure Ctrl/Cmd para selecionar múltiplas opções</span>
            </div>

            <div class="form-group">
                <label class="form-label">Documento de Identidade <span class="form-required">*</span></label>
                <input type="file" name="idDocument" class="file-upload-input" accept="image/*,.pdf" required>
                <label class="file-upload-label">
                    📄 Clique para selecionar arquivo
                </label>
            </div>

            <div class="form-group">
                <label class="form-label">Comprovante de Endereço <span class="form-required">*</span></label>
                <input type="file" name="proofOfAddress" class="file-upload-input" accept="image/*,.pdf" required>
                <label class="file-upload-label">
                    📄 Clique para selecionar arquivo
                </label>
            </div>
        `;
    },

    // TikTok Shop US/UK Form
    getTikTokShopUSForm() {
        return this.getTikTokShopBRForm(); // Similar structure
    },

    getTikTokShopUKForm() {
        return this.getTikTokShopBRForm(); // Similar structure
    },

    // Proxy Form
    getProxyForm(region) {
        return `
            <div class="form-group">
                <label class="form-label">Tipo de Proxy <span class="form-required">*</span></label>
                <select name="proxyType" class="form-select" required>
                    <option value="residential">Residencial</option>
                    <option value="datacenter">Datacenter</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Quantidade de IPs <span class="form-required">*</span></label>
                <input type="number" name="ipQuantity" class="form-input" min="1" value="1" required>
            </div>

            <div class="form-group">
                <label class="form-label">Protocolo Preferido <span class="form-required">*</span></label>
                <select name="protocol" class="form-select" required>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks5">SOCKS5</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Aplicação Principal</label>
                <input type="text" name="application" class="form-input" placeholder="Ex: Web scraping, automação, etc.">
            </div>

            <div class="form-group">
                <label class="form-label">Configurações Técnicas Específicas</label>
                <textarea name="technicalRequirements" class="form-textarea" placeholder="Descreva requisitos específicos se houver"></textarea>
            </div>
        `;
    },

    // Business Manager Form
    getBusinessManagerForm(platform) {
        return `
            <div class="form-group">
                <label class="form-label">Nome da Empresa <span class="form-required">*</span></label>
                <input type="text" name="companyName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">CNPJ <span class="form-required">*</span></label>
                <input type="text" name="cnpj" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Nome do Responsável <span class="form-required">*</span></label>
                <input type="text" name="responsibleName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Cargo do Responsável <span class="form-required">*</span></label>
                <input type="text" name="position" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Telefone Comercial <span class="form-required">*</span></label>
                <input type="tel" name="businessPhone" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Email Corporativo <span class="form-required">*</span></label>
                <input type="email" name="businessEmail" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Site da Empresa</label>
                <input type="url" name="website" class="form-input" placeholder="https://">
            </div>

            <div class="form-group">
                <label class="form-label">Setor de Atuação <span class="form-required">*</span></label>
                <input type="text" name="industry" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Documentos Comprobatórios <span class="form-required">*</span></label>
                <input type="file" name="documents" class="file-upload-input" accept=".pdf,image/*" multiple required>
                <label class="file-upload-label">
                    📄 Clique para selecionar arquivos
                </label>
                <span class="form-help">Cartão CNPJ, contrato social, etc.</span>
            </div>
        `;
    },

    // Dropshipping Form
    getDropshippingForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome da Marca <span class="form-required">*</span></label>
                <input type="text" name="brandName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Logotipo da Marca</label>
                <input type="file" name="logo" class="file-upload-input" accept="image/*">
                <label class="file-upload-label">
                    🎨 Clique para selecionar imagem
                </label>
            </div>

            <div class="form-group">
                <label class="form-label">Nicho de Produtos <span class="form-required">*</span></label>
                <select name="niche" class="form-select" multiple required>
                    <option value="fashion">Moda</option>
                    <option value="electronics">Eletrônicos</option>
                    <option value="home">Casa</option>
                    <option value="beauty">Beleza</option>
                    <option value="sports">Esportes</option>
                    <option value="toys">Brinquedos</option>
                    <option value="pet">Pet</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Quantidade Mensal Estimada <span class="form-required">*</span></label>
                <select name="monthlyVolume" class="form-select" required>
                    <option value="1-50">1-50 produtos</option>
                    <option value="51-200">51-200 produtos</option>
                    <option value="201-500">201-500 produtos</option>
                    <option value="500+">Mais de 500 produtos</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Público-Alvo <span class="form-required">*</span></label>
                <textarea name="targetAudience" class="form-textarea" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Países de Entrega Preferidos <span class="form-required">*</span></label>
                <input type="text" name="shippingCountries" class="form-input" placeholder="Ex: Brasil, EUA, Portugal" required>
            </div>

            <div class="form-group">
                <label class="form-label">Informações Adicionais</label>
                <textarea name="additionalInfo" class="form-textarea" placeholder="Requisitos especiais, preferências de produtos, etc."></textarea>
            </div>
        `;
    },

    // AI Ads Form
    getAIAdsForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome do Negócio <span class="form-required">*</span></label>
                <input type="text" name="businessName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Produto/Serviço <span class="form-required">*</span></label>
                <input type="text" name="product" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Público-Alvo <span class="form-required">*</span></label>
                <textarea name="targetAudience" class="form-textarea" placeholder="Descreva seu público-alvo (idade, interesses, localização, etc.)" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Plataformas de Anúncio <span class="form-required">*</span></label>
                <select name="platforms" class="form-select" multiple required>
                    <option value="facebook">Facebook/Instagram</option>
                    <option value="google">Google Ads</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Objetivo da Campanha <span class="form-required">*</span></label>
                <select name="objective" class="form-select" required>
                    <option value="awareness">Reconhecimento de Marca</option>
                    <option value="traffic">Tráfego</option>
                    <option value="conversions">Conversões</option>
                    <option value="leads">Geração de Leads</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">URL do Site/Landing Page</label>
                <input type="url" name="website" class="form-input" placeholder="https://">
            </div>
        `;
    },

    // Custom App Form
    getCustomAppForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome do App <span class="form-required">*</span></label>
                <input type="text" name="appName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Descrição do App <span class="form-required">*</span></label>
                <textarea name="appDescription" class="form-textarea" rows="5" placeholder="Descreva o propósito e funcionalidades principais do app" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Plataformas <span class="form-required">*</span></label>
                <select name="platforms" class="form-select" multiple required>
                    <option value="ios">iOS</option>
                    <option value="android">Android</option>
                    <option value="web">Web App</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Funcionalidades Principais <span class="form-required">*</span></label>
                <textarea name="mainFeatures" class="form-textarea" rows="4" placeholder="Liste as funcionalidades principais, uma por linha" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Referências de Design</label>
                <input type="file" name="designReferences" class="file-upload-input" accept="image/*" multiple>
                <label class="file-upload-label">
                    🎨 Upload de imagens de referência
                </label>
            </div>

            <div class="form-group">
                <label class="form-label">Prazo Desejado <span class="form-required">*</span></label>
                <select name="timeline" class="form-select" required>
                    <option value="standard">30-45 dias (padrão)</option>
                    <option value="express">20-30 dias (express)</option>
                </select>
            </div>
        `;
    },

    // Ecommerce Site Form
    getEcommerceSiteForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome da Loja <span class="form-required">*</span></label>
                <input type="text" name="storeName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Nicho/Categoria <span class="form-required">*</span></label>
                <input type="text" name="niche" class="form-input" placeholder="Ex: Moda feminina, eletrônicos, etc." required>
            </div>

            <div class="form-group">
                <label class="form-label">Domínio Desejado</label>
                <input type="text" name="domain" class="form-input" placeholder="minhaloja.com.br">
                <span class="form-help">Se já possui um domínio, informe aqui</span>
            </div>

            <div class="form-group">
                <label class="form-label">Cores da Marca</label>
                <div class="color-picker-group">
                    <input type="color" name="primaryColor" value="#2563eb">
                    <input type="color" name="secondaryColor" value="#059669">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Logotipo</label>
                <input type="file" name="logo" class="file-upload-input" accept="image/*">
                <label class="file-upload-label">
                    🎨 Upload do logotipo
                </label>
            </div>

            <div class="form-group">
                <label class="form-label">Quantidade Inicial de Produtos <span class="form-required">*</span></label>
                <select name="productCount" class="form-select" required>
                    <option value="1-10">1-10 produtos</option>
                    <option value="11-50">11-50 produtos</option>
                    <option value="51-100">51-100 produtos</option>
                    <option value="100+">Mais de 100 produtos</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Integrações de Pagamento <span class="form-required">*</span></label>
                <select name="paymentGateways" class="form-select" multiple required>
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="pagseguro">PagSeguro</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>
        `;
    },

    // Legal Consulting Form
    getLegalConsultingForm() {
        return `
            <div class="form-group">
                <label class="form-label">Assunto da Consultoria <span class="form-required">*</span></label>
                <select name="subject" class="form-select" required>
                    <option value="">Selecione um assunto</option>
                    <option value="company">Abertura de Empresa</option>
                    <option value="contracts">Contratos</option>
                    <option value="ecommerce">Ecommerce e LGPD</option>
                    <option value="tax">Questões Fiscais</option>
                    <option value="international">Negócios Internacionais</option>
                    <option value="other">Outros</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Descrição Detalhada <span class="form-required">*</span></label>
                <textarea name="description" class="form-textarea" rows="5" placeholder="Descreva sua situação e dúvidas em detalhes" required></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Data/Hora Preferida <span class="form-required">*</span></label>
                <input type="datetime-local" name="preferredDateTime" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Telefone para Contato <span class="form-required">*</span></label>
                <input type="tel" name="phone" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Documentos Relacionados</label>
                <input type="file" name="documents" class="file-upload-input" accept=".pdf,image/*" multiple>
                <label class="file-upload-label">
                    📄 Upload de documentos (opcional)
                </label>
            </div>
        `;
    },

    // Generic Form
    getGenericForm() {
        return `
            <div class="form-group">
                <label class="form-label">Nome Completo <span class="form-required">*</span></label>
                <input type="text" name="fullName" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Email <span class="form-required">*</span></label>
                <input type="email" name="email" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Telefone <span class="form-required">*</span></label>
                <input type="tel" name="phone" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Detalhes do Pedido <span class="form-required">*</span></label>
                <textarea name="details" class="form-textarea" rows="5" required></textarea>
            </div>
        `;
    },

    // Attach form events
    attachFormEvents() {
        const form = document.getElementById('service-form');
        if (!form) return;

        // File upload handling
        form.querySelectorAll('.file-upload-input').forEach(input => {
            input.addEventListener('change', (e) => this.handleFileUpload(e));
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitForm(e.target);
        });

        // Input formatting (CPF, phone, etc.)
        this.attachInputFormatting(form);
    },

    // Handle file upload
    handleFileUpload(event) {
        const input = event.target;
        const files = input.files;
        const preview = input.nextElementSibling?.nextElementSibling;

        if (!files.length || !preview) return;

        const fileNames = Array.from(files).map(f => f.name).join(', ');
        preview.innerHTML = `<small class="text-success">✓ ${fileNames}</small>`;

        // Store files
        this.uploadedFiles[input.name] = files;
    },

    // Attach input formatting
    attachInputFormatting(form) {
        // CPF/CNPJ
        form.querySelectorAll('[name="cpf"], [name="cpfCnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    if (value.length > 11) value = value.slice(0, 11);
                    e.target.value = Utils.formatCPF(value);
                } else {
                    if (value.length > 14) value = value.slice(0, 14);
                    e.target.value = Utils.formatCNPJ(value);
                }
            });
        });

        // Phone
        form.querySelectorAll('[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                e.target.value = Utils.formatPhone(value);
            });
        });

        // CNPJ
        form.querySelectorAll('[name="cnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 14) value = value.slice(0, 14);
                e.target.value = Utils.formatCNPJ(value);
            });
        });
    },

    // Submit form
    async submitForm(form) {
        const formData = new FormData(form);
        const data = {};

        // Get form values
        for (let [key, value] of formData.entries()) {
            if (value) {
                data[key] = value;
            }
        }

        try {
            Utils.showLoading();

            // Deduct credits
            await Credits.deduct(this.currentService.credits, `Serviço: ${this.currentService.name}`);

            // Create order
            const order = await OrdersAPI.createOrder(this.currentService.id, data);

            // Upload files
            if (Object.keys(this.uploadedFiles).length > 0) {
                for (let [fieldName, files] of Object.entries(this.uploadedFiles)) {
                    for (let file of files) {
                        await OrdersAPI.uploadFile(order.id, file, fieldName);
                    }
                }
            }

            Utils.showToast('Pedido criado com sucesso!', 'success');

            this.closeForm();

            // Show order confirmation
            this.showOrderConfirmation(order);

        } catch (error) {
            Utils.showToast(error.message || 'Erro ao criar pedido', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Show order confirmation
    showOrderConfirmation(order) {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-body text-center">
                        <div class="success-icon">✅</div>
                        <h2 class="modal-title">Pedido Confirmado!</h2>
                        <p class="mt-2">
                            Seu pedido <strong>#${order.id.slice(0, 8)}</strong> foi recebido e está sendo processado.
                        </p>
                        <p class="text-secondary mt-2">
                            Você receberá atualizações por email e notificações no app.
                        </p>
                        <div class="modal-actions mt-4">
                            <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">
                                Fechar
                            </button>
                            <button class="btn btn-primary" onclick="Orders.viewOrder('${order.id}')">
                                Ver Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
    },

    // Close form
    closeForm() {
        if (confirm('Deseja cancelar este pedido? As informações preenchidas serão perdidas.')) {
            document.getElementById('modal-container').innerHTML = '';
        }
    }
};
