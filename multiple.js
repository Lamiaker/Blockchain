const blockchainController = require("./src/controllers/blockchain");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { shuffleAndSaveAddresses } = require("./shuffleAddresses");
const fs = require("fs");

// Chemin vers le fichier nodes.json
const nodesFilePath = path.join(__dirname, "config", "nodes.json");

// Variable pour stocker les serveurs Express
let servers = [];

// Fonction pour lire les nœuds depuis le fichier JSON
function readNodes() {
  const data = fs.readFileSync(nodesFilePath, "utf8");
  return JSON.parse(data);
}

// Fonction pour arrêter les serveurs existants
function stopServers() {
  servers.forEach((server) => {
    server.close((err) => {
      if (err) {
        console.error("Erreur lors de la fermeture du serveur:", err);
      } else {
        console.log("Serveur arrêté avec succès.");
      }
    });
  });
  servers = [];
}

// Fonction pour initialiser les serveurs Express
function initServers() {
  const nodes = readNodes();

  // Afficher les adresses des nœuds avant d'initialiser les serveurs
// !!!  console.log("Initialisation des serveurs avec les adresses :", nodes);

  nodes.forEach((node) => {
    let idx = node.lastIndexOf("//");
    let idx2 = node.lastIndexOf(":");
    let url = node.substring(idx + 2, idx2);
    let port = node.substring(idx2 + 1);

    // Init express
    let app = express();

    app.use(cors());
    // Servir les fichiers statiques depuis le répertoire public
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
    app.post("/MiningNode", controller.PostMiningNode.bind(controller));
    app.get("/transactions", controller.getTransactions.bind(controller));
    app.get("/mine", controller.mine.bind(controller));
    app.get( "/blockchain/last-index",controller.getBlockLastIndex.bind(controller));
    app.get("/blockchain/:idx", controller.getBlockByIndex.bind(controller));
    app.get("/blockchain", controller.getBlockchain.bind(controller));
    app.get("/next", controller.getblock.bind(controller));
    app.post("/broadcastblock", controller.Postbro.bind(controller));
    app.get("/valider", controller.valider.bind(controller));
    app.get("/Getbro", controller.Getbro.bind(controller));
    app.get("/gas", controller.gas.bind(controller));
    app.get("/temp", controller.temperature.bind(controller));
    app.get("/hum", controller.humidity.bind(controller));
    // Stocker le serveur pour une fermeture ultérieure
    servers.push(listener);
  });
}

// Mélanger et sauvegarder les adresses initialement
shuffleAndSaveAddresses();

// Initialiser les serveurs
initServers();

// Répéter la permutation des adresses et réinitialiser les serveurs toutes les minutes
setInterval(() => {
// !!!  console.log("Permutation des adresses et réinitialisation des serveurs...");
  shuffleAndSaveAddresses();
  stopServers();
  initServers();
}, 7200000 ); // 7200000 millisecondes = 2 heurs
