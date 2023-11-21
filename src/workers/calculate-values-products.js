const { workerData, parentPort } = require("node:worker_threads");
const { calculateProfit } = require("../function/calculate-profit");

const productsProfit = workerData.reduce((curr, item) => {
  const {
    Quantidade: quantity,
    Valor: value,
    "Valor de venda": saleValue,
  } = item;

  const totalProfit = calculateProfit({ quantity, value, saleValue });

  return curr + totalProfit;
}, 0);

parentPort.postMessage(productsProfit);
