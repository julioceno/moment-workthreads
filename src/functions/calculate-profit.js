function calculateProfit({ value, saleValue, quantity }) {
  const percentage = ((saleValue - value) / value) * 100;
  const profit = value * (percentage / 100);
  const totalProfit = profit * quantity;

  return totalProfit;
}

module.exports = { calculateProfit };
