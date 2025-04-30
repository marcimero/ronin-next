const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/goat-rulings.json');
const outputPath = path.join(__dirname, '../src/data/goat-rulings-formatted.json');
const sections = {
  'Individual Card FAQs:': 'individual_faq',
  'Netrep Rulings:': 'netrep_rulings',
  'Netrep Q&As:': 'netrep_q_and_a',
};

const rawData = fs.readFileSync(inputPath, 'utf-8');
const rawJson = JSON.parse(rawData);
const formattedJson = {};

Object.entries(rawJson).forEach(([cardName, rulingsText]) => {
  const lines = rulingsText.split('\n').map(line => line.trim());
  const result = {};

  let currentSectionKey = null;

  for (let line of lines) {
    if (!line) continue;

    // Neue Section?
    if (sections[line]) {
      currentSectionKey = sections[line];
      result[currentSectionKey] = [];
      continue;
    }

    // Listenpunkt?
    if (line.startsWith('*') && currentSectionKey) {
      result[currentSectionKey].push(line.replace(/^\*\s*/, ''));
    }
  }

  if (Object.keys(result).length > 0) {
    formattedJson[cardName] = result;
  }
});

fs.writeFileSync(outputPath, JSON.stringify(formattedJson, null, 2), 'utf-8');
console.log('✅ Formatiertes JSON gespeichert unter:', outputPath);