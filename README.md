# Application Blockchain in Node.js



## Getting Started

### Prerequisites

You need node.js and npm package manager to be installed. I developed this code using node v12.10.0, but should work with previous versions.

### Installation

Go into the code root and install all the packages.

```sh
$ npm install
```

### Node list

Not mandatory, but it is recommended to have a list of nodes for having the distributed ledger mode.

There is already a default list of nodes set in `config/nodes.json`, but you may change it as you wish.

```
[
    "http://0.0.0.0:4000",
    "http://0.0.0.0:4001",
    "http://0.0.0.0:4002"
]
```

### Running one instance

Use this for starting one single instance (a node).

```sh
$ node app
```


###  Running multiple nodes

Use this if you want to have multiple instances in the same machine. Nodes defined in the config file above will be accessed and keep updated.

This is a convinient way for playing around with distributed ledger quickly.

```sh
$ node multiple
```
## API Routes

Below are the available API routes you can use:

- **GET** `/resolve` - Resolve any conflicts in the blockchain.
- **GET** `/nodes` - Get the list of all nodes in the network.
- **POST** `/transaction` - Create a new transaction.
- **POST** `/MiningNode` - Add a mining node.
- **GET** `/transactions` - Get all transactions in the pool.
- **GET** `/mine` - Start the mining process.
- **GET** `/blockchain/last-index` - Get the last index of the blockchain.
- **GET** `/blockchain/:idx` - Get a specific block by index.
- **GET** `/blockchain` - Retrieve the entire blockchain.
- **GET** `/next` - Get the next block to be mined.
- **POST** `/broadcastblock` - Broadcast a newly mined block to the network.
- **GET** `/valider` - Validate the blockchain.
- **GET** `/Getbro` - Get broadcasted blocks.
- **GET** `/gas` - Get the current gas .
- **GET** `/temp` - Get the current temperature (if applicable).
- **GET** `/hum` - Get the current humidity (if applicable).
