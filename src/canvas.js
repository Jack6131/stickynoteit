import React, { useState } from 'react';
import DraggableCard from './dragablecard';

const Canvas = () => {
  const [cards, setCards] = useState([]);

  // Function to add a new card
  const addCard = () => {
    setCards([...cards, { id: Date.now(), x: 100, y: 100, header: '', content: '' }]);
  };

  // Function to update card content in the parent state
  const updateCard = (id, header, content) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, header, content } : card
      )
    );
  };

  // Download all card information as a text file
  const downloadTxtFile = () => {
    const text = cards.map(card => `Header: ${card.header}\nContent: ${card.content}\n\n`).join('');
    const file = new Blob([text], { type: 'text/plain' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'cards.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <button onClick={addCard}>Add Card</button>
      <button onClick={downloadTxtFile}>Download Cards as TXT</button>
      <div>
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            id={card.id}
            initialX={card.x}
            initialY={card.y}
            header={card.header}
            content={card.content}
            updateCard={updateCard}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
