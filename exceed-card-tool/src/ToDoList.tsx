import { useState } from "react";

interface EntryProps {
  index: number;
  text: string;
  isComplete: boolean;
  onChangeText: (v: string) => void;
  onChangeComplete: (v: boolean) => void;
  onRemoveButtonPressed: () => void;
}

function Entry(props: EntryProps) {
  return (
    <div>
      {props.index + "."}
      <input
        type="text"
        disabled={props.isComplete}
        value={props.text}
        onChange={(e) => props.onChangeText(e.target.value)}
      />
      <input
        type="checkbox"
        checked={props.isComplete}
        onChange={(e) => props.onChangeComplete(e.target.checked)}
      />

      <button onClick={() => props.onRemoveButtonPressed()}>Remove</button>
    </div>
  );
}

export function ToDoList() {
  const [entries, setEntries] = useState(initialState);

  const addEntry = () => {
    setEntries([...entries, { text: "", isComplete: false }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((entry, i) => (i == index ? false : true)));
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
              key={i}
              index={i + 1}
              text={e.text}
              isComplete={e.isComplete}
              onChangeText={(newText) => {
                setEntries(
                  entries.map((oldEntry, j) =>
                    j == i ? { ...oldEntry, text: newText } : oldEntry,
                  ),
                );
              }}
              onChangeComplete={(newState) => {
                setEntries(
                  entries.map((oldEntry, j) =>
                    j == i ? { ...oldEntry, isComplete: newState } : oldEntry,
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
  text: string;
  isComplete: boolean;
}

const initialState: EntryState[] = [
  { text: "", isComplete: false },
  { text: "", isComplete: false },
  { text: "", isComplete: false },
  { text: "", isComplete: false },
  { text: "", isComplete: false },
];
