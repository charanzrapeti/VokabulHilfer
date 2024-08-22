import React, { useCallback, useEffect, useState } from "react";
import FlashcardArrayProps from "../../interfaces/IFlashcardArray";
import Flashcard from "../Flashcard/Flashcard";
import "./FlashcardArray.scss";

const colors: string[] = [
  '#FFB6C1', // Light Pink
  '#FFD700', // Gold
  '#00FF00', // Lime
  '#87CEEB', // Sky Blue
  '#FF6347', // Tomato
  '#FFA07A', // Light Salmon
  '#20B2AA', // Light Sea Green
  '#FF69B4', // Hot Pink
  '#BA55D3', // Medium Orchid
  '#FF4500', // Orange Red
];

function FlashcardArray({
  cards,
  controls = true,
  showCount = true,
  onCardChange = () => {},
  onCardFlip = () => {},
  frontContentStyle = {},
  forwardRef = { current: null },
  FlashcardArrayStyle = {},
  currentCardFlipRef,
  cycle = false,
}: FlashcardArrayProps) {
  const [cardNumber, setCardNumber] = useState(0);
  const [cardsInDisplay, setCardsInDisplay] = useState(
    !cycle ? [-1, 0, 1] : [cards.length - 1, 0, 1]
  );
  const [isOverFlow, setIsOverFlow] = useState("");
  const [currentColor, setCurrentColor] = useState(colors[Math.floor(Math.random() * colors.length)]);

  const placeFillerCard = (
    <Flashcard
      className="FlashcardArrayWrapper__empty"
      width="100%"
      backHTML=""
      frontHTML=""
    />
  );

    

  const cardsList = cards.map((card, index) => (
    <Flashcard
      key={index}
      frontHTML={card.german}
      backHTML={card.english}
      manualFlipRef={cardNumber === index ? currentCardFlipRef : undefined}
      frontCardStyle={{ ...card.frontContentStyle, backgroundColor: currentColor }}
      backCardStyle={{ ...card.backCardStyle, backgroundColor: currentColor }}
      backContentStyle={{ color: "white" , display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem", letterSpacing: "0.1rem", textAlign: "center"}}
      frontContentStyle={{ color: "white" , display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem", letterSpacing: "0.1rem", textAlign: "center"}}
      
      className={card.className}
      height={card.height || "80%"}
      width={card.width || "80%"}
      style={card.style}
      onCardFlip={(state) => {
        onCardFlip(card.id, index, state);
        setIsOverFlow("hidden");
        setTimeout(() => {
          setIsOverFlow("");
        }, 3);
      }}
    />
  ));

  const numberOfCards = cardsList.length !== undefined ? cardsList.length - 1 : 0;

  const resetArray = () => {
    setCardsInDisplay(!cycle ? [-1, 0, 1] : [cards.length - 1, 0, 1]);
    setCardNumber(0);
  };

  const nextCard = useCallback(() => {
    const currentCardNumber =
      cardNumber + 1 < numberOfCards ? cardNumber + 1 : numberOfCards;

    if (currentCardNumber < numberOfCards) {
      setIsOverFlow("hidden");
      setTimeout(() => {
        setIsOverFlow("");
      }, 90);
    }

    if (cycle) {
      setCardsInDisplay((prevState) => {
        setCardNumber(prevState[1] + 1 < cards.length ? prevState[1] + 1 : 0);
        setCurrentColor(colors[Math.floor(Math.random() * colors.length)]); // Update color on card change
        return [
          prevState[0] + 1 < cards.length ? prevState[0] + 1 : 0,
          prevState[1] + 1 < cards.length ? prevState[1] + 1 : 0,
          prevState[2] + 1 < cards.length ? prevState[2] + 1 : 0,
        ];
      });
    } else {
      setCardNumber(currentCardNumber);
      setCurrentColor(colors[Math.floor(Math.random() * colors.length)]); // Update color on card change
      setCardsInDisplay(
        currentCardNumber < numberOfCards
          ? [currentCardNumber - 1, currentCardNumber, currentCardNumber + 1]
          : [numberOfCards - 1, numberOfCards, -1]
      );
    }

    onCardChange(cards[currentCardNumber].id, currentCardNumber + 1);
  }, [cardNumber, cycle, numberOfCards]);

  const prevCard = useCallback(() => {
    const currentCardNumber = cardNumber - 1 >= 0 ? cardNumber - 1 : 0;

    if (currentCardNumber !== 0) {
      setIsOverFlow("hidden");
      setTimeout(() => {
        setIsOverFlow("");
      }, 90);
    }

    if (cycle) {
      setCardsInDisplay((prevState) => {
        const activeCard =
          prevState[1] - 1 < 0 ? cards.length - 1 : prevState[1] - 1;

        setCardNumber(
          prevState[1] - 1 >= 0 ? prevState[1] - 1 : cards.length - 1
        );
        setCurrentColor(colors[Math.floor(Math.random() * colors.length)]); // Update color on card change
        return [
          activeCard - 1 < 0 ? cards.length - 1 : activeCard - 1,
          activeCard,
          activeCard + 1 < cards.length ? activeCard + 1 : 0,
        ];
      });
    } else {
      setCardNumber(currentCardNumber);
      setCurrentColor(colors[Math.floor(Math.random() * colors.length)]); // Update color on card change
      setCardsInDisplay(
        currentCardNumber === 0
          ? [-1, 0, 1]
          : [currentCardNumber - 1, currentCardNumber, currentCardNumber + 1]
      );
    }
    onCardChange(cards[currentCardNumber].id, currentCardNumber + 1);
  }, [cardNumber, cycle, numberOfCards]);

  useEffect(() => {
    if (forwardRef.current) {
      forwardRef.current.nextCard = nextCard;
      forwardRef.current.prevCard = prevCard;
      forwardRef.current.resetArray = resetArray;
    }
  });

  return (
    <div className="FlashcardArrayWrapper" style={FlashcardArrayStyle}>
      <div
        className="FlashcardArrayWrapper__CardHolder"
        style={{ overflow: isOverFlow }}
      >
        {cardsInDisplay[0] !== -1
          ? cardsList[cardsInDisplay[0]]
          : placeFillerCard}
        {cardsList[cardsInDisplay[1]]}
        {cardsInDisplay[2] !== -1
          ? cardsList[cardsInDisplay[2]]
          : placeFillerCard}
      </div>

      {(controls || showCount) && (
        <div className="FlashcardArrayWrapper__controls">
          {controls && (
            <button onClick={() => prevCard()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{ height: "24px", width: "24px" }}
              >
                <path
                  d="M19 12a1 1 0 0 1-1 1H8.414l1.293 1.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L8.414 11H18a1 1 0 0 1 1 1z"
                  style={{ fill: "#1c1b1e", height: "24px", width: "24px" }}
                  data-name="Left"
                />
              </svg>
            </button>
          )}
          {showCount && (
            <span className="FlashcardArrayWrapper__controls--count">
              {cardNumber + 1}/{cardsList.length}
            </span>
          )}
          {controls && (
            <button onClick={() => nextCard()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{ height: "24px", width: "24px" }}
              >
                <path
                  d="m18.707 12.707-3 3a1 1 0 0 1-1.414-1.414L15.586 13H6a1 1 0 0 1 0-2h9.586l-1.293-1.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414z"
                  style={{ fill: "#1c1b1e", height: "24px", width: "24px" }}
                  data-name="Right"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FlashcardArray;
