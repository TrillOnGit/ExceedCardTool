import { useState } from "react";
import { AltToDoList } from "./AltToDoList";
import { CardEditor, defaultCard } from "./CardEditor";
import { ToDoList } from "./ToDoList";

function App() {
  const [card, setCard] = useState(defaultCard);
  return (
    <>
      {/* <ToDoList /> */}
      {/* <AltToDoList /> */}
      <CardEditor card={card} onChange={setCard} />
    </>
  );
}

export default App;
