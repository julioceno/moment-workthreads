const { workerData, parentPort } = require("node:worker_threads");
const { calculateProfit } = require("../functions/calculate-profit");

const productsProft = workerData.reduce((curr, item) => {
  const {
    Valor: value,
    "Valor de venda": saleValue,
    Quantidade: quantity,
  } = item;

  const totalProfit = calculateProfit({ value, saleValue, quantity });

  return curr + totalProfit;
}, 0);

parentPort.postMessage(productsProft);
