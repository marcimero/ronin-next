import React from 'react';
import rulingsData from '../data/goat-rulings-formatted.json';

const CardRulings = ({ cardName }) => {
  const cardNameUpperCase = cardName.toUpperCase();
  const rulingData = rulingsData[cardNameUpperCase];

  if (!rulingData) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-1">Rulings</h2>
        <p className="text-gray-500">
        Aktuell liegen keine Rulings für <strong>{cardName}</strong> vor.
        </p>
      </div>
    );
  }

  const renderRulingsList = (rulings) => {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {rulings.map((ruling, index) => (
          <li key={index} className="text-gray-800">{ruling}</li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Rulings</h2>

      {rulingData.individual_faq && (
        <div className="mb-4 ruling-container">
          <h3 className="font-semibold text-md mb-1">Individual Card FAQs:</h3>
          {renderRulingsList(rulingData.individual_faq)}
        </div>
      )}

      {rulingData.netrep_rulings && (
        <div className="mb-4 ruling-container">
          <h3 className="font-semibold text-md mb-1">Netrep Rulings:</h3>
          {renderRulingsList(rulingData.netrep_rulings)}
        </div>
      )}

      {rulingData.netrep_q_and_a && (
        <div className="mb-4 ruling-container">
          <h3 className="font-semibold text-md mb-1">Netrep Q&As:</h3>
          {renderRulingsList(rulingData.netrep_q_and_a)}
        </div>
      )}
    </div>
  );
};

export default CardRulings;