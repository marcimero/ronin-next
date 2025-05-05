import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CardRulings from "./components/CardRulings";
import { XMarkIcon } from "@heroicons/react/24/solid";
import normalMonsterIcon from "./assets/icons/normal-monster.svg";
import effectMonsterIcon from "./assets/icons/effect-monster.svg";
import spellCardIcon from "./assets/icons/spell-card.svg";
import trapCardIcon from "./assets/icons/trap-card.svg";
import fusionMonsterIcon from "./assets/icons/fusion-monster.svg";
import ritualMonsterIcon from "./assets/icons/ritual-monster.svg";

function getTypeIcon(card) {
  const type = card.type.toLowerCase();

  if (type.includes("normal monster")) return normalMonsterIcon;
  if (type.includes("effect monster")) return effectMonsterIcon;
  if (type.includes("fusion monster")) return fusionMonsterIcon;
  if (type.includes("ritual monster")) return ritualMonsterIcon;
  if (type.includes("spell")) return spellCardIcon;
  if (type.includes("trap")) return trapCardIcon;

  return null;
}

function App() {
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?format=goat");
        const data = await res.json();
        setCards(data.data);
      } catch (err) {
        console.error("Fehler beim Laden der Karten:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (filteredCards.length > 0) {
      setSelectedCard(filteredCards[0]);
    } else {
      setSelectedCard(null);
    }
  }, [query]);

  // const handleKeyDown = (e) => {
  //   if (e.key === "f" && document.activeElement !== inputRef.current) {
  //     e.preventDefault();
  //     inputRef.current?.focus();
  //   } else if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     const index = filteredCards.findIndex((c) => c.id === selectedCard?.id);
  //     if (index < filteredCards.length - 1) {
  //       setSelectedCard(filteredCards[index + 1]);
  //     }
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     const index = filteredCards.findIndex((c) => c.id === selectedCard?.id);
  //     if (index > 0) {
  //       setSelectedCard(filteredCards[index - 1]);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // });

  return (
    <div className="flex flex-col h-screen font-sans border-gray-300">
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Linke Spalte */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 overflow-hidden flex flex-col max-h-[50vh] md:max-h-full">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search card..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-4 border-b border-gray-300 pr-10 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 py-2">
            {loading ? (
              <p className="px-4 py-3">Loading cards...</p>
            ) : (
              <ul ref={listRef}>
                {filteredCards.map((card) => (
                  <li
                    key={card.id}
                    className={`cursor-pointer px-4 py-3 mb-1 text-sm  
                      ${selectedCard?.id === card.id
                        ? "bg-zinc-300"
                        : "hover:bg-zinc-200"} 
                      focus:outline-none flex items-center`}
                    onClick={() => setSelectedCard(card)}
                  >
                    {getTypeIcon(card) && (
                      <img
                        src={getTypeIcon(card)}
                        alt=""
                        className="w-4 h-4 mr-2"
                      />
                    )}
                    <span>{card.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Rechte Spalte */}
        <div className="w-full md:w-3/4 p-4 md:p-8 overflow-y-auto">
          {selectedCard ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Linke Seite: Textinfos */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{selectedCard.name}</h2>
                <p className="text-gray-700">
                  {selectedCard.type.includes("Monster") ? (
                    <>
                      {selectedCard.type} ({selectedCard.race}, {selectedCard.attribute}, Level{" "}
                      {selectedCard.level}, {selectedCard.atk} ATK, {selectedCard.def} DEF)
                    </>
                  ) : (
                    <>
                      {selectedCard.race} {selectedCard.type}
                    </>
                  )}
                </p>
                {selectedCard.desc && (
                  <p className="mt-4 whitespace-pre-line text-gray-800">{selectedCard.desc}</p>
                )}
                <div className="mt-6">
                  <CardRulings cardName={selectedCard.name} />
                </div>
              </div>

              {/* Rechte Seite: Bild */}
              {selectedCard.card_images?.[0]?.image_url && (
                <img
                  src={selectedCard.card_images[0].image_url}
                  alt={selectedCard.name}
                  className="h-[240px] object-contain rounded self-start"
                />
              )}
            </div>
          ) : (
            <p className="text-gray-500">Please select a card.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-2 border-t border-gray-300">
        Card information from{" "}
        <a
          href="https://db.ygoprodeck.com/api-guide/"
          className="underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          YGOProDeck API
        </a>
        , rulings are based on historical sources such as Netrep and Judge FAQs (2005).
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);