import clsx from "clsx";
import type { Card } from "./CardEditor";

export interface SidebarProps {
  cards: Card[];
  curCardId: string | null;
  className?: string;
  onSelect: (id: string) => void;
  onAddCardButtonClicked: () => void;
  onRemoveCardButtonClicked: (id: string) => void;
  onDownloadCardsImage: () => void;
  onSaveJSONClicked: () => void;
  onLoadJSONClicked: (cards: Card[]) => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <div
      className={clsx(
        "w-58 sticky top-0 border-r p-2 flex flex-col h-screen",
        props.className,
      )}
    >
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        <h1 className="flex shrink-0 justify-center items-center font-bold">
          Decklist
          <button
            onClick={props.onAddCardButtonClicked}
            className="text-xs bg-green-100 text-black px-2 m-2 py-1 cursor-pointer"
          >
            Add Card
          </button>
        </h1>
        <div className="max-h-[75vh] overflow-y-auto bg-gray-600 text-white px-2 py-1 w-full">
          {props.cards.map((card) => (
            <>
              <button
                key={card.id}
                onClick={() => props.onSelect(card.id)}
                className={`py-1 my-[2px] cursor-pointer w-full ${
                  card.id == props.curCardId
                    ? "bg-gray-900 text-white"
                    : `${getCardBarColor(card)} text-black`
                }`}
              >
                {card.name || "Unnamed"}
                {(card.cardType === "extra" || card.cardType === "character") &&
                  card.isExceedSide &&
                  " (EX)"}
              </button>
            </>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() =>
              props.curCardId &&
              props.onRemoveCardButtonClicked(props.curCardId)
            }
            className="text-xs bg-red-100 text-black font-bold px-2 mt-2 py-1 cursor-pointer"
          >
            Delete Selected
          </button>
        </div>
        {/* Page bottom */}
        <div className="border-t shrink-0 justify-center p-1 mt-auto flex flex-col">
          <button
            onClick={props.onDownloadCardsImage}
            className="text-xs rounded-xs bg-gray-200 text-black my-2 px-2 py-1 cursor-pointer"
          >
            Export All Images
          </button>
          <div className="flex justify-center text-center mb-1">
            Save/Load Deck JSON:
          </div>
          <div className="flex justify-center items-center">
            <div>
              <button
                onClick={props.onSaveJSONClicked}
                className="text-xs bg-gray-200 rounded-xs text-black m-1 px-2 py-1 grow cursor-pointer"
              >
                Save
              </button>

              <JsonUpload
                onUpload={(cards) => {
                  props.onLoadJSONClicked(cards);
                }}
              />
            </div>
          </div>
        </div>
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
    <label className="text-xs rounded-xs bg-gray-200 text-black m-1 px-2 py-1 cursor-pointer flex-1">
      Load
      <input
        type="file"
        id="json_upload"
        name="json_upload"
        className="hidden"
        accept=".json"
        onChange={onChange}
      />
    </label>
  );
}

const getCardBarColor = (card: Card): string => {
  const type = card.cardType;
  switch (type) {
    case "special":
      return "bg-slate-300";
    case "ultra":
      return "bg-orange-300";
    case "character":
      return card.isExceedSide
        ? "bg-linear-to-r from bg-yellow-300 to-blue-400"
        : "bg-linear-to-t from bg-blue-300 to-blue-400 ";
    case "extra":
      return card.isExceedSide
        ? "bg-linear-to-r from bg-yellow-300 to-purple-400"
        : "bg-linear-to-t from bg-purple-300 to-purple-400";
  }
};
