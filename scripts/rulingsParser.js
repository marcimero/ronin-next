const fs = require('fs');
const path = require('path');

const mdFilePath = path.join(__dirname, '../src/data/goat-all-rulings.md');
const outputPath = path.join(__dirname, '../src/data/goat-rulings.json');

const rawMd = fs.readFileSync(mdFilePath, 'utf-8');

const lines = rawMd.split('\n');

const rulings = {};
let currentCard = null;
let buffer = [];

for (let line of lines) {
  const headingMatch = line.match(/^####\s+(.*)/);
  if (headingMatch) {
    if (currentCard && buffer.length > 0) {
      rulings[currentCard] = buffer.join('\n').trim();
    }
    currentCard = headingMatch[1].trim();
    buffer = [];
  } else if (currentCard) {
    buffer.push(line);
  }
}

// Letzten Eintrag speichern
if (currentCard && buffer.length > 0) {
  rulings[currentCard] = buffer.join('\n').trim();
}

fs.writeFileSync(outputPath, JSON.stringify(rulings, null, 2), 'utf-8');
console.log(`✅ JSON-Datei erfolgreich erstellt (${Object.keys(rulings).length} Kartenrulings).`);