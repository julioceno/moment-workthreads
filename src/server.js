const express = require("express");
const dotenv = require("dotenv");
const { Worker } = require("node:worker_threads");
const { join, resolve } = require("node:path");
const multer = require("multer");
const sharp = require("sharp");
const { default: puppeteer } = require("puppeteer");
const { readFileSync, createWriteStream } = require("node:fs");
const handlebars = require("handlebars");
const pureimage = require("pureimage");
const client = require("https");

const upload = multer();

dotenv.config();

const app = express();

const port = process.env.PORT || 3030;
const threadCount = 4;
const workerData = 10_000_000_000;

function createWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, "workers", "process-value.js"), {
      workerData,
    });

    worker.on("message", resolve);
    worker.on("messageerror", reject);
  });
}

app.get("/", (req, res) => {
  res.send("Hello word");
});

app.get("/blocking", (req, res) => {
  let count = 0;
  for (let i = 0; i <= workerData; i++) {
    count = i;
  }

  res.status(200).send(`Value count ${count}`);
});

app.get("/thread", async (req, res) => {
  console.time("thread");

  const promise = await createWorker(workerData);

  console.timeEnd("thread");
  res.status(200).send(`Value count ${promise}`);
});

app.get("/multi-thread", async (req, res) => {
  console.time("multi-thread");
  // 10
  // 2,5 x 4 => 10
  // 2,5 + 2,5 + 2,5 + 2,5

  const valueDivider = workerData / threadCount;
  const promisesArray = [];

  for (let i = 0; i < threadCount; i++) {
    const promise = createWorker(valueDivider);
    promisesArray.push(promise);
  }

  const promises = await Promise.all(promisesArray);

  const sum = promises.reduce((curr, value) => {
    return curr + value;
  }, 0);

  console.timeEnd("multi-thread");

  res.status(200).send(`Value count ${sum}`);
});

function createWorkerConvertToJson(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      join(__dirname, "workers", "convert-to-json.js"),
      { workerData }
    );

    worker.on("message", resolve);
    worker.on("messageerror", reject);
  });
}

function createWorkerCalculateValueProducts(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      join(__dirname, "workers", "calculate-values-products.js"),
      { workerData }
    );

    worker.on("message", resolve);
    worker.on("messageerror", reject);
  });
}

app.post("/calculating-profit", upload.single("file"), async (req, res) => {
  console.time("calculating-profit");

  const file = req.file;

  const productsMatrix = await createWorkerConvertToJson(file.buffer);

  const promises = productsMatrix.map((array) =>
    createWorkerCalculateValueProducts(array)
  );

  const values = await Promise.all(promises);

  const productsProft = values.reduce((curr, value) => {
    return curr + value;
  }, 0);

  const currencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  const productsProftFormatted = currencyFormat.format(productsProft);
  console.timeEnd("calculating-profit");

  res
    .status(200)
    .send(`Lucro total com base nos registros: "${productsProftFormatted}"`);
});

app.listen(port, () => {
  console.log(`🚀 Server on, port ${port}`);
});
