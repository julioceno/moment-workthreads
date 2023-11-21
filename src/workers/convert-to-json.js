const { workerData, parentPort } = require("node:worker_threads");
const { convertToJson } = require("../function/convert-to-json");
const { createSubArrays } = require("../function/create-sub-arrays");

const { buffer, quantityArrays } = workerData;

const data = convertToJson(buffer);

const productsArray = data.filter((item) => item);

const array = createSubArrays(productsArray, quantityArrays);

parentPort.postMessage(array);
