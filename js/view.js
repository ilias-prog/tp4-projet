import {
  findCustomer,
  getOrderTotal,
  getOrderDetail,
  getFilteredOrders,
  getIndicators,
} from "./selectors.js";

const fmt = (n) => `${n.toLocaleString("fr-FR")} MAD`;

const STATUS_CLASS = {
  Livree: "success",
  "En attente": "warning",
  Annulee: "danger",
};

export function renderFilterOptions(statuses, categories) {
  const statusSelect = document.getElementById("statusFilter");
  const categorySelect = document.getElementById("categoryFilter");

  statusSelect.innerHTML = '<option value="">Tous les statuts</option>';
  statuses.forEach((s) => {
    statusSelect.innerHTML += `<option value="${s}">${s}</option>`;
  });

  categorySelect.innerHTML = '<option value="">Toutes les categories</option>';
  categories.forEach((c) => {
    categorySelect.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

export function renderError(message) {
  const zone = document.getElementById("errorZone");
  if (message) {
    zone.textContent = message;
    zone.classList.remove("d-none");
  } else {
    zone.textContent = "";
    zone.classList.add("d-none");
  }
}

function renderIndicators(state) {
  const ind = getIndicators(state);
  const cards = [
    { label: "Clients", value: ind.customers, color: "primary" },
    { label: "Produits", value: ind.products, color: "info" },
    { label: "Commandes", value: ind.orders, color: "secondary" },
    { label: "Montant cumule", value: fmt(ind.total), color: "success" },
    { label: "Commandes livrees", value: ind.delivered, color: "dark" },
  ];
  const zone = document.getElementById("indicators");
  zone.innerHTML = "";
  cards.forEach((c) => {
    zone.innerHTML += `
      <div class="col-6 col-lg">
        <div class="card text-bg-${c.color} h-100 shadow-sm">
          <div class="card-body">
            <div class="small text-uppercase">${c.label}</div>
            <div class="fs-4 fw-bold">${c.value}</div>
          </div>
        </div>
      </div>`;
  });
}

function renderOrders(state) {
  const orders = getFilteredOrders(state);
  const body = document.getElementById("ordersBody");
  const count = document.getElementById("resultCount");
  count.textContent = `${orders.length} commande(s) affichee(s)`;

  if (orders.length === 0) {
    body.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted py-4">Aucune commande ne correspond aux filtres.</td></tr>';
    return;
  }

  body.innerHTML = "";
  orders.forEach((order) => {
    const customer = findCustomer(state.customers, order.customerId);
    const total = getOrderTotal(order, state.products);
    body.innerHTML += `
      <tr>
        <td>#${order.id}</td>
        <td>${customer ? customer.name : "Client inconnu"}</td>
        <td>${order.date}</td>
        <td><span class="badge text-bg-${STATUS_CLASS[order.status] || "secondary"}">${order.status}</span></td>
        <td class="text-end">${fmt(total)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-order-id="${order.id}">Detail</button>
        </td>
      </tr>`;
  });
}

export function render(state) {
  renderIndicators(state);
  renderOrders(state);
}

export function renderOrderDetail(order, state) {
  const d = getOrderDetail(order, state.customers, state.products);
  document.getElementById("modalTitle").textContent = `Commande #${d.id}`;

  let rows = "";
  d.lines.forEach((l) => {
    rows += `
      <tr>
        <td>${l.name}</td>
        <td class="text-end">${fmt(l.price)}</td>
        <td class="text-end">${l.quantity}</td>
        <td class="text-end">${fmt(l.amount)}</td>
      </tr>`;
  });

  document.getElementById("modalBody").innerHTML = `
    <p class="mb-1"><strong>Client :</strong> ${d.customerName}</p>
    <p class="mb-1"><strong>Ville :</strong> ${d.city}</p>
    <p class="mb-1"><strong>Date :</strong> ${d.date}</p>
    <p class="mb-3"><strong>Statut :</strong>
      <span class="badge text-bg-${STATUS_CLASS[d.status] || "secondary"}">${d.status}</span></p>
    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead><tr><th>Produit</th><th class="text-end">Prix</th><th class="text-end">Qte</th><th class="text-end">Montant</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th colspan="3" class="text-end">Total</th><th class="text-end">${fmt(d.total)}</th></tr></tfoot>
      </table>
    </div>`;
}
