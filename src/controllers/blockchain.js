const Transactions = require("../models/transactions");
const Blockchain = require("../models/blockchain");
const Nodes = require("../models/nodes");
const Block = require("../models/block");
const axios = require("axios");
const { data } = require("node-persist");

class BlockchainController {
  constructor(url, port) {
    this.blockchain = new Blockchain(url, port);
    this.nodes = new Nodes(url, port);
    this.transactions = new Transactions();
    this.block = new Block();
    this.block_bro = null;
    this.nodeMapping = {
      humidity: "http://0.0.0.0:4000",
      gas: "http://0.0.0.0:4001",
      temperature: "http://0.0.0.0:4002",
      sol: "http://0.0.0.0:4003",
    };
    // Définir l'URL de votre API comme une propriété de classe
    this.apiUrl = "http://192.168.147.44";
  }
  getled(req, res) {}
  resolve(req, res) {
    this.nodes.resolve(res, this.blockchain);
  }

  getNodes(req, res) {
    res.json(this.nodes.list);
  }

  postTransaction(req, res) {
    this.nodes.broadcastToMiningNode(req, res);
  }

  PostMiningNode(req, res) {
    this.transactions.add(req, res);
    if (this.transactions.list.length == 6) {
      this.blockchain.mine(this.transactions, res);
    }
  }

  getTransactions(req, res) {
    res.json(this.transactions.get());
  }

  Postbro(req, res) {
    this.block_bro = req.body;
    const newBlock = this.block_bro;
    const previousBlock =
      this.blockchain.blocks[this.blockchain.blocks.length - 1];

    if (this.blockchain.isValidNewBlock(newBlock, previousBlock)) {
      return newBlock;
    } else {
      return null;
    }
  }

  Getbro(req, res) {
    res.json(this.blockchain.printBlockValues(this.block_bro));
  }
  // humidity(req, res) {
  //   const apiUrl = "http://192.168.61.125/humidity";
  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       // La réponse contient les données retournées par le serveur
  //       const variable = response.data;
  //       this.nodes.broadcastToMiningNode(variable, res);
  //       // Supposons que la réponse est directement la variable que vous souhaitez afficher

  //       // Envoi de la variable récupérée en réponse
  //       res.send(`Variable récupérée depuis le serveur : ${variable}`);
  //     })
  //     .catch((error) => {
  //       // Gestion des erreurs
  //       console.error("Erreur lors de la récupération de la variable:", error);
  //       res.status(500).send("Erreur lors de la récupération de la variable");
  //     });
  // }
  // gas(req, res) {
  //   const apiUrl = "http://192.168.61.125/gas";

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       // La réponse contient les données retournées par le serveur
  //       const variable = response.data;
  //       this.nodes.broadcastToMiningNode(variable, res);
  //       // Supposons que la réponse est directement la variable que vous souhaitez afficher

  //       // Envoi de la variable récupérée en réponse
  //       res.send(`Variable récupérée depuis le serveur : ${variable}`);
  //     })
  //     .catch((error) => {
  //       // Gestion des erreurs
  //       console.error("Erreur lors de la récupération de la variable:", error);
  //       res.status(500).send("Erreur lors de la récupération de la variable");
  //     });
  // }
  // temperature(req, res) {
  //   const apiUrl = "http://192.168.61.125/temperature";

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       // La réponse contient les données retournées par le serveur
  //       const variable = response.data;
  //       this.nodes.broadcastToMiningNode(variable, res);
  //       // Supposons que la réponse est directement la variable que vous souhaitez afficher

  //       // Envoi de la variable récupérée en réponse
  //       res.send(`Variable récupérée depuis le serveur : ${variable}`);
  //     })
  //     .catch((error) => {
  //       // Gestion des erreurs
  //       console.error("Erreur lors de la récupération de la variable:", error);
  //       res.status(500).send("Erreur lors de la récupération de la variable");
  //     });
  // }

  humidity(req, res) {
    const humidityEndpoint = "/humidity";
    const requestUrl = this.apiUrl + humidityEndpoint;
    axios
      .get(requestUrl)
      .then((response) => {
        const variable = response.data;
        const selectedNode = this.nodeMapping["humidity"];
        const dataToSend = { humidité: variable };
        // res.send(`Données d'humidité envoyées au nœud : ${selectedNode}`);
        res.send(` ${variable}`);
        this.nodes.broadcastToMiningNode(dataToSend, res);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'humidité :", error);
        res.status(500).send("Erreur lors de la récupération de l'humidité");
      });
  }

  gas(req, res) {
    const gasEndpoint = "/gas";
    const requestUrl = this.apiUrl + gasEndpoint;
    axios
      .get(requestUrl)
      .then((response) => {
        const variable = response.data;
        const selectedNode = this.nodeMapping["gas"];
        const dataToSend = { gas: variable };
        res.send(` ${variable}`);
        // res.send(`Données de gaz envoyées au nœud : ${selectedNode}`);
        this.nodes.broadcastToMiningNode(dataToSend, res);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de gaz :",
          error
        );
        res
          .status(500)
          .send("Erreur lors de la récupération des données de gaz");
      });
  }

  temperature(req, res) {
    const tempEndpoint = "/temperature";
    const requestUrl = this.apiUrl + tempEndpoint;
    axios
      .get(requestUrl)
      .then((response) => {
        const variable = response.data;
        const selectedNode = this.nodeMapping["temperature"];
        const dataToSend = { température: variable };
        res.send(` ${variable}`);
        // res.send(`Données de température envoyées au nœud : ${selectedNode}`);
        this.nodes.broadcastToMiningNode(dataToSend, res);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de température :",
          error
        );
        res
          .status(500)
          .send("Erreur lors de la récupération des données de température");
      });
  }
  sol(req, res) {
    const solEndpoint = "/sol";
    const requestUrl = this.apiUrl + solEndpoint;
    axios
      .get(requestUrl)
      .then((response) => {
        const variable = response.data;
        const selectedNode = this.nodeMapping["sol"];
        const dataToSend = { sol: variable };
        res.send(` ${variable}`);
        // res.send(`Données de température envoyées au nœud : ${selectedNode}`);
        this.nodes.broadcastToMiningNode(dataToSend, res);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de température :",
          error
        );
        res
          .status(500)
          .send("Erreur lors de la récupération des données de température");
      });
  }

  valider(req, res) {
    const newBlock = this.block_bro;
    const previousBlock =
      this.blockchain.blocks[this.blockchain.blocks.length - 1];

    if (this.blockchain.isValidNewBlock(newBlock, previousBlock)) {
      res.json({ state: true });
      return newBlock;
    } else {
      res.json({ state: false });
      return null;
    }
  }
  getblock(req, res) {
    res.json(this.blockchain.printBlockValues());
  }

  mine(req, res) {
    res.json(this.blockchain.mine(this.transactions, res));
  }

  getBlockchain(req, res) {
    res.json(this.blockchain.blocks);
  }

  getBlockByIndex(req, res) {
    res.json(this.blockchain.getBlockByIndex(req.params.idx));
  }

  getBlockLastIndex(req, res) {
    res.json(this.blockchain.getBlockLastIndex());
  }
}

module.exports = BlockchainController;
