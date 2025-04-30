import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CardRulings from "./components/CardRulings";
import { XMarkIcon } from "@heroicons/react/24/solid";

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

    const handleKeyDown = (e) => {
        if (e.key === "f" && document.activeElement !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const index = filteredCards.findIndex((c) => c.id === selectedCard?.id);
            if (index < filteredCards.length - 1) {
                setSelectedCard(filteredCards[index + 1]);
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const index = filteredCards.findIndex((c) => c.id === selectedCard?.id);
            if (index > 0) {
                setSelectedCard(filteredCards[index - 1]);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="flex flex-col h-screen font-sans">
            <div className="flex flex-1 overflow-hidden">
                {/* Linke Spalte */}
                <div className="w-1/4 border-r border-gray-300 overflow-hidden flex flex-col">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search card..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-4 py-4 border-b pr-10 outline-none"
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
                            <p>Lade Karten...</p>
                        ) : (
                            <ul ref={listRef}>
                                {filteredCards.map((card) => (
                                    <li
                                        key={card.id}
                                        className={`cursor-pointer px-3 py-3 mx-2 rounded-xl mb-1 text-sm  
                                            ${selectedCard?.id === card.id
                                                ? "bg-stone-100"
                                                : "hover:bg-stone-100"} 
                                            focus:outline-none`}
                                        onClick={() => setSelectedCard(card)}
                                    >
                                        {card.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Rechte Spalte */}
                <div className="w-3/4 p-8 overflow-y-auto">
                    {selectedCard ? (
                        <div className="flex gap-6">
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
                                    className="h-[240px] object-contain rounded"
                                />
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">Bitte wähle eine Karte aus.</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-xs text-gray-500 py-2 border-t border-gray-300">
                Karteninformationen von <a href="https://db.ygoprodeck.com/api-guide/" className="underline" target="_blank" rel="noopener noreferrer">YGOProDeck API</a>, Rulings basieren auf historischen Quellen wie Netrep und Judge-FAQs (2005).
            </footer>
        </div>
    );
}

// Sicherstellen, dass createRoot nicht doppelt aufgerufen wird
const container = document.getElementById("root");
if (!container._reactRootContainer) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}