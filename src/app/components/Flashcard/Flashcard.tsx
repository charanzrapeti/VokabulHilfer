import React, { useState, useCallback, MutableRefObject } from "react";
import FlashcardProps from "../../interfaces/IFlashcard";
import "./Flashcard.scss";



function Flashcard({
  frontHTML,
  frontCardStyle,
  frontContentStyle,
  backHTML,
  backCardStyle,
  backContentStyle,
  className = "",
  style,
  height,
  borderRadius = "1rem",
  width,
  onCardFlip = (state = false) => {},
  manualFlipRef,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const onManualFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
    onCardFlip(!isFlipped);
  }, [isFlipped, onCardFlip]);

  // Assign the flip function if manualFlipRef is provided
  if (manualFlipRef && manualFlipRef.current !== null) {
    manualFlipRef.current = onManualFlip;
  }

  return (
    <div
      className={`FlashcardWrapper ${className}`}
      style={{
        height: height,
        width: width,
        ...style,
      }}
    >
      <div
        className={`FlashcardWrapper__item ${
          isFlipped ? "FlashcardWrapper__item--flip" : ""
        }`}
        style={{
          borderRadius: borderRadius,
        }}
        onClick={() => {
          if (manualFlipRef) return;
          setIsFlipped(!isFlipped);
          onCardFlip(!isFlipped);
        }}
      >
        <div
          className="FlashcardWrapper__item--front"
          style={{
            ...frontCardStyle,
            cursor: manualFlipRef?.current ? "default" : "pointer",
          }}
        >
          {typeof frontHTML !== "string" ? (
            <div
              className="FlashcardWrapper__item--content"
              style={frontContentStyle}
            >
              {frontHTML}
            </div>
          ) : (
            <div
              className="FlashcardWrapper__item--content"
              dangerouslySetInnerHTML={{ __html: frontHTML }}
              style={frontContentStyle}
            />
          )}
        </div>
        <div
          className="FlashcardWrapper__item--back"
          style={{
            ...backCardStyle,
            cursor: manualFlipRef?.current ? "default" : "pointer",
          }}
        >
          {typeof backHTML !== "string" ? (
            <div
              className="FlashcardWrapper__item--content"
              style={backContentStyle}
            >
              {backHTML}
            </div>
          ) : (
            <div
              className="FlashcardWrapper__item--content"
              dangerouslySetInnerHTML={{ __html: backHTML }}
              style={backContentStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
