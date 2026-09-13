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
      <div className="flex justify-center items-center mt-6">
        Range:
        <input
          className="text-black bg-[#E9E9E5] w-12 mx-1 px-1 rounded-xs"
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
          className="text-black bg-[#E9E9E5] w-12 mx-1 px-1 rounded-xs"
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
          <div className="flex justify-end items-center mx-1 mt-6">
            Power:
            <input
              className="text-black bg-[#E9E9E5] w-12 px-1 mx-1 rounded-xs"
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
          <div className="flex justify-end items-center mx-1 mt-6">
            Speed:
            <input
              className="text-black bg-[#E9E9E5] w-12 px-1 mx-1 rounded-xs"
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
          <div className="flex justify-end items-center mx-1 mt-6">
            Armor:
            <input
              className="text-black bg-[#E9E9E5] w-12 px-1 mx-1 rounded-xs"
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
          <div className="flex justify-end items-center mx-1 mt-6">
            Guard:
            <input
              className="text-black bg-[#E9E9E5] w-12 px-1 mx-1 rounded-xs"
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
          <CardNameArea
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e })}
          />
          <div className="flex items-center justify-center mt-6">
            <div className="flex justify-center">
              <CardTypeInput card={card} onChange={(card) => onChange(card)} />
            </div>
            {/* Only for specials */}
            Force Cost:
            <input
              type="number"
              className="text-black bg-[#E9E9E5] w-10 mx-1 px-1 rounded-xs"
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
        <div className="flex justify-center mt-4">Strike Text:</div>
        <div>
          <div>
            <CardTextArea
              value={card.cardText}
              isAbility
              onChange={(e) => onChange({ ...card, cardText: e })}
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-7">
          Boost Name:
          <input
            className="text-black px-1 bg-[#E9E9E5] w-60 rounded-xs mx-1"
            value={card.boostName}
            onChange={(e) => onChange({ ...card, boostName: e.target.value })}
          />
        </div>
        <div className="flex justify-center items-center mt-6">
          Continuous Boost:
          <input
            type="checkbox"
            className="bg-[#E9E9E5] mx-1 mr-4"
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
            className="text-black bg-[#E9E9E5] w-12 mx-1 px-1 rounded-xs"
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

        <div className="flex justify-center items-center mt-5">Boost Text:</div>
        <div>
          <div>
            <CardTextArea
              value={card.boostText}
              isBoost
              onChange={(e) => onChange({ ...card, boostText: e })}
            />
          </div>
        </div>

        <div className="flex justify-center items-center mt-4">
          {/* 550x500 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
            onCancel={() => onChange({ ...card, cardImage: undefined })}
          />
        </div>
        <div className="flex justify-center items-center">
          Card Icon:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardIcon: image })}
            onCancel={() => onChange({ ...card, cardIcon: undefined })}
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
        <CardNameArea
          value={card.name}
          onChange={(e) => onChange({ ...card, name: e })}
        />
        <div className="flex items-center justify-center mt-6">
          <div className="flex justify-center">
            <CardTypeInput card={card} onChange={(card) => onChange(card)} />
          </div>
          Gauge Cost:
          <input
            type="number"
            className="text-black bg-[#E9E9E5] w-10 mx-1 px-1"
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
        <div className="flex justify-center mt-4">Strike Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(e) => onChange({ ...card, cardText: e })}
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-7">
        Boost Name:
        <input
          className="text-black bg-[#E9E9E5] px-1 w-60 rounded-xs mx-1"
          value={card.boostName}
          onChange={(e) => onChange({ ...card, boostName: e.target.value })}
        />
      </div>
      <div className="flex justify-center items-center mt-6">
        Continuous Boost:
        <input
          type="checkbox"
          className="bg-[#E9E9E5] mx-1 mr-4"
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
          className="text-black bg-[#E9E9E5] w-12 mx-1 px-1 rounded-xs"
          value={card.boostForceCost}
          onChange={(e) =>
            onChange({
              ...card,
              boostForceCost: Math.max(0, Math.min(9, e.target.valueAsNumber)),
            })
          }
        />
      </div>

      <div className="flex justify-center items-center mt-5">Boost Text:</div>
      <div>
        <div>
          <CardTextArea
            value={card.boostText}
            isBoost
            onChange={(e) => onChange({ ...card, boostText: e })}
          />
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        {/* 550x500 is the image window size */}
        Card Image:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardImage: image })}
          onCancel={() => onChange({ ...card, cardImage: undefined })}
        />
      </div>
      <div className="flex justify-center items-center">
        Card Icon:
        <ImageUpload
          onUpload={(image) => onChange({ ...card, cardIcon: image })}
          onCancel={() => onChange({ ...card, cardIcon: undefined })}
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
        <CardNameArea
          value={card.name}
          onChange={(e) => onChange({ ...card, name: e })}
        />

        <div className="flex items-center justify-center mt-6">
          <div className="flex justify-center">
            <CardTypeInput card={card} onChange={(card) => onChange(card)} />
          </div>
          {!card.isExceedSide && (
            <>
              Exceed Cost:
              <input
                type="number"
                className="text-black bg-[#E9E9E5] w-12 mx-1 px-1 rounded-xs"
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
        <div className="flex justify-center mt-6">Ability Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(e) => onChange({ ...card, cardText: e })}
          />
        </div>
        <div className="flex justify-center items-center mt-5">
          Exceed Frame:
          <input
            type="checkbox"
            className="bg-[#E9E9E5] mx-1"
            checked={card.isExceedSide}
            onChange={(e) =>
              onChange({
                ...card,
                isExceedSide: e.target.checked,
              })
            }
          ></input>
        </div>
        <div className="flex justify-center items-center mt-4">
          {/* 620x620 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
            onCancel={() => onChange({ ...card, cardImage: undefined })}
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
        <CardNameArea
          value={card.name}
          onChange={(str) => onChange({ ...card, name: str })}
        />
        <div className="flex justify-center mt-6 items-center">
          <CardTypeInput card={card} onChange={(card) => onChange(card)} />
        </div>
      </div>
      <>
        <div>
          <CardFlavorTextEditor
            onChange={(str) => onChange({ ...card, flavorText: str })}
            value={card.flavorText}
          />
        </div>
        <div className="flex justify-center mt-6">Ability Text:</div>
        <div>
          <CardTextArea
            value={card.cardText}
            isAbility
            onChange={(str) => onChange({ ...card, cardText: str })}
          />
        </div>
        <div className="flex justify-center items-center mt-5">
          Exceed Frame:
          <input
            type="checkbox"
            className="bg-[#E9E9E5] mx-1"
            checked={card.isExceedSide}
            onChange={(e) =>
              onChange({
                ...card,
                isExceedSide: e.target.checked,
              })
            }
          ></input>
        </div>
        <div className="flex justify-center items-center mt-4">
          {/* 620x620 is the image window size */}
          Card Image:
          <ImageUpload
            onUpload={(image) => onChange({ ...card, cardImage: image })}
            onCancel={() => onChange({ ...card, cardImage: undefined })}
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
  //const styles = `text-black px-1 rounded-sm w-100 resize-none bg-[#E9E9E5] ${props.isAbility ? "h-32" : ""}`;

  const styles = clsx(
    `flex px-1 rounded-sm w-100 mt-1 resize-none`,
    "text-black bg-[#E9E9E5]",
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
  onCancel: () => void;
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
    <div className="flex justify-center items-center">
      {" "}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="flex text-sm cursor-pointer bg-[#E9E9E5] rounded-xs mx-1 mt-1 w-50 text-gray-600 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-200 file:text-black"
      />
      <button
        onClick={props.onCancel}
        className="flex bg-[#FFE9E5] text-black font-bold px-2 py-[2px] mt-1 mx-2 rounded-xs"
      >
        X
      </button>
    </div>
  );
}

