const fs = require('fs');
const path = require('path');

const mdFilePath = path.join(__dirname, '../src/data/goat-all-rulings.md');
const outputPath = path.join(__dirname, '../src/data/goat-format-rulings.json');

const rawMd = fs.readFileSync(mdFilePath, 'utf-8');
const lines = rawMd.split('\n');

const rulings = {};
let currentCard = null;
let currentSection = null;

const sectionMap = {
  'Individual Card FAQs:': 'individual_faq',
  'Netrep Rulings:': 'netrep_rulings',
  'Netrep Q&As:': 'netrep_q_and_a',
};

let currentCardData = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Neue Karte beginnt
  const headingMatch = line.match(/^####\s+(.*)/);
  if (headingMatch) {
    if (currentCard) {
      rulings[currentCard] = currentCardData;
    }
    currentCard = headingMatch[1].trim();
    currentCardData = {};
    currentSection = null;
    continue;
  }

  // Neue Section innerhalb der Karte
  if (sectionMap[line]) {
    currentSection = sectionMap[line];
    if (currentSection === 'netrep_q_and_a') {
      currentCardData[currentSection] = [];
    } else {
      currentCardData[currentSection] = [];
    }
    continue;
  }

  // Inhalt sammeln
  if (currentCard && currentSection && line.startsWith('*')) {
    if (currentSection === 'netrep_q_and_a') {
      const questionMatch = line.match(/^\*\s*Q:\s*(.*)/i);
      const nextLine = lines[i + 1]?.trim();
      const answerMatch = nextLine?.match(/^A:\s*(.*)/i);

      if (questionMatch && answerMatch) {
        currentCardData[currentSection].push({
          question: questionMatch[1].trim(),
          answer: answerMatch[1].trim(),
        });
        i++; // Antwortzeile überspringen
      }
    } else {
      currentCardData[currentSection].push(line.replace(/^\*\s*/, '').trim());
    }
  }
}

// Letzte Karte speichern
if (currentCard) {
  rulings[currentCard] = currentCardData;
}

fs.writeFileSync(outputPath, JSON.stringify(rulings, null, 2), 'utf-8');
console.log(`✅ Strukturierte Rulings-JSON gespeichert (${Object.keys(rulings).length} Karten).`);