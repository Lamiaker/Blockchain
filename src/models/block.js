class Block {
  constructor() {
    this.index = 0;

    this.previousHash = ""; //le hash du bloc précédent
    this.hash = ""; //le hash du bloc courant
    this.timestamp = Math.floor(+new Date() / 1000); //l'heure du bloc courant
    this.nonce = 0; //le nonce du bloc courant
    this.transactions = [];
  }

  addTransactions(transactions) {
    transactions.list.forEach((transaction) => {
      this.transactions.push(transaction);
    });
    transactions.reset();
  }
}

module.exports = Block;
