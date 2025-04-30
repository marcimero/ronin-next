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
  const match = line.match(/^####\s+(.*)/);
  if (match) {
    if (currentCard && buffer.length > 0) {
      rulings[currentCard] = buffer.join('\n').trim();
    }
    currentCard = match[1].trim();
    buffer = [];
  } else {
    if (currentCard) {
      buffer.push(line);
    }
  }
}

// letzte Karte sichern
if (currentCard && buffer.length > 0) {
  rulings[currentCard] = buffer.join('\n').trim();
}

fs.writeFileSync(outputPath, JSON.stringify(rulings, null, 2), 'utf-8');

console.log('✅ goat-rulings.json erfolgreich erstellt mit', Object.keys(rulings).length, 'Einträgen.');