const fetch = require('node-fetch');
const Blockchain = require('./blockchain');
const transactions = require('./transactions');
const Transaction = require('./transaction');

class Nodes {
  constructor(url, port) {
    const nodes = require(process.env.NODE_ENV == "production"
      ? "../../config/nodes.prod.json"
      : "../../config/nodes.json");
    const currentURL = url + ":" + port;
    this.list = [];

    for (let i in nodes)
      if (nodes[i].indexOf(currentURL) == -1) this.list.push(nodes[i]);
  }

  resolve(res, blockchain) {
    let completed = 0;
    let nNodes = this.list.length;
    let response = [];
    let errorCount = 0;

    this.list.forEach(function (node) {
      fetch(node + "/blockchain")
        .then(function (resp) {
          return resp.json();
        })
        .then(function (respBlockchain) {
          if (blockchain.blocks.length < respBlockchain.length) {
            blockchain.updateBlocks(respBlockchain);
            response.push({ synced: node });
          } else {
            response.push({ noaction: node });
          }

          if (++completed == nNodes) {
            if (errorCount == nNodes) res.status(500);
            res.send(response);
          }
        })
        .catch(function (error) {
          ++errorCount;
          //response.push({error: 'Failed to reach node at ' + node})
          response.push({ error: error.message });
          if (++completed == nNodes) {
            if (errorCount == nNodes) res.status(500);
            res.send(response);
          }
        });
    });
  }

  broadcast() {
    this.list.forEach(function (node) {
      fetch(node + "/resolve")
        .then(function (resp) {
          return resp.json();
        })
        .then(function (resp) {
          console.log(node, resp);
        })
        .catch(function (error) {
          console.log(node, error);
        });
    });
  }

  // broadcastToMiningNode(req, res) {
  //     try {
  //         let completed = 0;

  //         let tx = new Transaction(req.body.data);
  //         let node = this.list[0]; // Sélectionner le premier nœud de la liste
  //         let response = []; // Déclaration de la variable response pour stocker les réponses

  //         // Récupérer les transactions du nœud sélectionné
  //         fetch(node + '/transactions')
  //             .then(function(resp) {
  //                 if (!resp.ok) {
  //                     throw new Error('Failed to fetch transactions');
  //                 }
  //                 return resp.json();
  //             })
  //             .then(function(transactions) {
  //                 // Ajouter la transaction à la liste de transactions du nœud
  //                 transactions.push(tx);

  //                 // Envoyer la transaction mise à jour au nœud
  //                 return fetch(node + '/MiningNode', {
  //                     method: 'POST',
  //                     headers: {
  //                         'Content-Type': 'application/json'
  //                     },
  //                     body: JSON.stringify(tx)
  //                 });
  //             })
  //             .then(function(updateResp) {

  //                 if (!updateResp.ok) {
  //                     throw new Error('Failed to update transactions');
  //                 }

  //                 if (++completed == node) {
  //                     if (errorCount == node)
  //                         res.status(500);
  //                     res.send(response);
  //                 }
  //                 console.log(node, "Transactions updated successfully");
  //                 res.json(response);

  //             })
  //             .catch(function(error) {
  //                 ++errorCount;
  //                 //response.push({error: 'Failed to reach node at ' + node})
  //                 response.push({error: error.message})
  //                 if (++completed == node) {
  //                     if (errorCount == node)
  //                         res.status(500);
  //                     res.send(response);
  //                 }
  //             });
  //     } catch (error) {
  //         console.error('Error broadcasting transaction:', error);
  //         res.status(500).send({ error: error.message });
  //     }
  // }

  //   broadcastToMiningNode(vari, res) {
  //     try {
  //       let completed = 0;

  //       let tx = new Transaction(vari.body.data);
  //     // let tx = new Transaction(vari);
  //       let node = this.list[0]; // Sélectionner le premier nœud de la liste
  //       let response = []; // Déclaration de la variable response pour stocker les réponses
  //  let errorCount = 0;
  //       // Récupérer les transactions du nœud sélectionné
  //       fetch(node + "/transactions")
  //         .then(function (resp) {
  //           if (!resp.ok) {
  //             throw new Error("Failed to fetch transactions");
  //           }
  //           return resp.json();

