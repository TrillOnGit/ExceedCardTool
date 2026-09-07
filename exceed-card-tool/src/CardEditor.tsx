import blankIcon from "./assets/blankicon.png";

export type Card = Special | Character | Ultra | Extra;

export interface Special {
  cardType: "special";
  id: string;
  name: string;
  resourceCost: number;
  range: [number | undefined, number | undefined];
  power?: number;
  speed: number;
  armor?: number;
  guard?: number;
  cardText: string;
  flavorText: string;
  isContinuousBoost: boolean;
  boostName: string;
  boostText: string;
  boostForceCost: number;
  cardImage?: string;
  cardIcon?: string;
}

export interface Ultra {
  cardType: "ultra";
  id: string;
  name: string;
  resourceCost: number;
  range: [number | undefined, number | undefined];
  power?: number;
  speed: number;
  armor?: number;
  guard?: number;
  cardText: string;
  flavorText: string;
  isContinuousBoost: boolean;
  boostName: string;
  boostText: string;
  boostForceCost: number;
  cardImage?: string;
  cardIcon?: string;
}

export interface Character {
  cardType: "character";
  id: string;
  name: string;
  resourceCost: number;
  cardText: string;
  flavorText: string;
  cardImage?: string;
  isExceedSide: boolean;
}

export interface Extra {
  cardType: "extra";
  id: string;
  name: string;
  cardText: string;
  flavorText: string;
  cardImage?: string;
  isExceedSide: boolean;
}

export const defaultCard: Card = {
  cardType: "special",
  id: crypto.randomUUID(),
  name: "Unnamed Special",
  resourceCost: 0,
  range: [undefined, undefined],
  power: undefined,
  speed: 0,
  armor: 0,
  guard: 0,
  cardText: "",
  flavorText: "",
  isContinuousBoost: false,
  boostName: "",
  boostText: "",
  boostForceCost: 0,
  cardImage: "./src/assets/redbackground.png",
  cardIcon: blankIcon,
};

export const defaultCharacterCard: Card = {
  cardType: "character",
  id: crypto.randomUUID(),
  name: "Character",
  resourceCost: 3,
  cardText: "",
  flavorText: "",
  cardImage: "./src/assets/redbackground.png",
  isExceedSide: false,
};

export const defaultUltraCard: Card = {
  cardType: "ultra",
  id: crypto.randomUUID(),
  name: "Unnamed Ultra",
  resourceCost: 0,
  range: [undefined, undefined],
  power: undefined,
  speed: 0,
  armor: 0,
  guard: 0,
  cardText: "",
  flavorText: "",
  isContinuousBoost: false,
  boostName: "",
  boostText: "",
  boostForceCost: 0,
  cardImage: "./src/assets/redbackground.png",
  cardIcon: blankIcon,
};

