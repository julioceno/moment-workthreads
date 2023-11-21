const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");

const { Worker } = require("node:worker_threads");
const { join } = require("node:path");

dotenv.config();

const app = express();
const upload = multer();

const port = process.env.PORT || 3030;

function createWorker(quantity) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, "workers", "process-value.js"), {
      workerData: quantity,
    });

    worker.on("message", resolve);
    worker.on("messageerror", reject);
  });
}

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

app.get("/blocking", (req, res) => {
  console.time("blocking");
  let count = 0;

  for (let i = 0; i <= 5_000_000_000; i++) {
    count = i;
  }

  console.timeEnd("blocking");

  res.status(200).send(`Resultado ${count}`);
});

app.get("/thread", async (req, res) => {
  console.time("thread");

  const responseWorker = await createWorker(5_000_000_000);

  console.timeEnd("thread");

  res.status(200).send(`Resultado ${responseWorker}`);
});

app.get("/multithreading", async (req, res) => {
  /**
   * 10
   * 10 / 4 = 2,5
   * 2,5 + 2,5 + 2,5 + 2,5
   */

  console.time("multithreading");

  const threadQuantity = 4;

  const value = 5_000_000_000;

  const dividedValue = value / threadQuantity;

  const promises = [];
  for (let i = 0; i < threadQuantity; i++) {
    promises.push(createWorker(dividedValue));
  }

  const responseWorkers = await Promise.all(promises);

  const response = responseWorkers.reduce((curr, item) => curr + item, 0);

  console.timeEnd("multithreading");

  res.status(200).send(`Resultado ${response}`);
});

app.post("/calculating-profit", upload.single("file"), async (req, res) => {
  const threadQuantity = 4;

  const fileBuffer = req.file.buffer;

  function createWorker(buffer, quantityArrays) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(join(__dirname, "workers", "convert-to-json"), {
        workerData: { buffer, quantityArrays },
      });

      worker.on("message", resolve);
      worker.on("messageerror", reject);
    });
  }
  const responseWorker = await createWorker(fileBuffer, threadQuantity);

  function createWorkerCalculatingProfit(arrays) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        join(__dirname, "workers", "calculate-values-products.js"),
        {
          workerData: arrays,
        }
      );

      worker.on("message", resolve);
      worker.on("messageerror", reject);
    });
  }

  const promises = responseWorker.map((item) =>
    createWorkerCalculatingProfit(item)
  );

  const responseWorkers = await Promise.all(promises);

  const productsProft = responseWorkers.reduce((curr, item) => curr + item, 0);

  const currencyFormat = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const productsProftFormatted = currencyFormat.format(productsProft);

  res.status(200).send(`Resultado ${productsProftFormatted}`);
});

app.listen(port, () => {
  console.log(`🚀 Server on, port ${port}`);
});