  //         })
  //         .then(function (transactions) {
  //           // Ajouter la transaction à la liste de transactions du nœud

  //           transactions.push(vari);

  //           // Envoyer la transaction mise à jour au nœud
  //           return fetch(node + "/MiningNode", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(tx),
  //           });
  //         })
  //         .then(function (updateResp) {
  //           if (!updateResp.ok) {
  //             throw new Error("Failed to update transactions");
  //           }

  //           if (++completed == node) {
  //             if (errorCount == node) res.status(500);
  //             res.send(response);
  //           }
  //           console.log(node, "Transactions updated successfully");
  //            res.json(response);
  //         })
  //         .catch(function (error) {
  //           ++errorCount;
  //           //response.push({error: 'Failed to reach node at ' + node})
  //           response.push({ error: error.message });
  //           if (++completed == node) {
  //             if (errorCount == node) res.status(500);
  //             res.send(response);
  //           }
  //         });
  //     } catch (error) {
  //       console.error("Error broadcasting transaction:", error);
  //       res.status(500).send({ error: error.message });
  //     }
  //   }

  broadcastToMiningNode(vari, res) {
    try {
      let completed = 0;

      // let tx = new Transaction(vari.body.data);
      let tx = new Transaction(vari);
      let node = this.list[0]; // Sélectionner le premier nœud de la liste
      let node2 = this.list[1]; // Sélectionner le troisième nœud de la liste
      let response = []; // Déclaration de la variable response pour stocker les réponses
      let errorCount = 0;
      // Récupérer les transactions du nœud sélectionné
      fetch(node + "/transactions")
        .then(function (resp) {
          if (!resp.ok) {
            throw new Error("Failed to fetch transactions from node1");
          }
          return resp.json();
        })
        .then(function (transactions) {
          // Ajouter la transaction à la liste de transactions du deuxième nœud
          transactions.push(vari);
          // Envoyer la transaction mise à jour au deuxième nœud
          return fetch(node + "/MiningNode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tx),
          });
        })
        .then(function (updateResp) {
          if (!updateResp.ok) {
            throw new Error("Failed to update transactions at node1");
          }
          if (++completed == 2) {
            if (errorCount == 2) res.status(500);
            res.send(response);
          }
          console.log(node, "Transactions updated successfully");
          res.json(response);
        })
        .catch(function (error) {
          ++errorCount;
          response.push({ error: error.message });
          if (++completed == 2) {
            if (errorCount == 2) res.status(500);
            res.send(response);
          }
        });

      // Récupérer les transactions du troisième nœud sélectionné
      fetch(node2 + "/transactions")
        .then(function (resp) {
          if (!resp.ok) {
            throw new Error("Failed to fetch transactions from node2");
          }
          return resp.json();
        })
        .then(function (transactions) {
          // Ajouter la transaction à la liste de transactions du troisième nœud
          transactions.push(vari);
          // Envoyer la transaction mise à jour au troisième nœud
          return fetch(node2 + "/MiningNode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tx),
          });
        })
        .then(function (updateResp) {
          if (!updateResp.ok) {
            throw new Error("Failed to update transactions at node2");
          }
          if (++completed == 2) {
            if (errorCount == 2) res.status(500);
            res.send(response);
          }
          console.log(node2, "Transactions updated successfully");
          res.json(response);
        })
        .catch(function (error) {
          ++errorCount;
          response.push({ error: error.message });
          if (++completed == 2) {
            if (errorCount == 2) res.status(500);
            res.send(response);
          }
        });
    } catch (error) {
      console.error("Error broadcasting transaction:", error);
      res.status(500).send({ error: error.message });
    }
  }

  broadcastBlock(block) {
    // Utilisez une boucle ou une méthode forEach pour parcourir tous les nœuds de la liste
    this.list.forEach((node) => {
      // Construisez l'URL du nœud destinataire pour la diffusion du bloc
      let nodeUrl = `${node}/broadcastblock`;

      // Utilisez fetch ou toute autre méthode pour envoyer le bloc au nœud
      fetch(nodeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(block),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to broadcast block");
          }

          console.log("Block broadcasted successfully to", nodeUrl);
        })
        .catch((error) => {
          console.error("Error broadcasting block to", nodeUrl, error);
        });
    });
  }
}


module.exports = Nodes;