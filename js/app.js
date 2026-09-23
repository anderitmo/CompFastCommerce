/**
 * CompFast Admin Backoffice Application
 * Stack: Vanilla HTML, CSS, JavaScript (No external npm packages)
 * Supabase REST API Integration
 */

const SUPABASE_CONFIG = {
  endpoint: 'https://firanjbwcodewkaalkwc.supabase.co/rest/v1/',
  apiKey: 'sb_publishable_QYT5hmIwpLglUaQlUEW_Lg_JXKln1oc',
  headers: {
    'apikey': 'sb_publishable_QYT5hmIwpLglUaQlUEW_Lg_JXKln1oc',
    'Authorization': 'Bearer sb_publishable_QYT5hmIwpLglUaQlUEW_Lg_JXKln1oc',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

// Global Application State
const state = {
  currentRoute: 'dashboard-vendas',
  categories: [],
  products: [],
  coupons: [],
  promotions: [],
  customers: [],
  orders: [],
  orderItems: [],
  searchQuery: '',
  selectedOrderFilter: 'all'
};

// Helper REST fetch wrapper for Supabase
async function supabaseFetch(table, options = {}) {
  const method = options.method || 'GET';
  let url = `${SUPABASE_CONFIG.endpoint}${table}`;
  if (options.query) {
    url += `?${options.query}`;
  }

  const headers = { ...SUPABASE_CONFIG.headers, ...(options.headers || {}) };
  const fetchOpts = { method, headers };

  if (options.body) {
    fetchOpts.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOpts);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro HTTP ${response.status}`);
    }
    if (method === 'DELETE') {
      return true;
    }
    return await response.json();
  } catch (err) {
    console.error(`Erro na requisição (${method} ${table}):`, err);
    showToast(`Erro ao sincronizar com Supabase: ${err.message}`, 'error');
    throw err;
  }
}

// Load all data from Supabase DB
async function loadAllData() {
  try {
    const [categories, products, coupons, promotions, customers, orders, orderItems] = await Promise.all([
      supabaseFetch('categories', { query: 'select=*&order=created_at.desc' }),
      supabaseFetch('products', { query: 'select=*&order=created_at.desc' }),
      supabaseFetch('coupons', { query: 'select=*&order=created_at.desc' }),
      supabaseFetch('promotions', { query: 'select=*&order=starts_at.desc' }),
      supabaseFetch('customers', { query: 'select=*&order=created_at.desc' }),
      supabaseFetch('orders', { query: 'select=*&order=created_at.desc' }),
      supabaseFetch('order_items', { query: 'select=*' })
    ]);

    state.categories = categories || [];
    state.products = products || [];
    state.coupons = coupons || [];
    state.promotions = promotions || [];
    state.customers = customers || [];
    state.orders = orders || [];
    state.orderItems = orderItems || [];

    renderCurrentView();
  } catch (err) {
    console.error("Falha ao carregar dados do banco:", err);
  }
}

// Formatting Utils
function formatCurrency(val) {
  const num = parseFloat(val) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-2-digit',
    month: '2-2-digit',
    year: 'numeric',
    hour: '2-2-digit',
    minute: '2-2-digit'
  });
}

function formatDateShort(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { day: '2-2-digit', month: '2-2-digit', year: 'numeric' });
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-error text-on-error' : 'bg-on-surface text-inverse-on-surface';
  const icon = type === 'error' ? 'error' : 'check_circle';

  toast.className = `${bgColor} px-space-lg py-space-md rounded-xl shadow-lg font-medium text-sm flex items-center gap-space-md animate-toast min-w-[280px]`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${icon}</span>
    <span class="flex-1">${message}</span>
    <button onclick="this.parentElement.remove()" class="opacity-70 hover:opacity-100">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 4000);
}

// Modal System
function openModal(htmlContent) {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = htmlContent;
  modalContainer.classList.remove('hidden');
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.classList.add('hidden');
  modalContainer.innerHTML = '';
}

// Router and Navigation
function handleNavigation() {
  const hash = window.location.hash.replace('#', '') || 'dashboard-vendas';
  state.currentRoute = hash;

  // Update nav active classes
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-nav') === hash) {
      el.classList.add('active', 'bg-primary-container', 'text-on-primary-container');
      el.classList.remove('text-on-surface-variant');
    } else {
      el.classList.remove('active', 'bg-primary-container', 'text-on-primary-container');
      el.classList.add('text-on-surface-variant');
    }
  });

  renderCurrentView();
}

function renderCurrentView() {
  const container = document.getElementById('content-container');
  if (!container) return;

  switch (state.currentRoute) {
    case 'dashboard-vendas':
      container.innerHTML = renderDashboardView();
      break;
    case 'produtos':
      container.innerHTML = renderProductsView();
      break;
    case 'categorias':
      container.innerHTML = renderCategoriesView();
      break;
    case 'cupons-de-desconto':
      container.innerHTML = renderCouponsView();
      break;
    case 'promocoes':
      container.innerHTML = renderPromotionsView();
      break;
    case 'clientes-cadastrados':
      container.innerHTML = renderCustomersView();
      break;
    default:
      container.innerHTML = renderDashboardView();
  }
}

/* ==========================================================================
   VIEW 1: DASHBOARD & VENDAS
   ========================================================================== */
function renderDashboardView() {
  const totalRevenue = state.orders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
  const totalOrdersCount = state.orders.length;
  const completedOrders = state.orders.filter(o => o.status === 'concluido' || o.status === 'pago').length;
  const pendingOrders = state.orders.filter(o => o.status === 'pendente' || o.status === 'processando').length;

  let filteredOrders = state.orders;
  if (state.selectedOrderFilter !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === state.selectedOrderFilter);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(o => {
      const customer = state.customers.find(c => c.id === o.customer_id);
      const custName = customer ? customer.full_name.toLowerCase() : '';
      return o.id.toLowerCase().includes(q) || custName.includes(q) || (o.status && o.status.toLowerCase().includes(q));
    });
  }

  return `
    <!-- Top Action Toolbar -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <div class="flex items-center gap-space-sm">
          <h1 class="text-2xl font-bold tracking-tight text-on-surface">Painel de Vendas & Gestão de Pedidos</h1>
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Realtime
          </span>
        </div>
        <p class="text-sm text-on-surface-variant">Visão geral do faturamento, novos pedidos de clientes e histórico de compras.</p>
      </div>
      <div class="flex items-center gap-space-md">
        <button onclick="openCreateOrderModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          <span>Registrar Nova Venda</span>
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="text-xs font-semibold uppercase tracking-wider text-outline">Faturamento Total</span>
          <div class="p-2 bg-primary-fixed/50 text-primary rounded-lg">
            <span class="material-symbols-outlined text-[20px]">payments</span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-on-surface tracking-tight">${formatCurrency(totalRevenue)}</div>
          <div class="text-xs text-outline mt-1">${totalOrdersCount} pedidos realizados</div>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="text-xs font-semibold uppercase tracking-wider text-outline">Total de Pedidos</span>
          <div class="p-2 bg-surface-container-high text-on-surface rounded-lg">
            <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-on-surface tracking-tight">${totalOrdersCount}</div>
          <div class="text-xs text-outline mt-1">${completedOrders} finalizados</div>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="text-xs font-semibold uppercase tracking-wider text-outline">Pedidos Concluídos</span>
          <div class="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <span class="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-emerald-700 tracking-tight">${completedOrders}</div>
          <div class="text-xs text-outline mt-1">Status concluído/pago</div>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="text-xs font-semibold uppercase tracking-wider text-outline">Pendentes / Processando</span>
          <div class="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <span class="material-symbols-outlined text-[20px]">pending</span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-amber-600 tracking-tight">${pendingOrders}</div>
          <div class="text-xs text-outline mt-1">Aguardando envio / pagamento</div>
        </div>
      </div>
    </div>

    <!-- Orders Table Card -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col overflow-hidden">
      <div class="p-space-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-surface-container-high/40">
        <div>
          <h2 class="text-lg font-bold text-on-surface">Gestão de Pedidos de Venda</h2>
          <p class="text-xs text-on-surface-variant">Acompanhamento e alteração de status dos pedidos em tempo real.</p>
        </div>
        <!-- Status Filter Buttons -->
        <div class="flex items-center bg-surface-container-low p-1 rounded-lg border border-surface-container-high/30 overflow-x-auto">
          <button onclick="setOrderFilter('all')" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${state.selectedOrderFilter === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">
            Todos (${state.orders.length})
          </button>
          <button onclick="setOrderFilter('pendente')" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${state.selectedOrderFilter === 'pendente' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">
            Pendentes
          </button>
          <button onclick="setOrderFilter('pago')" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${state.selectedOrderFilter === 'pago' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">
            Pagos
          </button>
          <button onclick="setOrderFilter('concluido')" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${state.selectedOrderFilter === 'concluido' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">
            Concluídos
          </button>
          <button onclick="setOrderFilter('cancelado')" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${state.selectedOrderFilter === 'cancelado' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">
            Cancelados
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider border-b border-surface-container-high/40">
            <tr>
              <th class="py-space-md px-space-lg">ID Pedido / Data</th>
              <th class="py-space-md px-space-lg">Cliente</th>
              <th class="py-space-md px-space-lg">Valor Subtotal / Desconto</th>
              <th class="py-space-md px-space-lg">Total Final</th>
              <th class="py-space-md px-space-lg">Status do Pedido</th>
              <th class="py-space-md px-space-lg text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container-high/30 text-on-surface">
            ${filteredOrders.length === 0 ? `
              <tr>
                <td colspan="6" class="py-12 text-center text-outline">
                  <span class="material-symbols-outlined text-4xl block mb-2 opacity-50">shopping_cart_checkout</span>
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ` : filteredOrders.map(order => {
              const customer = state.customers.find(c => c.id === order.customer_id);
              const coupon = state.coupons.find(c => c.id === order.coupon_id);

              let statusBadge = 'bg-gray-100 text-gray-800';
              if (order.status === 'concluido' || order.status === 'pago') {
                statusBadge = 'bg-emerald-100 text-emerald-800';
              } else if (order.status === 'pendente' || order.status === 'processando') {
                statusBadge = 'bg-amber-100 text-amber-800';
              } else if (order.status === 'cancelado') {
                statusBadge = 'bg-rose-100 text-rose-800';
              }

              return `
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <td class="py-space-md px-space-lg">
                    <div class="font-mono text-xs font-bold text-primary">#${order.id.substring(0, 8)}</div>
                    <div class="text-xs text-outline mt-0.5">${formatDate(order.created_at)}</div>
                  </td>
                  <td class="py-space-md px-space-lg">
                    <div class="font-semibold text-on-surface">${customer ? customer.full_name : 'Cliente Anônimo'}</div>
                    <div class="text-xs text-outline">${customer ? customer.email : '-'}</div>
                  </td>
                  <td class="py-space-md px-space-lg">
                    <div class="text-xs font-medium">Subtotal: ${formatCurrency(order.subtotal)}</div>
                    <div class="text-xs text-emerald-600 font-semibold">Desconto: -${formatCurrency(order.discount)} ${coupon ? `(${coupon.code})` : ''}</div>
                  </td>
                  <td class="py-space-md px-space-lg">
                    <div class="font-bold text-base text-on-surface">${formatCurrency(order.total)}</div>
                  </td>
                  <td class="py-space-md px-space-lg">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" class="px-2.5 py-1 rounded-md text-xs font-semibold ${statusBadge} border border-transparent focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                      <option value="pendente" ${order.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                      <option value="pago" ${order.status === 'pago' ? 'selected' : ''}>Pago</option>
                      <option value="processando" ${order.status === 'processando' ? 'selected' : ''}>Processando</option>
                      <option value="concluido" ${order.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                      <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                  </td>
                  <td class="py-space-md px-space-lg text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button onclick="viewOrderDetails('${order.id}')" title="Ver Detalhes do Pedido" class="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded transition-colors">
                        <span class="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onclick="deleteOrder('${order.id}')" title="Excluir Pedido" class="p-1.5 hover:bg-rose-50 text-outline hover:text-error rounded transition-colors">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setOrderFilter(filter) {
  state.selectedOrderFilter = filter;
  renderCurrentView();
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await supabaseFetch(`orders?id=eq.${orderId}`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
    const order = state.orders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    showToast(`Status do pedido atualizado para "${newStatus}"!`);
    renderCurrentView();
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.")) return;
  try {
    // Delete items first if needed
    await supabaseFetch(`order_items?order_id=eq.${orderId}`, { method: 'DELETE' });
    await supabaseFetch(`orders?id=eq.${orderId}`, { method: 'DELETE' });
    state.orders = state.orders.filter(o => o.id !== orderId);
    showToast("Pedido excluído com sucesso.");
    renderCurrentView();
  } catch (err) {
    console.error("Erro ao excluir pedido:", err);
  }
}

function viewOrderDetails(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const customer = state.customers.find(c => c.id === order.customer_id);
  const coupon = state.coupons.find(c => c.id === order.coupon_id);
  const items = state.orderItems.filter(i => i.order_id === orderId);

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
          <div>
            <h3 class="font-bold text-lg text-on-surface">Detalhes do Pedido #${order.id.substring(0, 8)}</h3>
            <p class="text-xs text-outline">${formatDate(order.created_at)}</p>
          </div>
        </div>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-space-xl flex flex-col gap-space-lg max-h-[75vh] overflow-y-auto">
        <!-- Customer Details Card -->
        <div class="bg-surface-container-low/50 p-space-lg rounded-xl border border-surface-container-high/30 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-outline uppercase font-semibold block mb-0.5">Cliente</span>
            <span class="font-bold text-sm text-on-surface block">${customer ? customer.full_name : 'Cliente Não Cadastrado'}</span>
            <span class="text-on-surface-variant block">${customer ? customer.email : '-'}</span>
            <span class="text-on-surface-variant block">${customer ? customer.phone || 'Sem telefone' : ''}</span>
          </div>
          <div>
            <span class="text-outline uppercase font-semibold block mb-0.5">CPF / Endereço</span>
            <span class="text-on-surface font-medium block">${customer ? customer.cpf || 'Não informado' : '-'}</span>
            <span class="text-on-surface-variant block leading-tight mt-1">${customer ? customer.address || 'Sem endereço cadastrado' : ''}</span>
          </div>
        </div>

        <!-- Order Items Table -->
        <div>
          <h4 class="text-xs font-bold text-outline uppercase tracking-wider mb-2">Itens do Pedido</h4>
          <div class="border border-surface-container-high/40 rounded-xl overflow-hidden">
            <table class="w-full text-xs text-left">
              <thead class="bg-surface-container-low text-outline font-semibold border-b border-surface-container-high/40">
                <tr>
                  <th class="p-3">Produto</th>
                  <th class="p-3 text-center">Qtd</th>
                  <th class="p-3 text-right">Preço Unit.</th>
                  <th class="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-container-high/30">
                ${items.length === 0 ? `
                  <tr><td colspan="4" class="p-4 text-center text-outline">Nenhum item registrado neste pedido.</td></tr>
                ` : items.map(item => `
                  <tr>
                    <td class="p-3 font-medium text-on-surface">${item.product_name || 'Produto'}</td>
                    <td class="p-3 text-center">${item.quantity}</td>
                    <td class="p-3 text-right">${formatCurrency(item.unit_price)}</td>
                    <td class="p-3 text-right font-semibold">${formatCurrency(item.quantity * item.unit_price)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-1 text-sm border border-surface-container-high/40">
          <div class="flex justify-between text-on-surface-variant">
            <span>Subtotal dos Produtos:</span>
            <span class="font-medium text-on-surface">${formatCurrency(order.subtotal)}</span>
          </div>
          <div class="flex justify-between text-emerald-700">
            <span>Desconto Aplicado ${coupon ? `(${coupon.code})` : ''}:</span>
            <span class="font-semibold">-${formatCurrency(order.discount)}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-surface-container-high/60 mt-1">
            <span>Valor Total Pago:</span>
            <span class="text-primary">${formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div class="p-space-lg bg-surface-container-low/50 border-t border-surface-container-high/50 flex justify-end">
        <button onclick="closeModal()" class="px-space-xl py-2 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg hover:bg-surface-container transition-all">
          Fechar
        </button>
      </div>
    </div>
  `;

  openModal(modalHtml);
}

function openCreateOrderModal() {
  if (state.customers.length === 0) {
    showToast("Cadastre pelo menos um cliente para registrar vendas.", "error");
  }

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[24px]">add_shopping_cart</span>
          <h3 class="font-bold text-lg text-on-surface">Registrar Nova Venda / Pedido</h3>
        </div>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="order-form" onsubmit="handleCreateOrderSubmit(event)" class="p-space-xl flex flex-col gap-space-lg max-h-[75vh] overflow-y-auto">
        <!-- Customer Select -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Cliente *</label>
          <select id="order-customer-id" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high">
            <option value="">-- Selecione o Cliente --</option>
            ${state.customers.map(c => `<option value="${c.id}">${c.full_name} (${c.email})</option>`).join('')}
          </select>
        </div>

        <!-- Coupon Select (Optional) -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Cupom de Desconto (Opcional)</label>
          <select id="order-coupon-id" onchange="calculateOrderTotals()" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high">
            <option value="">Nenhum Cupom</option>
            ${state.coupons.filter(c => c.active).map(c => `
              <option value="${c.id}" data-type="${c.type}" data-val="${c.value}" data-min="${c.min_cart_value || 0}">
                ${c.code} - ${c.type === 'percent' ? `${c.value}% OFF` : `R$ ${c.value} OFF`} (Mín: ${formatCurrency(c.min_cart_value)})
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Products List Builder -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Produtos do Pedido *</label>
            <button type="button" onclick="addOrderItemRow()" class="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">add</span> Adicionar Produto
            </button>
          </div>
          <div id="order-items-builder" class="flex flex-col gap-2">
            <!-- Dynamic Item Rows -->
          </div>
        </div>

        <!-- Order Total Preview -->
        <div class="bg-surface-container-low p-space-lg rounded-xl border border-surface-container-high/40 flex flex-col gap-1 text-sm">
          <div class="flex justify-between text-on-surface-variant">
            <span>Subtotal:</span>
            <span id="order-preview-subtotal" class="font-medium text-on-surface">R$ 0,00</span>
          </div>
          <div class="flex justify-between text-emerald-700">
            <span>Desconto:</span>
            <span id="order-preview-discount" class="font-semibold">-R$ 0,00</span>
          </div>
          <div class="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-surface-container-high/60 mt-1">
            <span>Total Final:</span>
            <span id="order-preview-total" class="text-primary">R$ 0,00</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-2 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">
            Cancelar
          </button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
  addOrderItemRow(); // Add initial item row
}

function addOrderItemRow() {
  const container = document.getElementById('order-items-builder');
  if (!container) return;

  const rowId = 'row-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const rowHtml = `
    <div id="${rowId}" class="order-item-row flex items-center gap-2 bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high">
      <select onchange="calculateOrderTotals()" class="item-product-id flex-1 h-9 px-2 bg-surface-container-low rounded text-xs text-on-surface focus:outline-none border border-surface-container-high" required>
        <option value="">-- Selecione o Produto --</option>
        ${state.products.filter(p => p.active && p.stock > 0).map(p => `
          <option value="${p.id}" data-price="${p.price}" data-name="${p.name}">
            ${p.name} - ${formatCurrency(p.price)} (Estoque: ${p.stock})
          </option>
        `).join('')}
      </select>
      <input type="number" min="1" value="1" onchange="calculateOrderTotals()" oninput="calculateOrderTotals()" class="item-qty w-20 h-9 px-2 bg-surface-container-low rounded text-xs text-center text-on-surface focus:outline-none border border-surface-container-high" required />
      <button type="button" onclick="document.getElementById('${rowId}').remove(); calculateOrderTotals();" class="p-1 text-outline hover:text-error rounded">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', rowHtml);
  calculateOrderTotals();
}

function calculateOrderTotals() {
  let subtotal = 0;
  const rows = document.querySelectorAll('.order-item-row');

  rows.forEach(row => {
    const select = row.querySelector('.item-product-id');
    const qtyInput = row.querySelector('.item-qty');
    if (select && select.value && qtyInput) {
      const selectedOpt = select.options[select.selectedIndex];
      const price = parseFloat(selectedOpt.getAttribute('data-price')) || 0;
      const qty = parseInt(qtyInput.value) || 1;
      subtotal += price * qty;
    }
  });

  let discount = 0;
  const couponSelect = document.getElementById('order-coupon-id');
  if (couponSelect && couponSelect.value) {
    const selectedCouponOpt = couponSelect.options[couponSelect.selectedIndex];
    const type = selectedCouponOpt.getAttribute('data-type');
    const val = parseFloat(selectedCouponOpt.getAttribute('data-val')) || 0;
    const minVal = parseFloat(selectedCouponOpt.getAttribute('data-min')) || 0;

    if (subtotal >= minVal) {
      if (type === 'percent') {
        discount = (subtotal * val) / 100;
      } else {
        discount = val;
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  const subtotalEl = document.getElementById('order-preview-subtotal');
  const discountEl = document.getElementById('order-preview-discount');
  const totalEl = document.getElementById('order-preview-total');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (discountEl) discountEl.textContent = `-${formatCurrency(discount)}`;
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

async function handleCreateOrderSubmit(e) {
  e.preventDefault();

  const customerId = document.getElementById('order-customer-id').value;
  const couponId = document.getElementById('order-coupon-id').value || null;

  const rows = document.querySelectorAll('.order-item-row');
  if (rows.length === 0) {
    showToast("Adicione pelo menos um produto ao pedido.", "error");
    return;
  }

  const items = [];
  let subtotal = 0;

  for (const row of rows) {
    const select = row.querySelector('.item-product-id');
    const qtyInput = row.querySelector('.item-qty');
    if (!select.value) continue;

    const opt = select.options[select.selectedIndex];
    const pId = select.value;
    const pName = opt.getAttribute('data-name');
    const pPrice = parseFloat(opt.getAttribute('data-price')) || 0;
    const qty = parseInt(qtyInput.value) || 1;

    items.push({
      product_id: pId,
      product_name: pName,
      unit_price: pPrice,
      quantity: qty
    });

    subtotal += pPrice * qty;
  }

  if (items.length === 0) {
    showToast("Selecione um produto válido.", "error");
    return;
  }

  let discount = 0;
  if (couponId) {
    const couponSelect = document.getElementById('order-coupon-id');
    const opt = couponSelect.options[couponSelect.selectedIndex];
    const type = opt.getAttribute('data-type');
    const val = parseFloat(opt.getAttribute('data-val')) || 0;
    const minVal = parseFloat(opt.getAttribute('data-min')) || 0;

    if (subtotal >= minVal) {
      if (type === 'percent') {
        discount = (subtotal * val) / 100;
      } else {
        discount = val;
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  try {
    // 1. Insert Order
    const newOrderArray = await supabaseFetch('orders', {
      method: 'POST',
      body: {
        customer_id: customerId,
        coupon_id: couponId,
        subtotal: subtotal,
        discount: discount,
        total: total,
        status: 'pendente'
      }
    });

    const newOrder = newOrderArray[0];

    // 2. Insert Order Items
    for (const item of items) {
      await supabaseFetch('order_items', {
        method: 'POST',
        body: {
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.unit_price,
          quantity: item.quantity
        }
      });

      // Optionally reduce stock
      const prod = state.products.find(p => p.id === item.product_id);
      if (prod) {
        const updatedStock = Math.max(0, prod.stock - item.quantity);
        await supabaseFetch(`products?id=eq.${item.product_id}`, {
          method: 'PATCH',
          body: { stock: updatedStock }
        });
      }
    }

    showToast("Pedido criado com sucesso!");
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao registrar pedido:", err);
  }
}

/* ==========================================================================
   VIEW 2: PRODUTOS & ESTOQUE
   ========================================================================== */
function renderProductsView() {
  let filteredProducts = state.products;

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }

  return `
    <!-- Top Context Header -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <h1 class="text-2xl font-bold tracking-tight text-on-surface">Catálogo de Produtos & Estoque</h1>
        <p class="text-sm text-on-surface-variant">Gerenciamento completo do cadastro de produtos, preços, estoque e fotos.</p>
      </div>
      <div class="flex items-center gap-space-md">
        <button onclick="openProductModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>
    </div>

    <!-- Products Grid / Table -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider border-b border-surface-container-high/40">
            <tr>
              <th class="py-space-md px-space-lg">Foto / Produto</th>
              <th class="py-space-md px-space-lg">Categoria</th>
              <th class="py-space-md px-space-lg">Preço</th>
              <th class="py-space-md px-space-lg">Estoque</th>
              <th class="py-space-md px-space-lg">Status Vitrine</th>
              <th class="py-space-md px-space-lg text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container-high/30 text-on-surface">
            ${filteredProducts.length === 0 ? `
              <tr>
                <td colspan="6" class="py-12 text-center text-outline">
                  <span class="material-symbols-outlined text-4xl block mb-2 opacity-50">inventory_2</span>
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ` : filteredProducts.map(p => {
              const cat = state.categories.find(c => c.id === p.category_id);
              const isOutOfStock = p.stock <= 0;
              const isLowStock = p.stock > 0 && p.stock <= 5;

              return `
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <td class="py-space-md px-space-lg">
                    <div class="flex items-center gap-space-md">
                      <div class="w-12 h-12 rounded-lg bg-surface-container-low border border-surface-container-high shrink-0 overflow-hidden flex items-center justify-center">
                        ${p.photo_path ? `
                          <img src="${p.photo_path}" alt="${p.name}" class="w-full h-full object-cover" />
                        ` : `
                          <span class="material-symbols-outlined text-outline text-[24px]">image</span>
                        `}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-bold text-on-surface">${p.name}</span>
                        <span class="text-xs text-outline line-clamp-1">${p.description || 'Sem descrição'}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-space-md px-space-lg">
                    <span class="px-2.5 py-1 bg-surface-container text-on-surface-variant font-semibold text-xs rounded-md">
                      ${cat ? cat.name : 'Sem Categoria'}
                    </span>
                  </td>
                  <td class="py-space-md px-space-lg font-bold text-on-surface">
                    ${formatCurrency(p.price)}
                  </td>
                  <td class="py-space-md px-space-lg">
                    ${isOutOfStock ? `
                      <span class="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-md">Sem Estoque (0)</span>
                    ` : isLowStock ? `
                      <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">Estoque Baixo (${p.stock})</span>
                    ` : `
                      <span class="font-semibold text-on-surface">${p.stock} un.</span>
                    `}
                  </td>
                  <td class="py-space-md px-space-lg">
                    ${p.active ? `
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">Ativo</span>
                    ` : `
                      <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">Inativo</span>
                    `}
                  </td>
                  <td class="py-space-md px-space-lg text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button onclick="openProductModal('${p.id}')" title="Editar Produto" class="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded transition-colors">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onclick="deleteProduct('${p.id}')" title="Excluir Produto" class="p-1.5 hover:bg-rose-50 text-outline hover:text-error rounded transition-colors">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openProductModal(productId = null) {
  const product = productId ? state.products.find(p => p.id === productId) : null;

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <h3 class="font-bold text-lg text-on-surface">${product ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="product-form" onsubmit="handleProductSubmit(event, '${productId || ''}')" class="p-space-xl flex flex-col gap-space-md max-h-[75vh] overflow-y-auto">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Nome do Produto *</label>
          <input type="text" id="prod-name" value="${product ? product.name : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="Ex: Notebook CompFast X15" />
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Categoria *</label>
            <select id="prod-category" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high">
              <option value="">-- Selecione --</option>
              ${state.categories.map(c => `<option value="${c.id}" ${product && product.category_id === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Preço (R$) *</label>
            <input type="number" step="0.01" id="prod-price" value="${product ? product.price : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="0.00" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Quantidade em Estoque *</label>
            <input type="number" id="prod-stock" value="${product ? product.stock : 0}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="0" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Status na Vitrine</label>
            <select id="prod-active" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high">
              <option value="true" ${!product || product.active ? 'selected' : ''}>Ativo</option>
              <option value="false" ${product && !product.active ? 'selected' : ''}>Inativo</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Descrição do Produto</label>
          <textarea id="prod-description" rows="3" class="w-full p-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="Especificações técnicas, diferenciais...">${product ? product.description || '' : ''}</textarea>
        </div>

        <!-- Photo Upload / Preview -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Foto do Produto (Salva no Banco de Dados)</label>
          <input type="file" id="prod-photo-file" accept="image/*" onchange="previewProductPhoto(event)" class="text-xs text-outline file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary" />
          <input type="hidden" id="prod-photo-path" value="${product ? product.photo_path || '' : ''}" />

          <div id="photo-preview-box" class="mt-2 w-24 h-24 rounded-lg bg-surface-container-low border border-surface-container-high overflow-hidden flex items-center justify-center">
            ${product && product.photo_path ? `
              <img src="${product.photo_path}" class="w-full h-full object-cover" />
            ` : `
              <span class="text-xs text-outline text-center px-1">Sem Imagem</span>
            `}
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-4 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">Cancelar</button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">Salvar Produto</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

function previewProductPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Str = e.target.result;
    document.getElementById('prod-photo-path').value = base64Str;
    const box = document.getElementById('photo-preview-box');
    box.innerHTML = `<img src="${base64Str}" class="w-full h-full object-cover" />`;
  };
  reader.readAsDataURL(file);
}

async function handleProductSubmit(e, productId) {
  e.preventDefault();

  const body = {
    name: document.getElementById('prod-name').value,
    category_id: document.getElementById('prod-category').value,
    price: parseFloat(document.getElementById('prod-price').value),
    stock: parseInt(document.getElementById('prod-stock').value),
    active: document.getElementById('prod-active').value === 'true',
    description: document.getElementById('prod-description').value,
    photo_path: document.getElementById('prod-photo-path').value || null
  };

  try {
    if (productId) {
      await supabaseFetch(`products?id=eq.${productId}`, {
        method: 'PATCH',
        body
      });
      showToast("Produto atualizado com sucesso!");
    } else {
      await supabaseFetch('products', {
        method: 'POST',
        body
      });
      showToast("Novo produto cadastrado!");
    }
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao salvar produto:", err);
  }
}

async function deleteProduct(id) {
  if (!confirm("Deseja realmente excluir este produto?")) return;
  try {
    await supabaseFetch(`products?id=eq.${id}`, { method: 'DELETE' });
    showToast("Produto excluído.");
    await loadAllData();
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
  }
}

/* ==========================================================================
   VIEW 3: CATEGORIAS
   ========================================================================== */
function renderCategoriesView() {
  let filtered = state.categories;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
  }

  return `
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <h1 class="text-2xl font-bold tracking-tight text-on-surface">Cadastro de Categorias</h1>
        <p class="text-sm text-on-surface-variant">Organize a hierarquia do seu e-commerce em departamentos e coleções.</p>
      </div>
      <button onclick="openCategoryModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Nova Categoria</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
      ${filtered.length === 0 ? `
        <div class="col-span-full py-12 text-center text-outline bg-surface-container-lowest rounded-xl border border-surface-container-high/40">
          Nenhuma categoria cadastrada.
        </div>
      ` : filtered.map(c => {
        const productCount = state.products.filter(p => p.category_id === c.id).length;
        return `
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-base text-on-surface">${c.name}</span>
                ${c.active ? `
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Ativa</span>
                ` : `
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">Inativa</span>
                `}
              </div>
              <p class="text-xs text-on-surface-variant min-h-[36px]">${c.description || 'Sem descrição cadastrada.'}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-surface-container-high/40 flex items-center justify-between">
              <span class="text-xs text-outline font-semibold">${productCount} produto(s) vinculados</span>
              <div class="flex items-center gap-1">
                <button onclick="openCategoryModal('${c.id}')" class="p-1 hover:bg-surface-container text-on-surface-variant rounded">
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button onclick="deleteCategory('${c.id}')" class="p-1 hover:bg-rose-50 text-outline hover:text-error rounded">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function openCategoryModal(categoryId = null) {
  const cat = categoryId ? state.categories.find(c => c.id === categoryId) : null;

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <h3 class="font-bold text-lg text-on-surface">${cat ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="category-form" onsubmit="handleCategorySubmit(event, '${categoryId || ''}')" class="p-space-xl flex flex-col gap-space-md">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Nome da Categoria *</label>
          <input type="text" id="cat-name" value="${cat ? cat.name : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="Ex: Monitores" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Descrição</label>
          <textarea id="cat-description" rows="3" class="w-full p-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="Breve resumo da categoria...">${cat ? cat.description || '' : ''}</textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Status</label>
          <select id="cat-active" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high">
            <option value="true" ${!cat || cat.active ? 'selected' : ''}>Ativa</option>
            <option value="false" ${cat && !cat.active ? 'selected' : ''}>Inativa</option>
          </select>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-3 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">Cancelar</button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">Salvar</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

async function handleCategorySubmit(e, categoryId) {
  e.preventDefault();

  const body = {
    name: document.getElementById('cat-name').value,
    description: document.getElementById('cat-description').value,
    active: document.getElementById('cat-active').value === 'true'
  };

  try {
    if (categoryId) {
      await supabaseFetch(`categories?id=eq.${categoryId}`, { method: 'PATCH', body });
      showToast("Categoria atualizada!");
    } else {
      await supabaseFetch('categories', { method: 'POST', body });
      showToast("Categoria cadastrada!");
    }
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao salvar categoria:", err);
  }
}

async function deleteCategory(id) {
  if (!confirm("Deseja realmente excluir esta categoria?")) return;
  try {
    await supabaseFetch(`categories?id=eq.${id}`, { method: 'DELETE' });
    showToast("Categoria excluída.");
    await loadAllData();
  } catch (err) {
    console.error("Erro ao excluir categoria:", err);
  }
}

/* ==========================================================================
   VIEW 4: CUPONS DE DESCONTO
   ========================================================================== */
function renderCouponsView() {
  let filtered = state.coupons;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.code.toLowerCase().includes(q));
  }

  return `
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <h1 class="text-2xl font-bold tracking-tight text-on-surface">Gestão de Cupons de Desconto</h1>
        <p class="text-sm text-on-surface-variant">Crie códigos promocionais, defina limites de uso e regras de valor mínimo no carrinho.</p>
      </div>
      <button onclick="openCouponModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Criar Novo Cupom</span>
      </button>
    </div>

    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40 overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider border-b border-surface-container-high/40">
          <tr>
            <th class="py-space-md px-space-lg">Código Cupom</th>
            <th class="py-space-md px-space-lg">Tipo & Valor Desconto</th>
            <th class="py-space-md px-space-lg">Carrinho Mínimo</th>
            <th class="py-space-md px-space-lg">Usos / Limite Max</th>
            <th class="py-space-md px-space-lg">Validade</th>
            <th class="py-space-md px-space-lg">Status</th>
            <th class="py-space-md px-space-lg text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-high/30 text-on-surface">
          ${filtered.length === 0 ? `
            <tr><td colspan="7" class="py-12 text-center text-outline">Nenhum cupom cadastrado.</td></tr>
          ` : filtered.map(c => `
            <tr class="hover:bg-surface-container-low/50 transition-colors">
              <td class="py-space-md px-space-lg">
                <span class="font-mono font-bold text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-md text-xs uppercase">${c.code}</span>
              </td>
              <td class="py-space-md px-space-lg font-bold">
                ${c.type === 'percent' ? `${c.value}% OFF` : `${formatCurrency(c.value)} OFF`}
              </td>
              <td class="py-space-md px-space-lg font-medium">
                ${formatCurrency(c.min_cart_value || 0)}
              </td>
              <td class="py-space-md px-space-lg text-xs font-medium">
                ${c.used_count || 0} / ${c.max_uses || '∞'}
              </td>
              <td class="py-space-md px-space-lg text-xs text-outline">
                ${c.valid_until ? formatDateShort(c.valid_until) : 'Sem expiração'}
              </td>
              <td class="py-space-md px-space-lg">
                ${c.active ? `
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">Ativo</span>
                ` : `
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">Inativo</span>
                `}
              </td>
              <td class="py-space-md px-space-lg text-right">
                <div class="flex items-center justify-end gap-1">
                  <button onclick="openCouponModal('${c.id}')" class="p-1 hover:bg-surface-container text-on-surface-variant rounded">
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button onclick="deleteCoupon('${c.id}')" class="p-1 hover:bg-rose-50 text-outline hover:text-error rounded">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openCouponModal(couponId = null) {
  const coupon = couponId ? state.coupons.find(c => c.id === couponId) : null;

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <h3 class="font-bold text-lg text-on-surface">${coupon ? 'Editar Cupom' : 'Criar Novo Cupom'}</h3>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="coupon-form" onsubmit="handleCouponSubmit(event, '${couponId || ''}')" class="p-space-xl flex flex-col gap-space-md">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Código do Cupom *</label>
          <input type="text" id="cup-code" value="${coupon ? coupon.code : ''}" required uppercase class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container-high" placeholder="Ex: DESCONTO10" />
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Tipo de Desconto *</label>
            <select id="cup-type" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
              <option value="percent" ${coupon && coupon.type === 'percent' ? 'selected' : ''}>Porcentagem (%)</option>
              <option value="fixed" ${coupon && coupon.type === 'fixed' ? 'selected' : ''}>Valor Fixo (R$)</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Valor do Desconto *</label>
            <input type="number" step="0.01" id="cup-value" value="${coupon ? coupon.value : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="10" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Valor Mínimo Carrinho (R$)</label>
            <input type="number" step="0.01" id="cup-min" value="${coupon ? coupon.min_cart_value || 0 : 0}" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="100.00" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Limite Máximo de Usos</label>
            <input type="number" id="cup-max" value="${coupon ? coupon.max_uses || '' : ''}" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="Ilimitado" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Válido Até (Expiração)</label>
            <input type="date" id="cup-valid" value="${coupon && coupon.valid_until ? coupon.valid_until.substring(0, 10) : ''}" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Status</label>
            <select id="cup-active" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
              <option value="true" ${!coupon || coupon.active ? 'selected' : ''}>Ativo</option>
              <option value="false" ${coupon && !coupon.active ? 'selected' : ''}>Inativo</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-3 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">Cancelar</button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">Salvar Cupom</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

async function handleCouponSubmit(e, couponId) {
  e.preventDefault();

  const validUntilVal = document.getElementById('cup-valid').value;

  const body = {
    code: document.getElementById('cup-code').value.toUpperCase().trim(),
    type: document.getElementById('cup-type').value,
    value: parseFloat(document.getElementById('cup-value').value),
    min_cart_value: parseFloat(document.getElementById('cup-min').value) || 0,
    max_uses: document.getElementById('cup-max').value ? parseInt(document.getElementById('cup-max').value) : null,
    valid_until: validUntilVal ? new Date(validUntilVal).toISOString() : null,
    active: document.getElementById('cup-active').value === 'true'
  };

  try {
    if (couponId) {
      await supabaseFetch(`coupons?id=eq.${couponId}`, { method: 'PATCH', body });
      showToast("Cupom atualizado!");
    } else {
      await supabaseFetch('coupons', { method: 'POST', body });
      showToast("Cupom criado com sucesso!");
    }
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao salvar cupom:", err);
  }
}

async function deleteCoupon(id) {
  if (!confirm("Excluir este cupom?")) return;
  try {
    await supabaseFetch(`coupons?id=eq.${id}`, { method: 'DELETE' });
    showToast("Cupom excluído.");
    await loadAllData();
  } catch (err) {
    console.error("Erro ao excluir cupom:", err);
  }
}

/* ==========================================================================
   VIEW 5: PROMOÇÕES (Com expiração, por Produto ou Categoria)
   ========================================================================== */
function renderPromotionsView() {
  const now = new Date();

  return `
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <h1 class="text-2xl font-bold tracking-tight text-on-surface">Gestão de Promoções & Campanhas</h1>
        <p class="text-sm text-on-surface-variant">Crie ofertas temporárias aplicadas diretamente a um produto específico ou a toda uma categoria.</p>
      </div>
      <button onclick="openPromotionModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Criar Nova Promoção</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
      ${state.promotions.length === 0 ? `
        <div class="col-span-full py-12 text-center text-outline bg-surface-container-lowest rounded-xl border border-surface-container-high/40">
          Nenhuma promoção ativa ou agendada.
        </div>
      ` : state.promotions.map(p => {
        const product = p.product_id ? state.products.find(prod => prod.id === p.product_id) : null;
        const category = p.category_id ? state.categories.find(cat => cat.id === p.category_id) : null;

        const isExpired = p.expires_at && new Date(p.expires_at) < now;
        const isActive = p.active && !isExpired;

        return `
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="px-2.5 py-1 ${p.product_id ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'} text-xs font-bold rounded-md uppercase">
                  ${p.product_id ? 'Por Produto' : 'Por Categoria'}
                </span>
                ${isActive ? `
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ativa
                  </span>
                ` : `
                  <span class="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">Expirada / Inativa</span>
                `}
              </div>

              <h3 class="font-bold text-lg text-on-surface mb-1">
                Desconto de ${p.type === 'percent' ? `${p.value}%` : `R$ ${p.value}`}
              </h3>

              <div class="text-xs text-on-surface-variant font-medium mb-3">
                ${product ? `Aplicado a: <strong class="text-on-surface">${product.name}</strong>` : ''}
                ${category ? `Aplicado a Categoria: <strong class="text-on-surface">${category.name}</strong>` : ''}
              </div>

              <div class="bg-surface-container-low p-2.5 rounded-lg text-xs flex flex-col gap-1 border border-surface-container-high/40 text-outline">
                <div>Início: <span class="text-on-surface font-medium">${formatDate(p.starts_at)}</span></div>
                <div>Expiração: <span class="text-on-surface font-medium">${formatDate(p.expires_at)}</span></div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-surface-container-high/40 flex items-center justify-end gap-1">
              <button onclick="openPromotionModal('${p.id}')" class="p-1 hover:bg-surface-container text-on-surface-variant rounded">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button onclick="deletePromotion('${p.id}')" class="p-1 hover:bg-rose-50 text-outline hover:text-error rounded">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function openPromotionModal(promoId = null) {
  const promo = promoId ? state.promotions.find(p => p.id === promoId) : null;

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <h3 class="font-bold text-lg text-on-surface">${promo ? 'Editar Promoção' : 'Criar Nova Promoção'}</h3>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="promo-form" onsubmit="handlePromotionSubmit(event, '${promoId || ''}')" class="p-space-xl flex flex-col gap-space-md">
        <!-- Target Selector (Product vs Category) -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Alvo da Promoção *</label>
          <select id="promo-target-type" onchange="togglePromoTargetInputs(this.value)" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
            <option value="product" ${!promo || promo.product_id ? 'selected' : ''}>Produto Específico</option>
            <option value="category" ${promo && promo.category_id ? 'selected' : ''}>Toda uma Categoria</option>
          </select>
        </div>

        <div id="promo-product-container" class="flex flex-col gap-1 ${promo && promo.category_id ? 'hidden' : ''}">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Selecione o Produto *</label>
          <select id="promo-product-id" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
            <option value="">-- Escolha o Produto --</option>
            ${state.products.map(p => `<option value="${p.id}" ${promo && promo.product_id === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
        </div>

        <div id="promo-category-container" class="flex flex-col gap-1 ${!promo || promo.product_id ? 'hidden' : ''}">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Selecione a Categoria *</label>
          <select id="promo-category-id" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
            <option value="">-- Escolha a Categoria --</option>
            ${state.categories.map(c => `<option value="${c.id}" ${promo && promo.category_id === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Tipo *</label>
            <select id="promo-type" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high">
              <option value="percent" ${promo && promo.type === 'percent' ? 'selected' : ''}>Porcentagem (%)</option>
              <option value="fixed" ${promo && promo.type === 'fixed' ? 'selected' : ''}>Valor Fixo (R$)</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Valor do Desconto *</label>
            <input type="number" step="0.01" id="promo-value" value="${promo ? promo.value : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="15" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Data de Início *</label>
            <input type="datetime-local" id="promo-starts" value="${promo && promo.starts_at ? promo.starts_at.substring(0, 16) : new Date().toISOString().substring(0, 16)}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none border border-surface-container-high" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">Data de Expiração *</label>
            <input type="datetime-local" id="promo-expires" value="${promo && promo.expires_at ? promo.expires_at.substring(0, 16) : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none border border-surface-container-high" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-3 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">Cancelar</button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">Salvar Promoção</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

function togglePromoTargetInputs(type) {
  const prodBox = document.getElementById('promo-product-container');
  const catBox = document.getElementById('promo-category-container');
  if (type === 'product') {
    prodBox.classList.remove('hidden');
    catBox.classList.add('hidden');
  } else {
    prodBox.classList.add('hidden');
    catBox.classList.remove('hidden');
  }
}

async function handlePromotionSubmit(e, promoId) {
  e.preventDefault();

  const targetType = document.getElementById('promo-target-type').value;
  const productId = targetType === 'product' ? document.getElementById('promo-product-id').value : null;
  const categoryId = targetType === 'category' ? document.getElementById('promo-category-id').value : null;

  if (targetType === 'product' && !productId) {
    showToast("Selecione um produto.", "error");
    return;
  }
  if (targetType === 'category' && !categoryId) {
    showToast("Selecione uma categoria.", "error");
    return;
  }

  const startsVal = document.getElementById('promo-starts').value;
  const expiresVal = document.getElementById('promo-expires').value;

  const body = {
    product_id: productId,
    category_id: categoryId,
    type: document.getElementById('promo-type').value,
    value: parseFloat(document.getElementById('promo-value').value),
    starts_at: new Date(startsVal).toISOString(),
    expires_at: new Date(expiresVal).toISOString(),
    active: true
  };

  try {
    if (promoId) {
      await supabaseFetch(`promotions?id=eq.${promoId}`, { method: 'PATCH', body });
      showToast("Promoção atualizada!");
    } else {
      await supabaseFetch('promotions', { method: 'POST', body });
      showToast("Nova promoção cadastrada!");
    }
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao salvar promoção:", err);
  }
}

async function deletePromotion(id) {
  if (!confirm("Excluir esta promoção?")) return;
  try {
    await supabaseFetch(`promotions?id=eq.${id}`, { method: 'DELETE' });
    showToast("Promoção excluída.");
    await loadAllData();
  } catch (err) {
    console.error("Erro ao excluir promoção:", err);
  }
}

/* ==========================================================================
   VIEW 6: CLIENTES CADASTRADOS
   ========================================================================== */
function renderCustomersView() {
  let filtered = state.customers;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.cpf && c.cpf.includes(q)));
  }

  return `
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container-high/40">
      <div class="flex flex-col gap-space-2xs">
        <h1 class="text-2xl font-bold tracking-tight text-on-surface">Gestão de Clientes Cadastrados</h1>
        <p class="text-sm text-on-surface-variant">Base centralizada de clientes da loja, dados de contato e histórico de compras.</p>
      </div>
      <button onclick="openCustomerModal()" class="px-space-lg py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[18px]">person_add</span>
        <span>Novo Cliente</span>
      </button>
    </div>

    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40 overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider border-b border-surface-container-high/40">
          <tr>
            <th class="py-space-md px-space-lg">Nome / E-mail</th>
            <th class="py-space-md px-space-lg">CPF</th>
            <th class="py-space-md px-space-lg">Telefone</th>
            <th class="py-space-md px-space-lg">Endereço</th>
            <th class="py-space-md px-space-lg">Total Pedidos</th>
            <th class="py-space-md px-space-lg text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-high/30 text-on-surface">
          ${filtered.length === 0 ? `
            <tr><td colspan="6" class="py-12 text-center text-outline">Nenhum cliente encontrado.</td></tr>
          ` : filtered.map(c => {
            const custOrders = state.orders.filter(o => o.customer_id === c.id);
            const totalSpent = custOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

            return `
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td class="py-space-md px-space-lg">
                  <div class="font-bold text-on-surface">${c.full_name}</div>
                  <div class="text-xs text-outline">${c.email}</div>
                </td>
                <td class="py-space-md px-space-lg font-mono text-xs">
                  ${c.cpf || '-'}
                </td>
                <td class="py-space-md px-space-lg text-xs">
                  ${c.phone || '-'}
                </td>
                <td class="py-space-md px-space-lg text-xs text-outline line-clamp-1 max-w-xs">
                  ${c.address || '-'}
                </td>
                <td class="py-space-md px-space-lg">
                  <span class="font-bold text-on-surface">${custOrders.length} pedido(s)</span>
                  <div class="text-xs text-emerald-700 font-semibold">${formatCurrency(totalSpent)}</div>
                </td>
                <td class="py-space-md px-space-lg text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button onclick="openCustomerModal('${c.id}')" class="p-1 hover:bg-surface-container text-on-surface-variant rounded">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onclick="deleteCustomer('${c.id}')" class="p-1 hover:bg-rose-50 text-outline hover:text-error rounded">
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openCustomerModal(customerId = null) {
  const cust = customerId ? state.customers.find(c => c.id === customerId) : null;

  const modalHtml = `
    <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-surface-container-high animate-fade-in">
      <div class="px-space-xl py-space-lg bg-surface-container-low border-b border-surface-container-high/50 flex items-center justify-between">
        <h3 class="font-bold text-lg text-on-surface">${cust ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h3>
        <button onclick="closeModal()" class="p-1.5 text-outline hover:text-on-surface rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="customer-form" onsubmit="handleCustomerSubmit(event, '${customerId || ''}')" class="p-space-xl flex flex-col gap-space-md">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Nome Completo *</label>
          <input type="text" id="cust-name" value="${cust ? cust.full_name : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="Ex: Carlos Eduardo Silva" />
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">E-mail *</label>
            <input type="email" id="cust-email" value="${cust ? cust.email : ''}" required class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="carlos@email.com" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-outline uppercase tracking-wider">CPF</label>
            <input type="text" id="cust-cpf" value="${cust ? cust.cpf || '' : ''}" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="123.456.789-00" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Telefone / WhatsApp</label>
          <input type="text" id="cust-phone" value="${cust ? cust.phone || '' : ''}" class="w-full h-10 px-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="(11) 98765-4321" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-outline uppercase tracking-wider">Endereço de Entrega</label>
          <textarea id="cust-address" rows="2" class="w-full p-3 bg-surface-container-low rounded-lg text-sm text-on-surface focus:outline-none border border-surface-container-high" placeholder="Rua, Número, Bairro, Cidade - UF">${cust ? cust.address || '' : ''}</textarea>
        </div>

        <div class="flex items-center justify-end gap-space-md pt-3 border-t border-surface-container-high/40">
          <button type="button" onclick="closeModal()" class="px-space-xl py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg">Cancelar</button>
          <button type="submit" class="px-space-xl py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary-container transition-all">Salvar Cliente</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

async function handleCustomerSubmit(e, customerId) {
  e.preventDefault();

  const body = {
    full_name: document.getElementById('cust-name').value,
    email: document.getElementById('cust-email').value,
    cpf: document.getElementById('cust-cpf').value || null,
    phone: document.getElementById('cust-phone').value || null,
    address: document.getElementById('cust-address').value || null
  };

  try {
    if (customerId) {
      await supabaseFetch(`customers?id=eq.${customerId}`, { method: 'PATCH', body });
      showToast("Cliente atualizado!");
    } else {
      await supabaseFetch('customers', { method: 'POST', body });
      showToast("Cliente cadastrado com sucesso!");
    }
    closeModal();
    await loadAllData();
  } catch (err) {
    console.error("Erro ao salvar cliente:", err);
  }
}

async function deleteCustomer(id) {
  if (!confirm("Deseja excluir este cliente?")) return;
  try {
    await supabaseFetch(`customers?id=eq.${id}`, { method: 'DELETE' });
    showToast("Cliente excluído.");
    await loadAllData();
  } catch (err) {
    console.error("Erro ao excluir cliente:", err);
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Listen for hash changes
  window.addEventListener('hashchange', handleNavigation);

  // Global search input event
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderCurrentView();
    });
  }

  // Refresh button event
  const refreshBtn = document.getElementById('refresh-data-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('animate-spin');
      await loadAllData();
      showToast("Dados recarregados do Supabase.");
      refreshBtn.classList.remove('animate-spin');
    });
  }

  // Initial routing and load
  handleNavigation();
  loadAllData();
});
