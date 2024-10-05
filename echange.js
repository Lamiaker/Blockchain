const fs = require("fs");
const path = require("path");

// Chemin vers le fichier addresses.json
const addressesFilePath = path.join(__dirname, "./config/nodes.json");

// Fonction de mélange utilisant l'algorithme de Fisher-Yates
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fonction pour lire les adresses depuis le fichier JSON
function readAddresses() {
  const data = fs.readFileSync(addressesFilePath, "utf8");
  return JSON.parse(data);
}

// Fonction pour écrire les adresses dans le fichier JSON
function writeAddresses(addresses) {
  const content = JSON.stringify(addresses, null, 4);
  fs.writeFileSync(addressesFilePath, content, "utf8");
}

// Mélanger et réécrire les adresses chaque minute
setInterval(() => {
  let addresses = readAddresses();
  addresses = shuffle(addresses);
  writeAddresses(addresses);
  console.log("Adresses permutées :", addresses);
}, 10000); // 60000 millisecondes = 1 minute
