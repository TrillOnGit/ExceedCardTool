import { useState } from "react";
import { AltToDoList } from "./AltToDoList";
import { CardEditor, defaultCard } from "./CardEditor";
import { ToDoList } from "./ToDoList";
import { CardPreview } from "./CardPreview";

function App() {
  const [card, setCard] = useState(defaultCard);
  return (
    <>
      {/* <ToDoList /> */}
      {/* <AltToDoList /> */}
      <div className="flex">
        <CardEditor card={card} onChange={setCard} />
        <CardPreview card={card} />
      </div>
    </>
  );
}

export default App;
