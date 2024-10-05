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



