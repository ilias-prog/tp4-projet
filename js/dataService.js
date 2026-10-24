async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Echec du chargement de "${path}" (HTTP ${response.status})`);
  }
  return response.json();
}

export async function loadAllData() {
  try {
    const [customers, products, orders] = await Promise.all([
      loadJSON("data/customers.json"),
      loadJSON("data/products.json"),
      loadJSON("data/orders.json"),
    ]);
    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur de chargement des donnees :", error);
    throw error;
  }
}
