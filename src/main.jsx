import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CardRulings from "./components/CardRulings";

function App() {
    const [cards, setCards] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const filteredCards = cards.filter((card) => card.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="flex h-screen font-sans">
            {/* Linke Spalte */}
            <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto max-h-screen">
                <input
                    type="text"
                    placeholder="Search card..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border"
                />
                {loading ? (
                    <p>Lade Karten...</p>
                ) : (
                    <ul>
                        {filteredCards.map((card) => (
                            <li
                                key={card.id}
                                className={`cursor-pointer px-2 py-1
        ${selectedCard?.id === card.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                                onClick={() => setSelectedCard(card)}
                            >
                                {card.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Rechte Spalte */}
            <div className="w-3/4 p-8 overflow-y-auto max-h-screen">
                {selectedCard ? (
                    <div className="flex gap-6">
                        {/* Linke Seite: Textinfos */}
                        <div className="flex-1">
                            <div className="">
                                <h2 className="text-2xl font-bold mb-1">{selectedCard.name}</h2>
                                <p className="text-gray-700">
                                    {selectedCard.type.includes("Monster") ? (
                                        <>
                                            {selectedCard.type} ({selectedCard.race}, {selectedCard.attribute},{" "}
                                            Level {selectedCard.level}, {selectedCard.atk} ATK, {selectedCard.def} DEF)
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
                            </div>
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
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);