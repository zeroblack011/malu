// ============================================================================
// GLOBAL STATE
// ============================================================================
let currentUser = null;
let allServices = [];
let allPackages = [];
let selectedService = null;
let selectedPackage = null;
let pendingAction = null; // Stores action to execute after login
let currentPaymentId = null;
let paymentCheckInterval = null;

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initializing...');

    // Load user from localStorage
    loadUserFromStorage();

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    await loadInitialData();

    // Update UI based on auth state
    updateAuthUI();

    console.log('App initialized successfully');
});

// ============================================================================
// DATA LOADING
// ============================================================================
async function loadInitialData() {
    showLoading();
    try {
        // Load services and packages in parallel
        const [servicesResponse, packagesResponse] = await Promise.all([
            fetch('/api/services'),
            fetch('/api/credits/packages')
        ]);

        if (!servicesResponse.ok) {
            throw new Error('Failed to load services');
        }
        if (!packagesResponse.ok) {
            throw new Error('Failed to load credit packages');
        }

        allServices = await servicesResponse.json();
        allPackages = await packagesResponse.json();

        console.log(`Loaded ${allServices.length} services and ${allPackages.length} packages`);

        // Render services and packages
        renderServices(allServices);
        renderCreditPackages(allPackages);

    } catch (error) {
        console.error('Error loading initial data:', error);
        showToast('Erro ao carregar dados. Por favor, recarregue a página.', 'error');
    } finally {
        hideLoading();
    }
}

async function refreshUserData() {
    if (!currentUser || !currentUser.id) return;

    try {
        const response = await fetch(`/api/users/${currentUser.id}`);
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            saveUserToStorage(currentUser);
            updateAuthUI();
        }
    } catch (error) {
        console.error('Error refreshing user data:', error);
    }
}

// ============================================================================
// SERVICES RENDERING
// ============================================================================
function renderServices(services) {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;

    servicesList.innerHTML = '';

    if (services.length === 0) {
        servicesList.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhum serviço encontrado.</p></div>';
        return;
    }

    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesList.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const categoryColors = {
        'Documentação': 'primary',
        'Benefícios': 'success',
        'Financeiro': 'warning',
        'Propriedade': 'info',
        'Outros': 'secondary'
    };

    const badgeColor = categoryColors[service.category] || 'secondary';

    col.innerHTML = `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h5 class="service-title">${service.name}</h5>
            <span class="badge bg-${badgeColor} mb-2">${service.category}</span>
            <p class="service-description">${service.description}</p>
            <div class="service-footer">
                <span class="service-credits">${formatCredits(service.creditCost)} créditos</span>
                <button class="btn btn-sm btn-primary" onclick="openServiceModal(${service.id})">
                    Contratar
                </button>
            </div>
        </div>
    `;

    return col;
}

function filterServices(category) {
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter and render
    if (category === 'all') {
        renderServices(allServices);
    } else {
        const filtered = allServices.filter(s => s.category === category);
        renderServices(filtered);
    }
}

// ============================================================================
// CREDIT PACKAGES RENDERING
// ============================================================================
function renderCreditPackages(packages) {
    const container = document.getElementById('creditPackages');
    if (!container) return;

    container.innerHTML = '';

    if (packages.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhum pacote disponível.</p></div>';
        return;
    }

    packages.forEach(pkg => {
        const packageCard = createPackageCard(pkg);
        container.appendChild(packageCard);
    });
}

function createPackageCard(pkg) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';

    const isPopular = pkg.credits >= 50 && pkg.credits <= 100;

    col.innerHTML = `
        <div class="credit-package ${isPopular ? 'popular' : ''}">
            ${isPopular ? '<div class="popular-badge">Mais Popular</div>' : ''}
            <div class="package-credits">${formatCredits(pkg.credits)}</div>
            <div class="package-price">${formatCurrency(pkg.price)}</div>
            ${pkg.bonusCredits > 0 ? `<div class="package-bonus">+ ${pkg.bonusCredits} bônus</div>` : ''}
            <button class="btn btn-primary w-100 mt-3" onclick="buyCredits(${pkg.id})">
                Comprar
            </button>
        </div>
    `;

    return col;
}

// ============================================================================
// SERVICE MODAL
// ============================================================================
window.openServiceModal = function(serviceId) {
    selectedService = allServices.find(s => s.id === serviceId);
    if (!selectedService) {
        showToast('Serviço não encontrado', 'error');
        return;
    }

    // Check if user is logged in
    if (!currentUser) {
        // Store the action to execute after login
        pendingAction = () => openServiceModal(serviceId);
        openModal('authModal');
        return;
    }

    // User is logged in, show service modal
    renderServiceModal(selectedService);
    openModal('serviceModal');
};

