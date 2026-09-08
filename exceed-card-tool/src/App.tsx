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
    const link = document.createElement("a");
    let filename = "Specials_Cardsheet";
    const deckCards = cards.filter(
      (card) => card.cardType === "special" || card.cardType === "ultra",
    );
    const characterFaceCards = cards.filter(
      (card) => card.cardType === "character",
    );

    const extraFaceCards = cards.filter((card) => card.cardType === "extra");
    link.download = `${filename}.png`;

    link.href = await generateCardsCanvas(deckCards);
    link.click();

    // Create and download images for each character card
    for (let i = 0; i < characterFaceCards.length; i++) {
      const downloadTarget = characterFaceCards[i];
      let filename = downloadTarget.isExceedSide
        ? `${downloadTarget.name}_Exceeded_Character_Card`
        : `${downloadTarget.name}_Character_Card`;
      link.download = `${filename}.png`;
      link.href = await generateCardsCanvas([downloadTarget]);
      link.click();
    }

    // Create and download images for each extra card
    for (let i = 0; i < extraFaceCards.length; i++) {
      const downloadTarget = extraFaceCards[i];
      let filename = downloadTarget.isExceedSide
        ? `${downloadTarget.name}_Exceeded_Extra_Card`
        : `${downloadTarget.name}_Extra_Card`;
      link.download = `${filename}.png`;
      link.href = await generateCardsCanvas([downloadTarget]);
      link.click();
    }
  };

  const generateCardsCanvas = async (cardArray: Card[]) => {
    // width of 750px, height of 1024
    const canvas = new OffscreenCanvas(750 * cardArray.length, 1024);

    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
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

  const saveJSON = () => {
    const json = JSON.stringify(cards, null, 4);
    const jsonBlob = new Blob([json], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.download = `Exceed_JSON.json`;
    link.href = jsonUrl;
    link.click();
    console.log("saveJSON triggered.");
  };

  const loadJSON = (cards: Card[]) => {
    setCards(cards);
    if (cards[0]) {
      setCurCardId(cards[0].id);
    } else {
      setCurCardId(null);
    }
    console.log("loadJSON Card Generation Attempted");
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
          onSaveJSONClicked={saveJSON}
          onLoadJSONClicked={loadJSON}
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
