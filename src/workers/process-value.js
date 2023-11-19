const { parentPort, workerData } = require("node:worker_threads");

let count = 0;
for (let i = 0; i <= workerData; i++) {
  count = i;
}

parentPort?.postMessage(count);
