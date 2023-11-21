const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();

const app = express();
const upload = multer();

const port = process.env.PORT || 3030;

app.get("/", (req, res) => {
  res.status(200).send("Hello word");
});

app.get("/blocking", (req, res) => {
  res.status(200).send("Hello word");
});

app.get("/thread", async (req, res) => {
  res.status(200).send("Hello word");
});

app.get("/multi-thread", async (req, res) => {
  es.status(200).send("Hello word");
});

app.post("/calculating-profit", upload.single("file"), async (req, res) => {
  es.status(200).send("Hello word");
});

app.listen(port, () => {
  console.log(`🚀 Server on, port ${port}`);
});
