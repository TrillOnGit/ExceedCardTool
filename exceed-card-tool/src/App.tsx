import { useState } from "react";
import { CardEditor, defaultCard, addNewCard, type Card } from "./CardEditor";
import { CardPreview } from "./CardPreview";
import { Sidebar } from "./Sidebar";

function App() {
  const [cards, setCards] = useState<Card[]>([defaultCard]);
  const [curCardId, setCurCardId] = useState<string>(defaultCard.id);
  const curCard = cards.find((c) => c.id == curCardId);

  const updateCurCard = (newCard: Card) => {
    setCards((oldCard) =>
      oldCard.map((c) => (c.id == curCardId ? newCard : c)),
    );
  };

  const addCard = () => {
    const newCard = addNewCard();
    setCards((oldCard) => [...oldCard, newCard]);
    setCurCardId(newCard.id);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          cards={cards}
          curCardId={curCardId}
          onSelect={setCurCardId}
          onAddCardButtonClicked={addCard}
        />
        <CardEditor key={curCardId} card={curCard} onChange={updateCurCard} />
        <CardPreview card={curCard} />
      </div>
    </>
  );
}

export default App;
