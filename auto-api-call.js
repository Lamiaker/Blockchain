const axios = require("axios");

// Liste des URLs à affecter
const nodeUrls = [
  
  "http://0.0.0.0:4000/hum",
  "http://0.0.0.0:4001/gas",
  "http://0.0.0.0:4002/temp",
  // "http://0.0.0.0:4003/sol",
];

let currentIndex = 0;

// Fonction pour effectuer l'appel à une URL spécifique
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    console.log(`Données reçues de ${url}:`, response.data);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données de ${url} :`,
      error.message
    );
  }
}

// Fonction pour alterner l'URL à chaque appel
function rotateUrl() {
  const url = nodeUrls[currentIndex];
  currentIndex = (currentIndex + 1) % nodeUrls.length; // Avancer au prochain index circulairement
  return url;
}

// Fonction principale pour exécuter l'appel à intervalles réguliers
async function main() {
  setInterval(async () => {
    const url = rotateUrl();
    await fetchData(url);
  }, 10000); // 60000 millisecondes = 1 minute
}

// Démarrer le programme principal
main().catch((err) => console.error("Erreur principale :", err));
