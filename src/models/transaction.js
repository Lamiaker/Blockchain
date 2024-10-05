
class Transaction {
    constructor(data) {
        if (!data)
            throw new Error('Invalid data');

        this.data = data;
      
        this.timestamp = Math.floor(+new Date() / 1000);
    }
}

module.exports = Transaction;