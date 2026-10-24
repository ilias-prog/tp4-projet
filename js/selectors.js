export function findCustomer(customers, customerId) {
  return customers.find((customer) => customer.id === customerId);
}

export function findProduct(products, productId) {
  return products.find((product) => product.id === productId);
}

export function getLineAmount(item, products) {
  const product = findProduct(products, item.productId);
  return product ? product.price * item.quantity : 0;
}

export function getOrderTotal(order, products) {
  let total = 0;
  order.items.forEach((item) => {
    total += getLineAmount(item, products);
  });
  return total;
}

export function getOrderDetail(order, customers, products) {
  const customer = findCustomer(customers, order.customerId);
  const lines = order.items.map((item) => {
    const product = findProduct(products, item.productId);
    return {
      name: product ? product.name : "Produit inconnu",
      category: product ? product.category : "-",
      price: product ? product.price : 0,
      quantity: item.quantity,
      amount: getLineAmount(item, products),
    };
  });
  return {
    id: order.id,
    customerName: customer ? customer.name : "Client inconnu",
    city: customer ? customer.city : "-",
    date: order.date,
    status: order.status,
    lines,
    total: getOrderTotal(order, products),
  };
}

export function getFilteredOrders(state) {
  const search = state.search.trim().toLowerCase();

  return state.orders.filter((order) => {
    const customer = findCustomer(state.customers, order.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";

    const matchSearch = search === "" || customerName.includes(search);
    const matchStatus = state.status === "" || order.status === state.status;
    const matchCategory =
      state.category === "" ||
      order.items.some((item) => {
        const product = findProduct(state.products, item.productId);
        return product && product.category === state.category;
      });

    return matchSearch && matchStatus && matchCategory;
  });
}

export function getCategories(products) {
  const categories = products.map((product) => product.category);
  return categories.filter((cat, index) => categories.indexOf(cat) === index);
}

export function getStatuses(orders) {
  const statuses = orders.map((order) => order.status);
  return statuses.filter((s, index) => statuses.indexOf(s) === index);
}

export function getIndicators(state) {
  let cumulated = 0;
  state.orders.forEach((order) => {
    cumulated += getOrderTotal(order, state.products);
  });
  const delivered = state.orders.filter((o) => o.status === "Livree").length;

  return {
    customers: state.customers.length,
    products: state.products.length,
    orders: state.orders.length,
    total: cumulated,
    delivered,
  };
}
