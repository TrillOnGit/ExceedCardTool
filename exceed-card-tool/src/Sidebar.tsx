import type { Card } from "./CardEditor";

export interface SidebarProps {
  cards: Card[];
  curCardId: string;
  onSelect: (id: string) => void;
  onAddCardButtonClicked: () => void;
  onRemoveCardButtonClicked: (id: string) => void;
  onDownloadCardsImage: () => void;
  onSaveJSONClicked: () => void;
  onLoadJSONClicked: (cards: Card[]) => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <div className="w-48 border-r p-2 ">
      <div className="text-black mb-1 ">Decklist</div>
      <div className="bg-gray-600 text-white px-2 py-1 w-full">
        {props.cards.map((card) => (
          <>
            <button
              key={card.id}
              onClick={() => props.onSelect(card.id)}
              className={`px-2 py-1 cursor-pointer w-full ${
                card.id == props.curCardId
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {card.name || "Unnamed"}
            </button>
            <button
              onClick={() => props.onRemoveCardButtonClicked(card.id)}
              className="text-xs bg-gray-200 text-black px-2 py-1 cursor-pointer"
            >
              Delete
            </button>
          </>
        ))}
      </div>
      <button
        onClick={props.onAddCardButtonClicked}
        className="text-xs bg-gray-200 text-black px-2 py-1 cursor-pointer"
      >
        Add Card
      </button>
      <div>
        <button
          onClick={props.onDownloadCardsImage}
          className="text-xs bg-gray-200 text-black px-2 py-1 cursor-pointer"
        >
          Export All Images
        </button>
      </div>
      <div>
        <button
          onClick={props.onSaveJSONClicked}
          className="text-xs bg-gray-200 text-black px-2 py-1 cursor-pointer"
        >
          Save Cards JSON
        </button>
      </div>
      <div>
        Load Cards JSON:
        <JsonUpload
          onUpload={(cards) => {
            (console.log("Test"), props.onLoadJSONClicked(cards));
          }}
        />
      </div>
    </div>
  );
}

interface JSONUploadProps {
  onUpload: (jsonData: Card[]) => void;
}

function JsonUpload(props: JSONUploadProps) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let cardsParsed = null;
        try {
          console.log(reader.result);
          cardsParsed = JSON.parse(reader.result as string) as Card[];
        } catch (err) {
          console.log("Cards failed to parse from JSON.");
          return;
        }

        props.onUpload(cardsParsed);
      };
      reader.readAsText(file);
    }
  };

  return (
    <input
      type="file"
      id="json_upload"
      name="json_upload"
      className="text-xs bg-gray-200 text-black w-45 px-2 py-1 cursor-pointer"
      accept=".json"
      onChange={onChange}
    />
  );
}
