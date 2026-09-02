import { useState } from "react";
import { CardEditor, defaultCard } from "./CardEditor";
import { CardPreview } from "./CardPreview";

function App() {
  const [card, setCard] = useState(defaultCard);

  return (
    <>
      <div className="flex">
        <CardEditor card={card} onChange={setCard} />
        <CardPreview card={card} />
      </div>
    </>
  );
}

export default App;
