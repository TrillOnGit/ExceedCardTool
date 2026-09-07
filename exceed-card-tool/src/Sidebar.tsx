import type { Card } from "./CardEditor";

export interface SidebarProps {
  cards: Card[];
  curCardId: string;
  onSelect: (id: string) => void;
  onAddCardButtonClicked: () => void;
  onRemoveCardButtonClicked: (id: string) => void;
  onDownloadCardsImage: () => void;
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
      <button
        onClick={props.onDownloadCardsImage}
        className="text-xs bg-gray-200 text-black px-2 py-1 cursor-pointer"
      >
        Download Cards Image
      </button>
    </div>
  );
}