function renderServiceModal(service) {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const hasEnoughCredits = currentUser && currentUser.credits >= service.creditCost;

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="${service.icon} me-2"></i>
                    ${service.name}
                </h5>
                <button type="button" class="btn-close" onclick="closeModal('serviceModal')"></button>
            </div>
            <div class="modal-body">
                <div class="service-details">
                    <p class="text-muted">${service.description}</p>
                    <div class="alert alert-info">
                        <strong>Custo:</strong> ${formatCredits(service.creditCost)} créditos
                    </div>

                    ${currentUser ? `
                        <div class="alert ${hasEnoughCredits ? 'alert-success' : 'alert-warning'}">
                            <strong>Seus créditos:</strong> ${formatCredits(currentUser.credits)}
                        </div>
                    ` : ''}

                    ${!hasEnoughCredits && currentUser ? `
                        <div class="alert alert-danger">
                            Você não tem créditos suficientes. Compre mais créditos para contratar este serviço.
                        </div>
                        <button class="btn btn-warning w-100 mb-3" onclick="closeModal('serviceModal'); scrollToCredits()">
                            Comprar Créditos
                        </button>
                    ` : ''}

                    ${hasEnoughCredits ? `
                        <form id="serviceForm" onsubmit="submitServiceOrder(event)">
                            <h6 class="mb-3">Preencha os dados necessários:</h6>
                            ${renderServiceFields(service.requiredFields)}
                            <button type="submit" class="btn btn-primary w-100">
                                Contratar Serviço
                            </button>
                        </form>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderServiceFields(fields) {
    if (!fields || fields.length === 0) {
        return '<p class="text-muted">Nenhum dado adicional necessário.</p>';
    }

    return fields.map(field => {
        const fieldType = field.type || 'text';
        const required = field.required ? 'required' : '';

        if (fieldType === 'select' && field.options) {
            return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <select class="form-select" name="${field.name}" ${required}>
                        <option value="">Selecione...</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (fieldType === 'textarea') {
            return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <textarea class="form-control" name="${field.name}" rows="3" ${required}></textarea>
                </div>
            `;
        } else {
            return `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    <input type="${fieldType}" class="form-control" name="${field.name}" ${required}>
                </div>
            `;
        }
    }).join('');
}

window.submitServiceOrder = async function(event) {
    event.preventDefault();

    if (!currentUser || !selectedService) {
        showToast('Erro: usuário ou serviço não encontrado', 'error');
        return;
    }

    if (currentUser.credits < selectedService.creditCost) {
        showToast('Créditos insuficientes', 'error');
        return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const serviceData = {};

    formData.forEach((value, key) => {
        serviceData[key] = value;
    });

    showLoading();

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                serviceId: selectedService.id,
                serviceData: serviceData
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar pedido');
        }

        const order = await response.json();

        showToast('Pedido criado com sucesso!', 'success');
        closeModal('serviceModal');

        // Refresh user data to update credits
        await refreshUserData();

        // Show success message with order details
        setTimeout(() => {
            showToast(`Pedido #${order.id} em processamento`, 'info');
        }, 500);

    } catch (error) {
        console.error('Error creating order:', error);
        showToast(error.message || 'Erro ao criar pedido', 'error');
    } finally {
        hideLoading();
    }
};

// ============================================================================
// CREDIT PURCHASE
// ============================================================================
window.buyCredits = function(packageId) {
    selectedPackage = allPackages.find(p => p.id === packageId);
    if (!selectedPackage) {
        showToast('Pacote não encontrado', 'error');
        return;
    }

    // Check if user is logged in
    if (!currentUser) {
        // Store the action to execute after login
        pendingAction = () => buyCredits(packageId);
        openModal('authModal');
        return;
    }

    // User is logged in, proceed with purchase
    processCreditPurchase(selectedPackage);
};

async function processCreditPurchase(pkg) {
    showLoading();

    try {
        const response = await fetch('/api/credits/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                packageId: pkg.id
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao processar compra');
        }

        const payment = await response.json();
        currentPaymentId = payment.id;

        // Show PIX modal with payment details
        showPixModal(payment);

        // Start polling for payment status
        startPaymentStatusCheck(payment.id);

    } catch (error) {
        console.error('Error processing credit purchase:', error);
        showToast(error.message || 'Erro ao processar compra', 'error');
    } finally {
        hideLoading();
    }
}