interface CardFlavorTextEditorProps {
  value: string | undefined;
  onChange: (flavorText: string | undefined) => void;
}

function CardFlavorTextEditor(props: CardFlavorTextEditorProps) {
  return (
    <>
      <div className="flex justify-center mt-6">
        Flavor Text:
        <input
          type="checkbox"
          className="mx-1"
          checked={props.value !== undefined}
          onChange={(e) => props.onChange(e.target.checked ? "" : undefined)}
        />
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

interface CardNameAreaProps {
  value: string;
  onChange: (str: string) => void;
}

function CardNameArea(props: CardNameAreaProps) {
  return (
    <div className="flex items-center justify-center mt-3">
      Name:
      <input
        className="text-black px-1 w-70 mx-1 rounded-xs bg-[#E9E9E5]"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}

interface CardTypeInputProps {
  card: Card;
  onChange: (newCard: Card) => void;
}

function CardTypeInput(props: CardTypeInputProps) {
  return (
    <label>
      Type:
      <select
        className="bg-[#E9E9E5] mx-1 mr-4 px-1 rounded-xs py-[2px]"
        value={props.card.cardType}
        onChange={(e) => {
          if (e.target.value == "character") {
            props.onChange({ ...defaultCharacterCard, id: props.card.id });
          }
          if (e.target.value == "special") {
            props.onChange({ ...defaultCard, id: props.card.id });
          }
          if (e.target.value == "ultra") {
            props.onChange({ ...defaultUltraCard, id: props.card.id });
          }
          if (e.target.value == "extra") {
            props.onChange({ ...defaultExtraCard, id: props.card.id });
          }
        }}
      >
        <option value="character">Character</option>
        <option value="special">Special</option>
        <option value="ultra">Ultra</option>
        <option value="extra">Extra</option>
      </select>
    </label>
  );
}