export const defaultExtraCard: Card = {
  cardType: "extra",
  id: crypto.randomUUID(),
  name: "Extra",
  cardText: "",
  flavorText: "",
  cardImage: "./src/assets/redbackground.png",
  isExceedSide: false,
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

export function CardEditor({ card, onChange }: CardEditorProps) {
  return (
    <div>
      {card.cardType == "special" && (
        <SpecialCardEditor card={card} onChange={onChange} />
      )}

      {card.cardType == "ultra" && (
        <UltraCardEditor card={card} onChange={onChange} />
      )}

      {card.cardType == "character" && (
        <CharacterCardEditor card={card} onChange={onChange} />
      )}

      {card.cardType == "extra" && (
        <ExtraCardEditor card={card} onChange={onChange} />
      )}
    </div>
  );
}

interface CardStatsEditorProps {
  card: Special | Ultra;
  onChange: (newCard: Card) => void;
}

function CardStatsEditor(props: CardStatsEditorProps) {
  const card = props.card;
  const onChange = props.onChange;

  return (
    <>
      <div>
        Range:
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={card.range[0] ?? ""}
          onChange={(e) =>
            onChange({
              ...card,
              range: [
                Math.max(0, Math.min(9, e.target.valueAsNumber)),
                card.range[1],
              ],
            })
          }
        />
        ~
        <input
          className="bg-gray-100 w-10 m-1"
          type="number"
          value={card.range[1] ?? ""}
          onChange={(e) =>
            onChange({
              ...card,
              range: [
                card.range[0],
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
          value={card.power ?? ""}
          onChange={(e) =>
            onChange({
              ...card,
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
          value={card.speed}
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              onChange({
                ...card,
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
          value={card.armor}
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              onChange({
                ...card,
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
          value={card.guard}
          onChange={(e) => {
            if (Number.isInteger(e.target.valueAsNumber)) {
              onChange({
                ...card,
                guard: Math.max(0, Math.min(99, e.target.valueAsNumber)),
              });
            }
          }}
        />
      </div>
    </>
  );
}

interface SpecialCardEditorProps {
  card: Special;
  onChange: (newCard: Card) => void;
}

function SpecialCardEditor(props: SpecialCardEditorProps) {
  const card = props.card;
  const onChange = props.onChange;

  return (
    <>
      <div>
        <div>
          Name:
          <input
            className="bg-gray-100 m-1"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>
        <label>
          Type:
          <select
            className="bg-gray-100 m-1"
            value={card.cardType}
            onChange={(e) => {
              if (e.target.value == "character") {
                onChange({ ...defaultCharacterCard, id: props.card.id });
              }
              if (e.target.value == "special") {
                onChange({ ...defaultCard, id: props.card.id });
              }
              if (e.target.value == "ultra") {
                onChange({ ...defaultUltraCard, id: props.card.id });
              }
              if (e.target.value == "extra") {
                onChange({ ...defaultExtraCard, id: props.card.id });
              }
            }}
          >
            <option value="character">Character</option>
            <option value="special">Special</option>
            <option value="ultra">Ultra</option>
            <option value="extra">Extra</option>
          </select>
        </label>
        {/* Only for specials */}
        Force Cost:
        <input
          type="number"
          className="bg-gray-100 w-10 m-1"
          value={card.resourceCost ?? ""}
          onChange={(e) =>
            onChange({
              ...card,
              resourceCost: Math.max(0, Math.min(9, e.target.valueAsNumber)),
            })
          }
        />
      </div>

      {(card.cardType == "special" || card.cardType == "ultra") && (
        <CardStatsEditor card={card} onChange={onChange} />
      )}

      {card.cardType == "special" && (
        <>
          <div>
            Strike Text:
            <div>
              <textarea
                className="bg-gray-100 m-1 h-30 w-100 resize-none"
                value={card.cardText}
                onChange={(e) =>
                  onChange({ ...card, cardText: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            Flavor Text:
            <div>
              <textarea
                className="bg-gray-100 h-12 w-100 resize-none"
                value={card.flavorText}
                onChange={(e) =>
                  onChange({ ...card, flavorText: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            Continuous Boost:
            <input
              type="checkbox"
              className="bg-gray-100 m-1"
              checked={card.isContinuousBoost}
              onChange={(e) =>
                onChange({
                  ...card,
                  isContinuousBoost: e.target.checked,
                })
              }
            ></input>
            Boost Force Cost:
            <input
              type="number"
              className="bg-gray-100 w-10 m-1"
              value={card.boostForceCost}
              onChange={(e) =>
                onChange({
                  ...card,
                  boostForceCost: Math.max(
                    0,
                    Math.min(9, e.target.valueAsNumber),
                  ),
                })
              }
            />
          </div>
          <div>
            Boost Name:
            <input
              className="bg-gray-100 m-1"
              value={card.boostName}
              onChange={(e) => onChange({ ...card, boostName: e.target.value })}
            />
          </div>
          <div>
            Boost Text:
            <div>
              <textarea
                className="bg-gray-100 m-1 h-30 w-100 resize-none"
                value={card.boostText}
                onChange={(e) =>
                  onChange({ ...card, boostText: e.target.value })
                }
              />
            </div>
          </div>
        </>
      )}
      <div>
        {/* 550x500 is the image window size */}
        Card Image:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardImage: image })}
        />
      </div>
      <div>
        Card Icon:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardIcon: image })}
        />
      </div>
    </>
  );
}

interface UltraCardEditorProps {
  card: Ultra;
  onChange: (newCard: Card) => void;
}

function UltraCardEditor(props: UltraCardEditorProps) {
  const card = props.card;
  const onChange = props.onChange;

  return (
    <>
      <div>
        <div>
          Name:
          <input
            className="bg-gray-100 m-1"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>

        <div>
          <label>
            Type:
            <select
              className="bg-gray-100 m-1"
              value={card.cardType}
              onChange={(e) => {
                if (e.target.value == "character") {
                  onChange({ ...defaultCharacterCard, id: props.card.id });
                }
                if (e.target.value == "special") {
                  onChange({ ...defaultCard, id: props.card.id });
                }
                if (e.target.value == "ultra") {
                  onChange({ ...defaultUltraCard, id: props.card.id });
                }
                if (e.target.value == "extra") {
                  onChange({ ...defaultExtraCard, id: props.card.id });
                }
              }}
            >
              <option value="character">Character</option>
              <option value="special">Special</option>
              <option value="ultra">Ultra</option>
              <option value="extra">Extra</option>
            </select>
          </label>
          Gauge Cost:
          <input
            type="number"
            className="bg-gray-100 w-10 m-1"
            value={card.resourceCost ?? ""}
            onChange={(e) =>
              onChange({
                ...card,
                resourceCost: Math.max(0, Math.min(9, e.target.valueAsNumber)),
              })
            }
          />
        </div>
      </div>

      {<CardStatsEditor card={card} onChange={onChange} />}

      <>
        <div>
          Strike Text:
          <div>
            <textarea
              className="bg-gray-100 m-1 h-30 w-100 resize-none"
              value={card.cardText}
              onChange={(e) => onChange({ ...card, cardText: e.target.value })}
            />
          </div>
        </div>
        <div>
          Flavor Text:
          <div>
            <textarea
              className="bg-gray-100 h-12 w-100 resize-none"
              value={card.flavorText}
              onChange={(e) =>
                onChange({ ...card, flavorText: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          Continuous Boost:
          <input
            type="checkbox"
            className="bg-gray-100 m-1"
            checked={card.isContinuousBoost}
            onChange={(e) =>
              onChange({
                ...card,
                isContinuousBoost: e.target.checked,
              })
            }
          ></input>
          Boost Force Cost:
          <input
            type="number"
            className="bg-gray-100 w-10 m-1"
            value={card.boostForceCost}
            onChange={(e) =>
              onChange({
                ...card,
                boostForceCost: Math.max(
                  0,
                  Math.min(9, e.target.valueAsNumber),
                ),
              })
            }
          />
        </div>
        <div>
          Boost Name:
          <input
            className="bg-gray-100 m-1"
            value={card.boostName}
            onChange={(e) => onChange({ ...card, boostName: e.target.value })}
          />
        </div>
        <div>
          Boost Text:
          <div>
            <textarea
              className="bg-gray-100 m-1 h-30 w-100 resize-none"
              value={card.boostText}
              onChange={(e) => onChange({ ...card, boostText: e.target.value })}
            />
          </div>
        </div>
      </>

      <div>
        {/* 550x500 is the image window size */}
        Card Image:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardImage: image })}
        />
      </div>
      <div>
        Card Icon:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardIcon: image })}
        />
      </div>
    </>
  );
}

interface CharacterCardEditorProps {
  card: Character;
  onChange: (newCard: Card) => void;
}

function CharacterCardEditor(props: CharacterCardEditorProps) {
  const card = props.card;
  const onChange = props.onChange;

  return (
    <>
      <div>
        <div>
          Name:
          <input
            className="bg-gray-100 m-1"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>

        <div>
          <label>
            Type:
            <select
              className="bg-gray-100 m-1"
              value={card.cardType}
              onChange={(e) => {
                if (e.target.value == "character") {
                  onChange({ ...defaultCharacterCard, id: props.card.id });
                }
                if (e.target.value == "special") {
                  onChange({ ...defaultCard, id: props.card.id });
                }
                if (e.target.value == "ultra") {
                  onChange({ ...defaultUltraCard, id: props.card.id });
                }
                if (e.target.value == "extra") {
                  onChange({ ...defaultExtraCard, id: props.card.id });
                }
              }}
            >
              <option value="character">Character</option>
              <option value="special">Special</option>
              <option value="ultra">Ultra</option>
              <option value="extra">Extra</option>
            </select>
          </label>
          {!card.isExceedSide && (
            <>
              Exceed Cost:
              <input
                type="number"
                className="bg-gray-100 w-10 m-1"
                value={card.resourceCost ?? ""}
                onChange={(e) =>
                  onChange({
                    ...card,
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
      </div>
      <>
        <div>
          Ability Text:
          <div>
            <textarea
              className="bg-gray-100 m-1 h-30 w-100 resize-none"
              value={card.cardText}
              onChange={(e) => onChange({ ...card, cardText: e.target.value })}
            />
          </div>
        </div>
        <div>
          Flavor Text:
          <div>
            <textarea
              className="bg-gray-100 h-12 w-100 resize-none"
              value={card.flavorText}
              onChange={(e) =>
                onChange({ ...card, flavorText: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          Exceed Frame:
          <input
            type="checkbox"
            className="bg-gray-100 m-1"
            checked={card.isExceedSide}
            onChange={(e) =>
              onChange({
                ...card,
                isExceedSide: e.target.checked,
              })
            }
          ></input>
        </div>
        <div>
          {/* 620x620 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
          />
        </div>
      </>
    </>
  );
}

interface ExtraCardEditorProps {
  card: Extra;
  onChange: (newCard: Card) => void;
}

function ExtraCardEditor(props: ExtraCardEditorProps) {
  const card = props.card;
  const onChange = props.onChange;

  return (
    <>
      <div>
        <div>
          Name:
          <input
            className="bg-gray-100 m-1"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>

        <div>
          <label>
            Type:
            <select
              className="bg-gray-100 m-1"
              value={card.cardType}
              onChange={(e) => {
                if (e.target.value == "character") {
                  onChange({
                    ...defaultCharacterCard,
                    name: props.card.name,
                    id: props.card.id,
                  });
                }
                if (e.target.value == "special") {
                  onChange({ ...defaultCard, id: props.card.id });
                }
                if (e.target.value == "ultra") {
                  onChange({ ...defaultUltraCard, id: props.card.id });
                }
                if (e.target.value == "extra") {
                  onChange({ ...defaultExtraCard, id: props.card.id });
                }
              }}
            >
              <option value="character">Character</option>
              <option value="special">Special</option>
              <option value="ultra">Ultra</option>
              <option value="extra">Extra</option>
            </select>
          </label>
        </div>
      </div>
      <>
        <div>
          Ability Text:
          <div>
            <textarea
              className="bg-gray-100 m-1 h-30 w-100 resize-none"
              value={card.cardText}
              onChange={(e) => onChange({ ...card, cardText: e.target.value })}
            />
          </div>
        </div>
        <div>
          Flavor Text:
          <div>
            <textarea
              className="bg-gray-100 h-12 w-100 resize-none"
              value={card.flavorText}
              onChange={(e) =>
                onChange({ ...card, flavorText: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          Exceed Frame:
          <input
            type="checkbox"
            className="bg-gray-100 m-1"
            checked={card.isExceedSide}
            onChange={(e) =>
              onChange({
                ...card,
                isExceedSide: e.target.checked,
              })
            }
          ></input>
        </div>
        <div>
          {/* 620x620 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
          />
        </div>
      </>
    </>
  );
}

interface ImageUploadProps {
  onUpload: (imageData: string) => void;
}

function ImageUpload(props: ImageUploadProps) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        props.onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="block text-sm text-gray-600 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gray-200 file:text-black"
    />
  );
}