function showPixModal(payment) {
    const modal = document.getElementById('pixModal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pagamento PIX</h5>
                <button type="button" class="btn-close" onclick="closePixModal()"></button>
            </div>
            <div class="modal-body text-center">
                <div class="alert alert-info">
                    <strong>Valor:</strong> ${formatCurrency(payment.amount)}
                </div>

                <div class="qr-code-container mb-3">
                    <img src="${payment.qrCodeImage}" alt="QR Code PIX" class="img-fluid" style="max-width: 300px;">
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Código PIX Copia e Cola:</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="pixCode" value="${payment.qrCode}" readonly>
                        <button class="btn btn-outline-secondary" onclick="copyPixCode()">
                            <i class="fas fa-copy"></i> Copiar
                        </button>
                    </div>
                </div>

                <div class="alert alert-warning">
                    <i class="fas fa-clock me-2"></i>
                    Aguardando confirmação do pagamento...
                </div>

                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Verificando pagamento...</span>
                </div>
            </div>
        </div>
    `;

    openModal('pixModal');
}

window.copyPixCode = function() {
    const pixCodeInput = document.getElementById('pixCode');
    if (pixCodeInput) {
        pixCodeInput.select();
        document.execCommand('copy');
        showToast('Código PIX copiado!', 'success');
    }
};

window.closePixModal = function() {
    stopPaymentStatusCheck();
    closeModal('pixModal');
    currentPaymentId = null;
};

function startPaymentStatusCheck(paymentId) {
    // Clear any existing interval
    stopPaymentStatusCheck();

    // Check immediately
    checkPaymentStatus(paymentId);

    // Then check every 3 seconds
    paymentCheckInterval = setInterval(() => {
        checkPaymentStatus(paymentId);
    }, 3000);
}

function stopPaymentStatusCheck() {
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
        paymentCheckInterval = null;
    }
}

async function checkPaymentStatus(paymentId) {
    try {
        const response = await fetch(`/api/credits/payment/${paymentId}/status`);
        if (!response.ok) return;

        const payment = await response.json();

        if (payment.status === 'approved') {
            stopPaymentStatusCheck();
            closeModal('pixModal');
            showToast('Pagamento confirmado! Créditos adicionados à sua conta.', 'success');
            await refreshUserData();
        } else if (payment.status === 'cancelled' || payment.status === 'rejected') {
            stopPaymentStatusCheck();
            closeModal('pixModal');
            showToast('Pagamento não confirmado. Tente novamente.', 'error');
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
    }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================
window.showLogin = function() {
    document.getElementById('registerForm')?.classList.add('d-none');
    document.getElementById('loginForm')?.classList.remove('d-none');
};

window.showRegister = function() {
    document.getElementById('loginForm')?.classList.add('d-none');
    document.getElementById('registerForm')?.classList.remove('d-none');
};

window.submitLogin = async function(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.querySelector('input[name="email"]').value.trim();

    if (!email) {
        showToast('Por favor, informe seu email', 'error');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`/api/users/email/${encodeURIComponent(email)}`);

        if (!response.ok) {
            if (response.status === 404) {
                showToast('Usuário não encontrado. Por favor, registre-se.', 'error');
                showRegister();
            } else {
                throw new Error('Erro ao fazer login');
            }
            return;
        }

        const user = await response.json();

        // Save user and update UI
        currentUser = user;
        saveUserToStorage(user);
        updateAuthUI();
        closeModal('authModal');

        showToast(`Bem-vindo, ${user.name}!`, 'success');

        // Execute pending action if any
        if (pendingAction) {
            const action = pendingAction;
            pendingAction = null;
            setTimeout(() => action(), 300);
        }

        // Reset form
        form.reset();

    } catch (error) {
        console.error('Error logging in:', error);
        showToast(error.message || 'Erro ao fazer login', 'error');
    } finally {
        hideLoading();
    }
};

window.submitRegister = async function(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();

    if (!name || !email || !phone) {
        showToast('Por favor, preencha todos os campos', 'error');
        return;
    }

    showLoading();

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao registrar');
        }

        const user = await response.json();

        // Save user and update UI
        currentUser = user;
        saveUserToStorage(user);
        updateAuthUI();
        closeModal('authModal');

        showToast(`Bem-vindo, ${user.name}! Você ganhou 10 créditos de bônus!`, 'success');

        // Execute pending action if any
        if (pendingAction) {
            const action = pendingAction;
            pendingAction = null;
            setTimeout(() => action(), 300);
        }

        // Reset form
        form.reset();

    } catch (error) {
        console.error('Error registering:', error);
        showToast(error.message || 'Erro ao registrar', 'error');
    } finally {
        hideLoading();
    }
};

window.logout = function() {
    currentUser = null;
    localStorage.removeItem('malu_user');
    updateAuthUI();
    showToast('Você saiu da sua conta', 'info');

    // Clear any pending actions
    pendingAction = null;
};

function loadUserFromStorage() {
    const userJson = localStorage.getItem('malu_user');
    if (userJson) {
        try {
            currentUser = JSON.parse(userJson);
            console.log('User loaded from storage:', currentUser.email);
            // Refresh user data from server
            refreshUserData();
        } catch (error) {
            console.error('Error parsing user from storage:', error);
            localStorage.removeItem('malu_user');
        }
    }
}

function saveUserToStorage(user) {
    localStorage.setItem('malu_user', JSON.stringify(user));
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    const userCredits = document.getElementById('userCredits');

    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.classList.add('d-none');
        if (logoutBtn) logoutBtn.classList.remove('d-none');
        if (myOrdersBtn) myOrdersBtn.classList.remove('d-none');
        if (userCredits) {
            userCredits.classList.remove('d-none');
            userCredits.textContent = `${formatCredits(currentUser.credits)} créditos`;
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.classList.remove('d-none');
        if (logoutBtn) logoutBtn.classList.add('d-none');
        if (myOrdersBtn) myOrdersBtn.classList.add('d-none');
        if (userCredits) userCredits.classList.add('d-none');
    }
}

// ============================================================================
// ORDERS
// ============================================================================
window.showMyOrders = async function() {
    if (!currentUser) {
        showToast('Por favor, faça login para ver seus pedidos', 'error');
        openModal('authModal');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`/api/orders/user/${currentUser.id}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar pedidos');
        }

        const orders = await response.json();
        renderOrdersModal(orders);
        openModal('ordersModal');

    } catch (error) {
        console.error('Error loading orders:', error);
        showToast(error.message || 'Erro ao carregar pedidos', 'error');
    } finally {
        hideLoading();
    }
};

