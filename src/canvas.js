import React, { useState } from 'react';
import DraggableCard from './dragablecard';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  
  // Function to add a new card to the canvas
  const addCard = () => {
    setCards([...cards, { id: Date.now(), x: 100, y: 100 }]); // New card added with random position
  };

  return (
    <div>
      <button onClick={addCard}>Add Card</button>
      <div
       
      >
        {cards.map((card) => (
          <DraggableCard key={card.id} id={card.id} initialX={card.x} initialY={card.y} />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
