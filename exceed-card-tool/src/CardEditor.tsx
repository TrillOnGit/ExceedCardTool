import clsx from "clsx";

export type Card = Special | Character | Ultra | Extra;

export interface Special {
  cardType: "special";
  id: string;
  name: string;
  resourceCost: number;
  range: [number | undefined, number | undefined];
  power?: number;
  speed: number;
  armor: number;
  guard: number;
  cardText: string;
  flavorText?: string;
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
  armor: number;
  guard: number;
  cardText: string;
  flavorText?: string;
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
  flavorText?: string;
  cardImage?: string;
  isExceedSide: boolean;
}

export interface Extra {
  cardType: "extra";
  id: string;
  name: string;
  cardText: string;
  flavorText?: string;
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
  flavorText: undefined,
  isContinuousBoost: false,
  boostName: "",
  boostText: "",
  boostForceCost: 0,
  cardImage: undefined,
  cardIcon: undefined,
};

export const defaultCharacterCard: Card = {
  cardType: "character",
  id: crypto.randomUUID(),
  name: "Unnamed Character",
  resourceCost: 3,
  cardText: "",
  flavorText: undefined,
  cardImage: undefined,
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
  flavorText: undefined,
  isContinuousBoost: false,
  boostName: "",
  boostText: "",
  boostForceCost: 0,
  cardImage: undefined,
  cardIcon: undefined,
};

export const defaultExtraCard: Card = {
  cardType: "extra",
  id: crypto.randomUUID(),
  name: "Unnamed Extra",
  cardText: "",
  flavorText: undefined,
  cardImage: undefined,
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
    <div className="p-2">
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
      <div className="flex justify-center items-center p-2">
        Range:
        <input
          className="bg-gray-100 w-10 p-1"
          type="number"
          value={card.range[0]}
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
          value={card.range[1]}
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
      <div className="flex justify-center">
        <div>
          <div className="flex justify-end items-center  p-2">
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
          <div className="flex justify-end items-center  p-2">
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
        </div>{" "}
        <div>
          <div className="flex justify-end items-center p-2">
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
          <div className="flex justify-end items-center p-2">
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
        </div>
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
          <div className="flex items-center justify-center">
            Name:
            <input
              className="bg-gray-100 p-10 w-70"
              value={card.name}
              onChange={(e) => onChange({ ...card, name: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-center p-2">
            <label>
              Type:
              <select
                className="bg-gray-100 m-2 px-1 rounded-xs h-7"
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
              className="bg-gray-100 w-10 m-2"
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
          </div>
        </div>

        {(card.cardType == "special" || card.cardType == "ultra") && (
          <CardStatsEditor card={card} onChange={onChange} />
        )}

        <div>
          <CardFlavorTextEditor
            onChange={(e) => onChange({ ...card, flavorText: e })}
            value={card.flavorText}
          />
        </div>
        <div className="flex justify-center">Strike Text:</div>
        <div>
          <div>
            <CardTextArea
              value={card.cardText}
              isAbility
              onChange={(e) => onChange({ ...card, cardText: e })}
            />
          </div>
        </div>

        <div className="flex justify-center items-center mt-2">
          Continuous Boost:
          <input
            type="checkbox"
            className="bg-gray-100"
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
        <div className="flex justify-center items-center mt-1">
          Boost Name:
          <input
            className="bg-gray-100 m-1 w-60"
            value={card.boostName}
            onChange={(e) => onChange({ ...card, boostName: e.target.value })}
          />
        </div>
        <div className="flex justify-center items-center mt-2">Boost Text:</div>
        <div>
          <div>
            <CardTextArea
              value={card.boostText}
              isBoost
              onChange={(e) => onChange({ ...card, boostText: e })}
            />
          </div>
        </div>

        <div className="flex justify-center items-center mt-2">
          {/* 550x500 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
          />
        </div>
        <div className="flex justify-center items-center">
          Card Icon:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardIcon: image })}
          />
        </div>
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
    <div>
      <div>
        <div className="flex items-center justify-center">
          Name:
          <input
            className="bg-gray-100 p-10 w-70"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-center p-2">
          <label>
            Type:
            <select
              className="bg-gray-100 m-2 px-1 rounded-xs h-7"
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
            className="bg-gray-100 w-10 m-2"
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
      <div>
        <CardFlavorTextEditor
          onChange={(e) => onChange({ ...card, flavorText: e })}
          value={card.flavorText}
        />
      </div>

      <div>
        <div className="flex justify-center">Strike Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(e) => onChange({ ...card, cardText: e })}
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-2">
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
              boostForceCost: Math.max(0, Math.min(9, e.target.valueAsNumber)),
            })
          }
        />
      </div>
      <div className="flex justify-center items-center mt-1">
        Boost Name:
        <input
          className="bg-gray-100 m-1 w-60"
          value={card.boostName}
          onChange={(e) => onChange({ ...card, boostName: e.target.value })}
        />
      </div>
      <div>
        <div className="flex justify-center items-center mt-2">Boost Text:</div>
        <div>
          <CardTextArea
            value={card.boostText}
            isBoost
            onChange={(e) => onChange({ ...card, boostText: e })}
          />
        </div>
      </div>

      <div className="flex justify-center items-center mt-2">
        {/* 550x500 is the image window size */}
        Card Image:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardImage: image })}
        />
      </div>
      <div className="flex justify-center items-center">
        Card Icon:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardIcon: image })}
        />
      </div>
    </div>
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
        <div className="flex items-center justify-center">
          Name:
          <input
            className="bg-gray-100 p-10 w-70"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-center p-2">
          <label>
            Type:
            <select
              className="bg-gray-100 m-2 px-1 rounded-xs h-7"
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
                className="bg-gray-100 w-10 m-2"
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
          <CardFlavorTextEditor
            onChange={(e) => onChange({ ...card, flavorText: e })}
            value={card.flavorText}
          />
        </div>
        <div className="flex justify-center">Ability Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(e) => onChange({ ...card, cardText: e })}
          />
        </div>
        <div className="flex justify-center items-center">
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
        <div className="flex justify-center items-center">
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
        <div className="flex items-center justify-center">
          Name:
          <input
            className="bg-gray-100 p-10 w-70"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-center p-2">
          <label>
            Type:
            <select
              className="bg-gray-100 m-2 px-1 rounded-xs h-7"
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
          <CardFlavorTextEditor
            onChange={(e) => onChange({ ...card, flavorText: e })}
            value={card.flavorText}
          />
        </div>
        <div className="flex justify-center">Ability Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(e) => onChange({ ...card, cardText: e })}
          />
        </div>
        <div className="flex justify-center items-center">
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
        <div className="flex justify-center items-center">
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

