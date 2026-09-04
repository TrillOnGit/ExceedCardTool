import { useState } from "react";
import { CardEditor, defaultCard } from "./CardEditor";
import { CardPreview } from "./CardPreview";
import { Sidebar } from "./Sidebar";

function App() {
  const [card, setCard] = useState(defaultCard);

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar card={card} />
        <CardEditor card={card} onChange={setCard} />
        <CardPreview card={card} />
      </div>
    </>
  );
}

export default App;
