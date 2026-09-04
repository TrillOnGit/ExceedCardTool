import type { Card } from "./CardEditor";

export interface SidebarProps {
  card: Card;
}

export function Sidebar(props: SidebarProps) {
  return (
    <div className="w-48 border-r p-2">
      <div className="text-black mb-1">Decklist</div>
      <div className="bg-gray-600 text-white px-2 py-1">
        {props.card.name || "Unnamed"}
      </div>
    </div>
  );
}
