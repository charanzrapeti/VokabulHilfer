"use client";
import React, { useEffect, useState } from "react";
import FlashcardArray from "./components/FlashcardArray/FlashcardArray";

// Define the interface for the card data
interface CardData {
  id:number;
  german: string;
  english: string;
}

export default function Home() {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    // Fetch the data from data.json
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setCards(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column', // To align cards in a column
  };

  return (
    <div style={containerStyle}>
      {cards.length > 0 ? (
        <FlashcardArray cards={cards} />
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
  );
}