interface CardTextAreaProps {
  value: string;
  onChange: (str: string) => void;
  isAbility?: boolean;
  isBoost?: boolean;
  className?: string;
}

function CardTextArea(props: CardTextAreaProps) {
  //const styles = `text-black px-1 rounded-sm w-100 resize-none bg-gray-100 ${props.isAbility ? "h-32" : ""}`;

  const styles = clsx(
    `flex px-1 rounded-sm w-100 resize-none`,
    "text-black bg-gray-100",
    { "h-32": props.isAbility },
    { "h-19": props.isBoost },
    props.className,
  );

  return (
    <textarea
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      className={styles}
    />
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
      className="text-sm cursor-pointer text-gray-600 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-200 file:text-black"
    />
  );
}

interface CardFlavorTextEditorProps {
  value: string | undefined;
  onChange: (flavorText: string | undefined) => void;
}

function CardFlavorTextEditor(props: CardFlavorTextEditorProps) {
  return (
    <>
      <div className="flex justify-center">
        Flavor Text:
        <input
          type="checkbox"
          className=""
          checked={props.value !== undefined}
          onChange={(e) => props.onChange(e.target.checked ? "" : undefined)}
        ></input>
      </div>
      {props.value !== undefined && (
        <div>
          <CardTextArea
            value={props.value}
            onChange={(e) => props.onChange(e)}
          />
        </div>
      )}
    </>
  );
}
