const { workerData, parentPort } = require("node:worker_threads");
const { readFile, dividerMatrix } = require("../functions");

const data = readFile(workerData);

const productsArray = [];

for (let i = 0; i < data.length; i++) {
  const line = data[i];

  if (!line) return;

  productsArray.push(line);
}

const productsMatrix = dividerMatrix(data, 4);

parentPort.postMessage(productsMatrix);
