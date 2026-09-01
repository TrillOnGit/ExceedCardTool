export interface Card {
  name: string;
  range: [number | undefined, number | undefined];
  power?: number;
  speed?: number;
  armor?: number;
  guard?: number;
  actionText: string;
}

export const defaultCard: Card = {
  name: "New Card",
  range: [undefined, undefined],
  power: undefined,
  speed: 0,
  armor: 0,
  guard: 0,
  actionText: "",
};

export interface CardEditorProps {
  card: Card;
  onChange: (newCard: Card) => void;
}

export function CardEditor(props: CardEditorProps) {
  return (
    <div>
      <div>Card Editor</div>

      <div>
        Name:
        <input
          className="bg-gray-100 m-1"
          value={props.card.name}
          onChange={(e) =>
            props.onChange({ ...props.card, name: e.target.value })
          }
        />
      </div>
      <div>
        Range:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.range[0]}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              range: [
                Math.max(0, Math.min(9, e.target.valueAsNumber)),
                props.card.range[1],
              ],
            })
          }
        />
        ~
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.range[1]}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              range: [
                props.card.range[0],
                Math.max(0, Math.min(9, e.target.valueAsNumber)),
              ],
            })
          }
        />
      </div>
      <div>
        Power:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.power}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              power: Math.max(0, Math.min(99, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div>
        Speed:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.speed}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              speed: Math.max(0, Math.min(99, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div>
        Armor:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.armor}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              armor: Math.max(0, Math.min(99, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div>
        Guard:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.guard}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              guard: Math.max(0, Math.min(99, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div>
        Action Text:
        <div>
          <textarea
            className="bg-gray-100 m-1 h-30 w-100 resize-none"
            value={props.card.actionText}
            onChange={(e) =>
              props.onChange({ ...props.card, actionText: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