function renderOrdersModal(orders) {
    const modal = document.getElementById('ordersModal');
    if (!modal) return;

    const ordersList = orders.map(order => {
        const service = allServices.find(s => s.id === order.serviceId);
        const statusColors = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        };
        const statusLabels = {
            'pending': 'Pendente',
            'processing': 'Processando',
            'completed': 'Concluído',
            'cancelled': 'Cancelado'
        };

        return `
            <div class="order-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">
                            <i class="${service?.icon || 'fas fa-file'} me-2"></i>
                            ${service?.name || 'Serviço'}
                        </h6>
                        <small class="text-muted">Pedido #${order.id}</small>
                        <br>
                        <small class="text-muted">Data: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${statusColors[order.status] || 'secondary'}">
                            ${statusLabels[order.status] || order.status}
                        </span>
                        <br>
                        <small class="text-muted">${formatCredits(order.creditsUsed)} créditos</small>
                    </div>
                </div>
                ${order.result ? `
                    <div class="mt-2">
                        <small class="text-success"><strong>Resultado:</strong> ${order.result}</small>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Meus Pedidos</h5>
                <button type="button" class="btn-close" onclick="closeModal('ordersModal')"></button>
            </div>
            <div class="modal-body">
                ${orders.length > 0 ? ordersList : '<p class="text-center text-muted">Você ainda não tem pedidos.</p>'}
            </div>
        </div>
    `;
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showLogin();
            openModal('authModal');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // My orders button
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    if (myOrdersBtn) {
        myOrdersBtn.addEventListener('click', showMyOrders);
    }

    // Auth modal form toggles
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegister();
        });
    }

    const showLoginBtn = document.getElementById('showLoginBtn');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }

    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', submitRegister);
    }

    // Service filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterServices(category);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const modals = ['authModal', 'serviceModal', 'pixModal', 'ordersModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && event.target === modal) {
                closeModal(modalId);
            }
        });
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function showLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('d-none');
    }
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('d-none');
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }

    const toastId = 'toast-' + Date.now();
    const bgColors = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    };

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white ${bgColors[type] || 'bg-info'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Show toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    // Remove after hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatCredits(value) {
    return value.toLocaleString('pt-BR');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.classList.add('modal-open');

        // Add backdrop
        let backdrop = document.querySelector('.modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');

        // Remove backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    // Clear pending action if closing auth modal
    if (modalId === 'authModal') {
        pendingAction = null;
    }

    // Stop payment check if closing pix modal
    if (modalId === 'pixModal') {
        stopPaymentStatusCheck();
        currentPaymentId = null;
    }
}

function requireAuth(callback) {
    if (!currentUser) {
        pendingAction = callback;
        openModal('authModal');
        return false;
    }
    return true;
}

function scrollToCredits() {
    const creditsSection = document.getElementById('creditPackages');
    if (creditsSection) {
        creditsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================================================
// EXPORT FOR GLOBAL ACCESS
// ============================================================================
window.filterServices = filterServices;
window.scrollToCredits = scrollToCredits;
