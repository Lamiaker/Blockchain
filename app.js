const blockchainController = require("./src/controllers/blockchain");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios"); // Importe Axios

// Load env vars
const url = process.env.URL || "127.0.0.1";
const port = process.env.PORT || 4000;

// Init express
let app = express();

app.use(express.static(path.join(__dirname, "app")));
app.use(bodyParser.json());

let listener = app.listen(port, url, function () {
  console.log(
    "Server started at " +
      listener.address().address +
      ":" +
      listener.address().port
  );
});

// API
let controller = new blockchainController(url, port);

app.get("/resolve", controller.resolve.bind(controller));
app.get("/nodes", controller.getNodes.bind(controller));
app.post("/transaction", controller.postTransaction.bind(controller));
app.get("/transactions", controller.getTransactions.bind(controller));
app.get("/mine", controller.mine.bind(controller));
app.get(
  "/blockchain/last-index",
  controller.getBlockLastIndex.bind(controller)
);
app.get("/blockchain/:idx", controller.getBlockByIndex.bind(controller));
app.get("/blockchain", controller.getBlockchain.bind(controller));

