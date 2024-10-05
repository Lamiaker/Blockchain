const sha256 = require("js-sha256");
const Block = require("./block");
const nodePersist = require("node-persist");
const crypto = require("crypto");
const Nodes = require("./nodes");
const json = require("body-parser/lib/types/json");

class Blockchain {
  constructor(url, port) {
    this.blocks = [];
    this.nodes = new Nodes(url, port);
    this.block = new Block();

    (async () => {
      this.storage = nodePersist.create({
        dir:
          __dirname +
          "/../../storage/" +
          crypto
            .createHash("md5")
            .update(url + port)
            .digest("hex"),
      });
      await this.storage.init();

      let blocks = await this.storage.getItem("blocks");
      this.blocks = typeof blocks != "undefined" ? blocks : [];

      if (this.blocks.length == 0) {
        let genesisBlock = new Block(); // initial block
        this.addBlock(genesisBlock);
      }
    })();
  }
  block = null;

  addBlock(block) {
    if (this.blocks.length == 0) {
      block.previousHash = "0000000000000000";
      block.hash = this.generateHash(block);
    }

    this.blocks.push(block);

    (async () => {
      await this.storage.setItem("blocks", this.blocks);
    })();
  }

  getNextBlock(transactions) {
    let block = new Block();
    let previousBlock = this.getPreviousBlock();

    block.addTransactions(transactions);
    block.index = previousBlock.index + 1;
    block.previousHash = previousBlock.hash;
    block.hash = this.generateHash(block);

    return block;
  }

  getPreviousBlock() {
    // console.log(this.blocks);
    return this.blocks[this.blocks.length - 1];
  }

  generateHash(block) {
    let x =
      JSON.stringify(block.transactions) +
      block.index +
      block.previousHash +
      block.timestamp +
      block.nonce;

    let hash = sha256(x);

    while (!hash.startsWith("0000")) {
      block.nonce++;
      x =
        JSON.stringify(block.transactions) +
        block.index +
        block.previousHash +
        block.timestamp +
        block.nonce;
      hash = sha256(x);
    }

    return hash;
  }

  mine(transactions, res) {
    if (transactions.list.length == 0) {
      res.status(500);
      return { error: "No transactions to be mined" };
    }

    this.block = this.getNextBlock(transactions);
    // this.addBlock(block);
    // this.nodes.broadcast();
    this.nodes.broadcastBlock(this.block);

    return this.block;
  }

  printBlockValues(block) {
    if (block) {
      block.index;
      block.hash;
      block.previousHash;
      block.nonce;
      block.transactions;
      return block;
      // Ajoutez ici d'autres valeurs que vous souhaitez afficher
    } else {
      console.log("No block available to print.");
    }
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (newBlock.index !== previousBlock.index + 1) {
      console.log("Invalid index");
      return false;
    }

    if (newBlock.previousHash !== previousBlock.hash) {
      console.log("Invalid previousHash");
      return false;
    }

    const calculatedHash = this.generateHash(newBlock);

    if (calculatedHash !== newBlock.hash) {
      console.log("Invalid block hash");
      return false;
    }

    console.log("Block is valid.");
     this.addBlock(newBlock);
     this.nodes.broadcast();

    return true;
  }



  updateBlocks(blocks) {
    this.blocks = blocks;

    (async () => {
      await this.storage.setItem("blocks", this.blocks);
    })();
  }

  getBlockByIndex(idx) {
    let foundBlock = [];

    if (idx <= this.blocks.length) {
      this.blocks.forEach((block) => {
        if (idx == block.index) {
          foundBlock = block;
          return;
        }
      });
    }

    return foundBlock;
  }

  getBlockLastIndex() {
    return this.blocks.length - 1;
  }
}



module.exports = Blockchain;
