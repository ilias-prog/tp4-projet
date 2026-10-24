import {
  state,
  setData,
  setSearch,
  setStatus,
  setCategory,
  setError,
} from "./state.js";
import { loadAllData } from "./dataService.js";
import { getCategories, getStatuses } from "./selectors.js";
import {
  render,
  renderError,
  renderFilterOptions,
  renderOrderDetail,
} from "./view.js";

function bindEvents() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    setSearch(e.target.value);
    render(state);
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    setStatus(e.target.value);
    render(state);
  });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    setCategory(e.target.value);
    render(state);
  });

  document.getElementById("ordersBody").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-order-id]");
    if (!button) return;
    const orderId = Number(button.dataset.orderId);
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;
    renderOrderDetail(order, state);
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("orderModal")
    ).show();
  });
}

async function init() {
  bindEvents();
  try {
    const data = await loadAllData();
    setData(data);
    setError(null);
    renderError(null);
    renderFilterOptions(
      getStatuses(state.orders),
      getCategories(state.products)
    );
    render(state);
  } catch (error) {
    setError(error.message);
    renderError(
      `Impossible de charger les donnees : ${error.message}. Verifiez les chemins des fichiers JSON et lancez le projet via un serveur local.`
    );
  }
}

init();
