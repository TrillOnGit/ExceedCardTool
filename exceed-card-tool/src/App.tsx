import { useState } from "react";
import { CardEditor, defaultCard, addNewCard, type Card } from "./CardEditor";
import {
  CardPreview,
  drawCard,
  loadImage,
  useCardImageData,
} from "./CardPreview";
import { Sidebar } from "./Sidebar";

function App() {
  const [cards, setCards] = useState<Card[]>([defaultCard]);
  const [curCardId, setCurCardId] = useState<string | null>(defaultCard.id);
  const curCard = cards.find((c) => c.id == curCardId);

  const cardImageData = useCardImageData();

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

  const removeCard = (id: string) => {
    if (id == curCardId) {
      setCurCardId(null);
    }
    setCards(cards.filter((card) => card.id != id));
  };

  const downloadCardsImage = async () => {
    // const canvas = document.getElementById("cards-image") as HTMLCanvasElement;
    // if (!canvas) return;
    const link = document.createElement("a");
    const filename = "cardsheet";
    link.download = `${filename}.png`;
    link.href = await generateCardsCanvas();

    link.click();
  };

  const generateCardsCanvas = async () => {
    // width of 750px, height of 1024
    const canvas = new OffscreenCanvas(750 * cards.length, 1024);

    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const xOffset = 750 * i;
      const userImage = await loadImage(card.cardImage);
      const userIcon = await loadImage(
        card.cardType == "special" || card.cardType == "ultra"
          ? card.cardIcon
          : undefined,
      );
      ctx.save();
      ctx.translate(xOffset, 0);
      drawCard(ctx, card, userImage, userIcon, cardImageData);
      ctx.restore();

      console.log("Card Attempted to be generated to canvas");
    }
    return URL.createObjectURL(await canvas.convertToBlob());
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          cards={cards}
          curCardId={curCardId}
          onSelect={setCurCardId}
          onAddCardButtonClicked={addCard}
          onRemoveCardButtonClicked={removeCard}
          onDownloadCardsImage={downloadCardsImage}
        />
        {curCardId != null && (
          <>
            <CardEditor
              key={curCardId}
              card={curCard}
              onChange={updateCurCard}
            />
            <CardPreview card={curCard} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
