export const state = {
  customers: [],
  products: [],
  orders: [],
  search: "",
  status: "",
  category: "",
  error: null,
};

export function setData({ customers, products, orders }) {
  state.customers = customers;
  state.products = products;
  state.orders = orders;
}

export function setSearch(value) {
  state.search = value;
}

export function setStatus(value) {
  state.status = value;
}

export function setCategory(value) {
  state.category = value;
}

export function setError(message) {
  state.error = message;
}
