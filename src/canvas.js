import React, { useState } from "react";
import DraggableCard from "./dragablecard";
import { Document, Packer, Paragraph, TextRun } from "docx";

const Canvas = () => {
  const [cards, setCards] = useState([]);

  const addCard = () => {
    setCards([...cards, { id: Date.now(), header: "", content: "", isBold: false, x: 100, y: 100 }]);
  };

  const updateCard = (id, header, content, isBold) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, header, content, isBold } : card
      )
    );
  };

 




  // Helper function to parse rich text content
  const parseRichText = (content) => {
    const regex = /<b>(.*?)<\/b>|<i>(.*?)<\/i>|([^<]+)/g;
    const textRuns = [];
    let match;
  
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) {
        // If the match is bold
        textRuns.push(new TextRun({
          text: match[1],
          bold: true,
          size:30,
        }));
      } else if (match[2]) {
        // If the match is italic
        textRuns.push(new TextRun({
          text: match[2],
          italic: true,
          size:30,
        }));
      } else if (match[3]) {
        // If it's plain text
        textRuns.push(new TextRun({text:match[3],size:30}));
        
      }
    }
    return textRuns;
  };
  
  const saveCardsToDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: cards.map((card, index) => {
            return [
              // Main Bullet (Header)
              new Paragraph({
                bullet: {
                  level: 0, // Main bullet
                },
                children: [
                  new TextRun({
                    text: card.header,
                    bold: true,
                    size: 50,
                  }),
                ],
              }),
  
              // Sub Bullet (Content) with rich text parsing
              new Paragraph({
                bullet: {
                  level: 1, // Sub-bullet (tabbed)
                },
                children: parseRichText(card.content), // Parse rich text here
                indentation: { left: 360 }, // Indentation for sub-bullet
              }),
  
              new Paragraph({ text: "" }), // Add space between cards
            ];
          }).flat(),
        },
      ],
    });
  
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cards.docx";
    link.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      <button onClick={addCard}>Add Card</button>
      <button onClick={saveCardsToDocx}>Save Cards to DOCX</button>
      <div>
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            id={card.id}
            initialX={card.x}
            initialY={card.y}
            updateCard={updateCard}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
