import blankIcon from "./assets/blankicon.png";

export interface Card {
  id: string;
  name: string;
  resourceCost: number;
  range: [number | undefined, number | undefined];
  power?: number;
  speed: number;
  armor?: number;
  guard?: number;
  actionText: string;
  flavorText: string;
  isContinuousBoost: boolean;
  boostName: string;
  boostText: string;
  boostForceCost: number;
  cardImage?: string;
  cardIcon?: string;
  isUltra: boolean;
}

export const defaultCard: Card = {
  id: crypto.randomUUID(),
  name: "New Card",
  resourceCost: 0,
  range: [undefined, undefined],
  power: undefined,
  speed: 0,
  armor: 0,
  guard: 0,
  actionText: "",
  flavorText: "",
  isContinuousBoost: false,
  boostName: "",
  boostText: "",
  boostForceCost: 0,
  cardImage: undefined,
  cardIcon: blankIcon,
  isUltra: false,
};

export const addNewCard = (): Card => {
  return {
    ...defaultCard,
    id: crypto.randomUUID(),
  };
};

export interface CardEditorProps {
  card: Card;
  onChange: (newCard: Card) => void;
}

export function CardEditor(props: CardEditorProps) {
  // Handler that sets the uploaded card image
  const handleCardImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        props.onChange({ ...props.card, cardImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        props.onChange({ ...props.card, cardIcon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
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
        <label>
          Ultra:
          <input
            type="checkbox"
            className="bg-gray-100 m-1"
            checked={props.card.isUltra}
            onChange={() =>
              props.onChange({ ...props.card, isUltra: !props.card.isUltra })
            }
          />
          {props.card.isUltra}
        </label>

        {props.card.isUltra && (
          <>
            Gauge Cost:
            <input
              type="number"
              className="bg-gray-100 w-10 m-1"
              value={props.card.resourceCost ?? ""}
              onChange={(e) =>
                props.onChange({
                  ...props.card,
                  resourceCost: Math.max(
                    0,
                    Math.min(9, e.target.valueAsNumber),
                  ),
                })
              }
            />
          </>
        )}
        {!props.card.isUltra && (
          <>
            Force Cost:
            <input
              type="number"
              className="bg-gray-100 w-10 m-1"
              value={props.card.resourceCost ?? ""}
              onChange={(e) =>
                props.onChange({
                  ...props.card,
                  resourceCost: Math.max(
                    0,
                    Math.min(9, e.target.valueAsNumber),
                  ),
                })
              }
            />
          </>
        )}
      </div>
      <div>
        Range:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.range[0] ?? ""}
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
          value={props.card.range[1] ?? ""}
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
          value={props.card.power ?? ""}
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
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              props.onChange({
                ...props.card,
                speed: Math.max(0, Math.min(99, e.target.valueAsNumber)),
              });
            }
          }}
        />
      </div>
      <div>
        Armor:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.armor}
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              props.onChange({
                ...props.card,
                armor: Math.max(0, Math.min(99, e.target.valueAsNumber)),
              });
            }
          }}
        />
      </div>
      <div>
        Guard:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={props.card.guard}
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              props.onChange({
                ...props.card,
                guard: Math.max(0, Math.min(99, e.target.valueAsNumber)),
              });
            }
          }}
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
      <div>
        Flavor Text:
        <div>
          <textarea
            className="bg-gray-100 h-12 w-100 resize-none"
            value={props.card.flavorText}
            onChange={(e) =>
              props.onChange({ ...props.card, flavorText: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        Continuous Boost:
        <input
          type="checkbox"
          className="bg-gray-100 m-1"
          checked={props.card.isContinuousBoost}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              isContinuousBoost: e.target.checked,
            })
          }
        ></input>
        Boost Force Cost:
        <input
          type="number"
          className="bg-gray-100 w-10 m-1"
          value={props.card.boostForceCost}
          onChange={(e) =>
            props.onChange({
              ...props.card,
              boostForceCost: Math.max(0, Math.min(9, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div>
        Boost Name:
        <input
          className="bg-gray-100 m-1"
          value={props.card.boostName}
          onChange={(e) =>
            props.onChange({ ...props.card, boostName: e.target.value })
          }
        />
      </div>
      <div>
        Boost Text:
        <div>
          <textarea
            className="bg-gray-100 m-1 h-30 w-100 resize-none"
            value={props.card.boostText}
            onChange={(e) =>
              props.onChange({ ...props.card, boostText: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        {/* 550x500 is the image window size */}
        Card Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleCardImageUpload}
          className="block text-sm text-gray-600 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gray-200 file:text-black"
        />
      </div>
      <div>
        Card Icon:
        <input
          type="file"
          accept="image/*"
          onChange={handleIconImageUpload}
          className="block text-sm text-gray-600 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gray-200 file:text-black"
        />
      </div>
    </div>
  );
}
