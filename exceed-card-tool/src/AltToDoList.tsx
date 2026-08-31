import { useState } from "react";

interface EntryProps {
  index: number;
  text: string;
  onChangeText: (v: string) => void;
  onRemoveButtonPressed: () => void;
}

function Entry(props: EntryProps) {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div>
      {props.index + "."}
      <input
        type="text"
        disabled={isComplete}
        value={props.text}
        onChange={(e) => props.onChangeText(e.target.value)}
      />
      <input
        type="checkbox"
        checked={isComplete}
        onChange={(e) => setIsComplete(e.target.checked)}
      />

      <button onClick={() => props.onRemoveButtonPressed()}>Remove</button>
    </div>
  );
}

export function AltToDoList() {
  const [nextId, setNextId] = useState(initialNextId);
  const [entries, setEntries] = useState(initialState);

  const addEntry = () => {
    setEntries([...entries, { id: nextId, text: "" }]);
    setNextId(nextId + 1);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => (i == index ? false : true)));
  };

  return (
    <>
      <div>
        To-Do List <button onClick={addEntry}>Add Entry</button>
      </div>

      <div>
        {entries.map((e, i) => (
          <>
            <Entry
              key={e.id}
              index={i + 1}
              text={e.text}
              onChangeText={(newText) => {
                setEntries(
                  entries.map((oldEntry, j) =>
                    j == i ? { ...oldEntry, text: newText } : oldEntry,
                  ),
                );
              }}
              onRemoveButtonPressed={() => removeEntry(i)}
            ></Entry>
          </>
        ))}
      </div>
    </>
  );
}

interface EntryState {
  id: number;
  text: string;
}

const initialState: EntryState[] = [
  { id: 1, text: "" },
  { id: 2, text: "" },
  { id: 3, text: "" },
  { id: 4, text: "" },
  { id: 5, text: "" },
];

const initialNextId = 6;
