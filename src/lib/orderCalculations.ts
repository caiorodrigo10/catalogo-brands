export const calculateOrderSubtotal = (products: Array<any>) => {
  return products.reduce((total, item) => {
    const price = item.product?.from_price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

export const calculateShippingCost = (products: Array<any>) => {
  const totalItems = products.length;
  // Base shipping cost is $4.50, plus $2 for each additional item
  return 4.50 + Math.max(0, totalItems - 1) * 2;
};

export const calculateOrderTotal = (products: Array<any>) => {
  const subtotal = calculateOrderSubtotal(products);
  const shipping = calculateShippingCost(products);
  return subtotal + shipping;
};