import { useEffect, useMemo, useState } from "react";
import type { Card, Character, Special, Ultra } from "./CardEditor";
//Frames
// import specialFrameSrc from "./assets/trueemptycard.png";
// import ultraFrameSrc from "./assets/ultraemptycard.png";
// import charaFrameSrc from "./assets/characteremptycard.png";
// import exceedFrameSrc from "./assets/exceedcharaemptycard.png";
// import extraFrameSrc from "./assets/extraemptycard.png";
// import tfSpecialFrameSrc from "./assets/tfspecialframe.png";
// import tfUltraFrameSrc from "./assets/tfultraframe.png";
// import tfCharaFrameSrc from "./assets/tfcharacterframe.png";
//BG
import redBackground from "./assets/redbackground.png";
//Small Images
// import blankIcon from "./assets/blankicon.png";
// import armPatchSrc from "./assets/armorpatch.png";
// import uArmPatchSrc from "./assets/uarmorpatch.png";
// import grdPatchSrc from "./assets/guardpatch.png";
// import uGrdPatchSrc from "./assets/uguardpatch.png";
// import contBoostIconSrc from "./assets/contboosticon.png";
// import uContBoostIconSrc from "./assets/ucontboosticon.png";
// import forceIconSrc from "./assets/forceicon.png";
// import canCritIconSrc from "./assets/cancriticon.png";
// import cancelIconSrc from "./assets/cancelicon.png";
// import critIconSrc from "./assets/criticon.png";
import type { CardDrawingContext } from "./types";
import { drawRichText, type TextIcons } from "./richText";

const nameFont = "56px ShaXizor";
const statFont = "72px MKXTitle";
const gaugeFont = "68px MKXTitle";
const exceedCostFont = "66px MKXTitle";
const textFont = "26px AlgrySansMed";
const characterTextFont = "26px AlgrySansMed";
const boldTextFont = "26px AlgrySansBold";
const italicTextFont = "26px AlgrySansItalic";
const boldItalicTextFont = "26px AlgrySansBoldItalic";
const boostNameFont = "28px ShaXizor";
const creditFont = "17px AlgrySansMed";

const isInteger = (val: number | undefined): val is number =>
  val !== undefined && Number.isInteger(val);

interface CardPreviewProps {
  card: Card;
}

const useTemplateImages = (imageJson: ImageJson[] | null) => {
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    if (!imageJson) return;
    let isCancelled = false;

    const filteredImageJson = imageJson.filter((entry) => {
      if (entry.imagePath === "CARD_IMAGE" || entry.imagePath === "CARD_ICON")
        return false;
      return true;
    });

    console.log("imageJson: ", imageJson);

    Promise.all(
      filteredImageJson.map((entry) =>
        loadImage(entry.imagePath).then(
          (img) => [entry.imagePath, img] as const,
        ),
      ),
    ).then((loaded) => {
      if (isCancelled) return;
      console.log("Promise Finished");
      const entries = loaded.filter(
        (e): e is [string, HTMLImageElement] =>
          e[0] !== undefined && e[1] !== null,
      );
      setImages(Object.fromEntries(entries));
    });

    return () => {
      isCancelled = true;
    };
  }, [imageJson]);

  return images;
};

export function CardPreview({ card }: CardPreviewProps) {
  const cardImage = useImage(card.cardImage);
  const cardIcon = useImage(
    card.cardType == "special" || card.cardType == "ultra"
      ? card.cardIcon
      : undefined,
  );
  const jsonData = useJsonData("/templates/SeventhCross/SeventhCross.json");

  const isImageJson = (entry: JsonData): entry is ImageJson =>
    entry.type === "Image";

  const imageJsonArray = useMemo(
    () => jsonData?.filter(isImageJson) ?? null,
    [jsonData],
  );

  const templateImages = useTemplateImages(imageJsonArray);

  const allImages = useMemo(
    () => ({
      ...templateImages,
      ...(cardImage ? { CARD_IMAGE: cardImage } : {}),
      ...(cardIcon ? { CARD_ICON: cardIcon } : {}),
    }),
    [templateImages, cardImage, cardIcon],
  );

  const areFontsReady = useFontsReady([
    nameFont,
    statFont,
    gaugeFont,
    textFont,
    boldTextFont,
    italicTextFont,
    boldItalicTextFont,
    boostNameFont,
  ]);

  const handleExport = () => {
    const canvas = document.getElementById("card-preview") as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement("a");
    const filename =
      card.name.trim().replace(/\s+/g, "_").toLowerCase() || "card";

    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const cardCanvas = document.getElementById(
      "card-preview",
    ) as HTMLCanvasElement;
    const ctx = cardCanvas.getContext("2d");

    if (!ctx) return;
    console.log("card changed!", cardCanvas);

    ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

    // Draw the card

    drawCard(ctx, card, jsonData, allImages, cardImage, cardIcon);
  }, [card, cardImage, cardIcon, areFontsReady, allImages]);

  return (
    <div>
      <canvas
        width={750}
        height={1024}
        id="card-preview"
        className="w-[562px] h-auto self-start"
      ></canvas>
      <button
        onClick={handleExport}
        className="mt-1 bg-gray-200 text-black px-3 py-1"
      >
        Export PNG
      </button>
    </div>
  );
}

const getJsonDataArray = (path: string): JsonData[] | null => {
  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Failed to fetch:", error));
  return null;
};

const rangeToText = (range: [number | undefined, number | undefined]) => {
  const min = range[0];
  const max = range[1];

  // Duplicate undefined values are N/A, otherwise don't include undefined values
  if (!Number.isInteger(min) && !Number.isInteger(max)) {
    return "N/A";
  } else if (Number.isInteger(min) && Number.isInteger(max)) {
    return min != max ? `${min}~${max}` : min;
  } else {
    return !Number.isInteger(min) ? `${max}` : `${min}`;
  }
};

// Helper functions that determine behaviour when a number is undefined
const valToTextWithNA = (val: number | undefined) => {
  return isInteger(val) ? `${val}` : "N/A";
};

const valToTextWithEmpty = (val: number | undefined) => {
  return isInteger(val) && val > 0 ? `${val}` : "";
};

const valToTextMinZero = (val: number | undefined) => {
  return isInteger(val) ? `${val}` : "0";
};

const drawIconClippedToCircle = (
  ctx: CardDrawingContext,
  image: HTMLImageElement,
  x: number,
  y: number,
  tw: number,
  th: number,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 45, y + 49, 35, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, x, y, tw, th);
  ctx.restore();
};

const useImage = (src: string | undefined) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let isCancelled = false;

    setImage(null);
    if (src === undefined) {
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!isCancelled) setImage(img);
    };

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return image;
};

const useJson = <T,>(path: string | undefined) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!path) return;
    setData(null);

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as T;
      })
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Failed to fetch:", error));
  }, [path]);

  return data;
};

type JsonData = ImageJson | TextJson;

interface ImageJson {
  dataSource?: string;
  type: string;
  imagePath?: string;
  position?: [number, number];
  width?: number;
  height?: number;
  conditionals?: string[][];
  // TODO: Add conditional Position Modifiers
}

interface TextJson {
  dataSource?: string;
  type: string;
  fontPath?: string;
  fontSize?: number;
  position?: [number, number];
  alignment?: string;
  maxWidth?: number;
  maxLines?: number;
  color?: string;
  conditionals?: string[][];
}

export const useJsonData = (
  jsonPath: string | undefined,
): JsonData[] | null => {
  if (jsonPath === undefined)
    jsonPath = "/templates/SeventhCross/SeventhCross.json";
  const data = useJson<JsonData[]>(jsonPath);

  return data;
};

export const drawCard = (
  ctx: CardDrawingContext,
  card: Card,
  json: JsonData[] | null,
  images?: Record<string, HTMLImageElement>,
  userImage?: HTMLImageElement | null,
  userIcon?: HTMLImageElement | null,
) => {
  if (!json) return;

  json.forEach((js) => {
    if (js.type === "Image" && images) {
      drawImageFromJson(js, ctx, card, images);
    } else if (js.type === "Text") {
      drawTextFromJson(js, ctx, card, images);
    }
  });
};

const drawImageFromJson = (
  json: ImageJson,
  ctx: CardDrawingContext,
  card: Card,
  images: Record<string, HTMLImageElement>,
) => {
  if (!checkJsonConditions(json.conditionals, card)) return;

  const x = json.position?.[0] ?? 0;
  const y = json.position?.[1] ?? 0;
  const width = json.width ?? 0;
  const height = json.height ?? 0;
  const img = json.imagePath ? images[json.imagePath] : undefined;

  console.log("image: ", images);
  if (img) {
    width > 0 && height > 0
      ? ctx.drawImage(img, x, y, width, height)
      : ctx.drawImage(img, x, y);
  }
};

const drawTextFromJson = (
  json: TextJson,
  ctx: CardDrawingContext,
  card: Card,
  images: Record<string, HTMLImageElement> | undefined,
) => {
  if (!checkJsonConditions(json.conditionals, card)) return;
  const text = getSourceText(card, json.dataSource);
  const fontString = `${json.fontSize ?? "10px"} ${json.fontPath ?? "AlgrySansMed"}`;
  const position = json.position ?? [0, 0];
  const color = json.color ?? "#000000";

  if (json.dataSource === "cardText") {
    const rawText = getSourceText(card, "cardText");
    const flavorText = "flavorText" in card ? card.flavorText : undefined;
    const text = flavorText
      ? `[f]${flavorText}[/f]\n${rawText.trim()}`
      : rawText;
    const icons: TextIcons = {
      critIcon: images ? (images[""] ?? null) : null,
    };

    ctx.letterSpacing = "0px";
    drawRichText(
      ctx,
      icons,
      text,
      position[0],
      position[1],
      json.maxLines ?? 5,
      json.maxWidth ?? 500,
      undefined, // lineHeight — let drawRichText use its own default, matching old calls
      fontString,
      color,
    );
    return;
  }

  // Everything else: plain single-line text, no wrapping/tags
  ctx.font = fontString;
  ctx.textAlign = (json.alignment ?? "left") as CanvasTextAlign;
  ctx.fillStyle = color;
  ctx.fillText(getSourceText(card, json.dataSource), position[0], position[1]);

  //const font = useFont(json.fontPath);
};

const getSourceText = (card: Card, dataSource: string | undefined): string => {
  if (!dataSource) return "";

  switch (card.cardType) {
    case "character":
      switch (dataSource) {
        case "name":
          return card.name;
        case "cardText":
          return card.cardText;
        case "credit":
          return card.credit ?? "";
        case "resourceCost":
          return valToTextMinZero(card.resourceCost);
        default:
          return "";
      }
    case "extra":
      switch (dataSource) {
        case "name":
          return card.name;
        case "cardText":
          return card.cardText;
        case "credit":
          return card.credit ?? "";
        default:
          return "";
      }
    case "special":
      switch (dataSource) {
        case "name":
          return card.name;
        case "range":
          return `${rangeToText(card.range)}`;
        case "power":
          return valToTextWithNA(card.power);
        case "speed":
          return valToTextMinZero(card.speed);
        case "armor":
          return valToTextWithEmpty(card.armor);
        case "guard":
          return valToTextWithEmpty(card.guard);
        case "resourceCost":
          return valToTextWithEmpty(card.resourceCost);
        case "boostForceCost":
          return valToTextMinZero(card.boostForceCost);
        case "boostName":
          return card.boostName.toUpperCase();
        case "boostText":
          return card.boostText;
        case "cardText":
          return card.cardText;
        case "credit":
          return card.credit ?? "";
        default:
          return "";
      }
    case "ultra":
      switch (dataSource) {
        case "name":
          return card.name;
        case "range":
          return `${rangeToText(card.range)}`;
        case "power":
          return valToTextWithNA(card.power);
        case "speed":
          return valToTextMinZero(card.speed);
        case "armor":
          return valToTextWithEmpty(card.armor);
        case "guard":
          return valToTextWithEmpty(card.guard);
        case "resourceCost":
          return valToTextMinZero(card.resourceCost);
        case "boostForceCost":
          return valToTextMinZero(card.boostForceCost);
        case "boostName":
          return card.boostName.toUpperCase();
        case "boostText":
          return card.boostText;
        case "cardText":
          return card.cardText;
        case "credit":
          return card.credit ?? "";
        default:
          return "";
      }
  }
};

const checkJsonConditions = (
  conditionals: string[][] | undefined,
  card: Card,
): boolean => {
  if (!conditionals) return true;
  return conditionals.some((andVals) =>
    andVals.every((c) => checkCondition(c, card)),
  );
};

const checkCondition = (condition: string, card: Card): boolean => {
  switch (condition) {
    // Card Type Conditions
    case "CHARACTER":
      return card.cardType === "character";
    case "ULTRA":
      return card.cardType === "ultra";
    case "SPECIAL":
      return card.cardType === "special";
    case "EXTRA":
      return card.cardType === "extra";

    // Stat presence (Special/Ultra only — guard the narrowing)
    case "ARMOR_DISPLAYED":
      return (
        (card.cardType === "special" || card.cardType === "ultra") &&
        card.armor > 0
      );
    case "GUARD_DISPLAYED":
      return (
        (card.cardType === "special" || card.cardType === "ultra") &&
        card.guard > 0
      );
    case "IS_CONTINUOUS_BOOST":
      return (
        (card.cardType === "special" || card.cardType === "ultra") &&
        card.isContinuousBoost
      );
    case "HAS_FORCE_COST":
      return card.cardType === "special" && card.resourceCost > 0;
    case "HAS_BOOST":
      return card.cardType === "special" || card.cardType === "ultra";
    case "NO_ICON":
      return (
        (card.cardType === "special" || card.cardType === "ultra") &&
        (card.cardIcon === undefined || card.cardIcon === "")
      );
    case "NO_IMAGE":
      return card.cardImage === undefined || card.cardImage === "";

    // Exceed state (Character/Extra only)
    case "EXCEED":
      return (
        (card.cardType === "character" || card.cardType === "extra") &&
        card.isExceedSide
      );
    case "NON_EXCEED":
      return (
        (card.cardType === "character" || card.cardType === "extra") &&
        !card.isExceedSide
      );

    // Mechanic
    case "MECHANIC_TRANSFORM":
      return card.mechanic === "transform";
    case "NON_TRANSFORM":
      return card.mechanic !== "transform";
    case "MECHANIC_CANCEL":
      return card.mechanic === "cancel";
    case "MECHANIC_CRITICAL":
      return card.mechanic === "critical";

    default:
      console.warn(`Unknown condition flag: "${condition}"`);
      return true;
  }
};

// To be used for rendering cardImage and cardIcon
export const loadImage = async (src: string | undefined) =>
  src == undefined
    ? null
    : await new Promise<HTMLImageElement>((fulfill, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => fulfill(img);
        img.onerror = () => reject(img);
      });

const useFontsReady = (fonts: string[]) => {
  const [areFontsReady, setAreFontsReady] = useState(false);

  // disabling this for the moment while debugging
  // uncomment and remove the `return true` when things seem less broken
  useEffect(() => {
    const doTheThing = async () => {
      setAreFontsReady(false);
      await Promise.all(fonts.map((font) => document.fonts.load(font)));
      setAreFontsReady(true);
    };
    doTheThing();
  }, fonts);
  // return true;

  return areFontsReady;
};

// // Helper functions to draw on the canvas:
// const drawStats = (
//   ctx: CardDrawingContext,
//   card: Ultra | Special,
//   cardImages: CardImageData,
// ) => {
//   if (cardImages.armPatch && card.armor > 0) {
//     const patch =
//       card.cardType === "ultra" ? cardImages.uArmPatch : cardImages.armPatch;
//     if (patch) ctx.drawImage(patch, 22, 430);
//   }
//   if (cardImages.grdPatch && card.guard > 0) {
//     const patch =
//       card.cardType === "ultra" ? cardImages.uGrdPatch : cardImages.grdPatch;
//     if (patch) ctx.drawImage(patch, 22, 532);
//   }
//   if (cardImages.contBoostIcon && card.isContinuousBoost) {
//     const boostIcon =
//       card.cardType === "ultra"
//         ? cardImages.uContBoostIcon
//         : cardImages.contBoostIcon;
//     if (boostIcon) ctx.drawImage(boostIcon, 12, 809);
//   }
//   if (
//     cardImages.forceIcon &&
//     card.resourceCost > 0 &&
//     card.cardType === "special"
//   ) {
//     ctx.drawImage(cardImages.forceIcon, 4, 8);
//   }

//   ctx.textAlign = "center";
//   ctx.letterSpacing = "2px";
//   ctx.font = statFont;
//   ctx.fillStyle = "#000000";
//   ctx.fillText(`${rangeToText(card.range)}`, 125, 183);
//   ctx.fillText(`${valToTextWithNA(card.power)}`, 116, 293);
//   ctx.fillText(`${valToTextMinZero(card.speed)}`, 110, 400);
//   ctx.fillText(`${valToTextWithEmpty(card.armor)}`, 100, 507);
//   ctx.fillText(`${valToTextWithEmpty(card.guard)}`, 100, 614);
// };

// const drawName = (
//   ctx: CardDrawingContext,
//   card: Card,
//   x: number,
//   y: number,
// ) => {
//   if (card.cardType == "special" || card.cardType == "ultra") {
//     ctx.textAlign = "left";
//     ctx.letterSpacing = "1px";
//   } else {
//     ctx.textAlign = "center";
//     ctx.letterSpacing = "2px";
//   }
//   ctx.font = nameFont;
//   ctx.fillStyle = "#000000";
//   ctx.fillText(card.name, x, y);
// };

// const drawCredit = (
//   ctx: CardDrawingContext,
//   card: Card,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "left";
//   ctx.letterSpacing = "1px";
//   ctx.font = creditFont;
//   ctx.fillStyle =
//     (card.cardType === "character" || card.cardType === "extra") &&
//     card.isExceedSide
//       ? "#ffffff"
//       : "#cccccc";
//   ctx.fillText(card.credit ?? "", x, y);
// };

// const drawCardImage = (
//   ctx: CardDrawingContext,
//   card: Card,
//   image: HTMLImageElement,
// ) => {
//   if (image) {
//     if (card.cardType == "special" || card.cardType == "ultra") {
//       const targetWidth = 536;

//       const scale = targetWidth / image.width;
//       const targetHeight = image.height * scale;

//       ctx.drawImage(image, 146, 100, targetWidth, targetHeight);
//     } else {
//       const targetWidth = 622;

//       const scale = targetWidth / image.width;
//       const targetHeight = image.height * scale;

//       ctx.drawImage(image, 60, 108, targetWidth, targetHeight);
//     }
//   }
// };

// const drawCardIcon = (ctx: CardDrawingContext, iconImage: HTMLImageElement) => {
//   if (iconImage) {
//     const targetWidth = 92;
//     const scale = targetWidth / iconImage.width;
//     const targetHeight = iconImage.height * scale;

//     drawIconClippedToCircle(ctx, iconImage, 627, 25, targetWidth, targetHeight);
//   }
// };

// const drawTextAndFlavor = (
//   ctx: CardDrawingContext,
//   imageData: CardImageData,
//   card: Card,
//   textX: number,
//   textY: number,
// ) => {
//   if (card.cardType == "special" || card.cardType == "ultra") {
//     ctx.letterSpacing = "0px";

//     // Draw the Action Text
//     drawRichText(
//       ctx,
//       imageData,
//       card.flavorText
//         ? `[f]${card.flavorText}[/f]\n${card.cardText.trim()}`
//         : card.cardText,
//       textX,
//       textY,
//       5,
//       500,
//     );
//   }

//   if (card.cardType == "character") {
//     // Draw the Ability Text
//     ctx.letterSpacing = "0px";
//     drawRichText(
//       ctx,
//       imageData,
//       card.flavorText
//         ? `[f]${card.flavorText}[/f]\n${card.cardText.trim()}`
//         : card.cardText,
//       textX,
//       textY,
//       5,
//       572,
//       29,
//       characterTextFont,
//       card.isExceedSide ? "#CCCCCC" : "#000000",
//     );
//   }

//   if (card.cardType == "extra") {
//     // Draw Flavor Text
//     ctx.letterSpacing = "0px";

//     // Draw the Ability Text
//     drawRichText(
//       ctx,
//       imageData,
//       card.flavorText
//         ? `[f]${card.flavorText}[/f]\n${card.cardText.trim()}`
//         : card.cardText,
//       textX,
//       textY,
//       5,
//       608,
//       29,
//       characterTextFont,
//       card.isExceedSide ? "#CCCCCC" : "#000000",
//     );
//   }
// };

// const drawBoostName = (
//   ctx: CardDrawingContext,
//   card: Ultra | Special,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "left";
//   ctx.letterSpacing = "1px";
//   ctx.font = boostNameFont;
//   ctx.fillStyle = "#CCCCCC";
//   ctx.fillText(card.boostName.toUpperCase(), x, y);
// };

// const drawBoostText = (
//   ctx: CardDrawingContext,
//   imageData: CardImageData,
//   card: Ultra | Special,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "center";
//   ctx.letterSpacing = "0px";
//   ctx.font = textFont;
//   const boostColor = card.mechanic !== "transform" ? "#000000" : "#CCCCCC";
//   drawRichText(
//     ctx,
//     imageData,
//     card.boostText,
//     x,
//     y,
//     3,
//     550,
//     undefined,
//     undefined,
//     boostColor,
//   );
// };

// const drawGaugeCost = (
//   ctx: CardDrawingContext,
//   card: Ultra,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "center";
//   ctx.font = gaugeFont;
//   ctx.fillStyle = "#000000";
//   ctx.fillText(`${valToTextMinZero(card.resourceCost)}`, x, y);
// };

// const drawForceCost = (
//   ctx: CardDrawingContext,
//   card: Special,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "center";
//   ctx.font = statFont;
//   ctx.fillStyle = "#000000";
//   ctx.fillText(`${valToTextWithEmpty(card.resourceCost)}`, x, y);
// };

// const drawBoostForceCost = (
//   ctx: CardDrawingContext,
//   card: Ultra | Special,
//   x: number,
//   y: number,
// ) => {
//   ctx.font = statFont;
//   ctx.fillStyle = "#000000";
//   ctx.fillText(`${valToTextMinZero(card.boostForceCost)}`, x, y);
// };

// const drawExceedCost = (
//   ctx: CardDrawingContext,
//   card: Character,
//   x: number,
//   y: number,
// ) => {
//   ctx.textAlign = "center";
//   ctx.font = exceedCostFont;
//   ctx.fillText(`${valToTextMinZero(card.resourceCost)}`, x, y);
// };

// const drawCanCritIcon = (
//   ctx: CardDrawingContext,
//   x: number,
//   y: number,
//   cardImages: CardImageData,
// ) => {
//   if (cardImages.canCritIcon) {
//     ctx.drawImage(cardImages.canCritIcon, x, y);
//   }
// };

// const getFrame = (card: Card, cardImageData: CardImageData) => {
//   switch (card.cardType) {
//     case "character":
//       return card.isExceedSide
//         ? cardImageData.exceedFrame
//         : card.mechanic === "transform"
//           ? cardImageData.tfCharaFrame
//           : cardImageData.charaFrame;
//     case "ultra":
//       return card.mechanic === "transform"
//         ? cardImageData.tfUltraFrame
//         : cardImageData.ultraFrame;
//     case "extra":
//       return card.isExceedSide
//         ? cardImageData.exceedFrame
//         : cardImageData.extraFrame;
//     default:
//       return card.mechanic === "transform"
//         ? cardImageData.tfSpecialFrame
//         : cardImageData.specialFrame;
//   }
// };

// interface CardImageData extends TextIcons {
//   armPatch: HTMLImageElement | null;
//   grdPatch: HTMLImageElement | null;
//   uArmPatch: HTMLImageElement | null;
//   uGrdPatch: HTMLImageElement | null;
//   contBoostIcon: HTMLImageElement | null;
//   uContBoostIcon: HTMLImageElement | null;
//   forceIcon: HTMLImageElement | null;
//   defaultImage: HTMLImageElement | null;
//   defaultIcon: HTMLImageElement | null;
//   canCritIcon: HTMLImageElement | null;
//   cancelIcon: HTMLImageElement | null;
//   // Frames
//   specialFrame: HTMLImageElement | null;
//   ultraFrame: HTMLImageElement | null;
//   charaFrame: HTMLImageElement | null;
//   exceedFrame: HTMLImageElement | null;
//   extraFrame: HTMLImageElement | null;
//   tfSpecialFrame: HTMLImageElement | null;
//   tfUltraFrame: HTMLImageElement | null;
//   tfCharaFrame: HTMLImageElement | null;
// }

// export const useCardImageData = (): CardImageData => {
//   const armPatch = useImage(armPatchSrc);
//   const uArmPatch = useImage(uArmPatchSrc);
//   const grdPatch = useImage(grdPatchSrc);
//   const uGrdPatch = useImage(uGrdPatchSrc);
//   const contBoostIcon = useImage(contBoostIconSrc);
//   const uContBoostIcon = useImage(uContBoostIconSrc);
//   const forceIcon = useImage(forceIconSrc);
//   //Mechanics
//   const canCritIcon = useImage(canCritIconSrc);
//   const cancelIcon = useImage(cancelIconSrc);

//   const defaultImage = useImage(redBackground);
//   const defaultIcon = useImage(blankIcon);
//   //frames
//   const specialFrame = useImage(specialFrameSrc);
//   const ultraFrame = useImage(ultraFrameSrc);
//   const charaFrame = useImage(charaFrameSrc);
//   const exceedFrame = useImage(exceedFrameSrc);
//   const extraFrame = useImage(extraFrameSrc);
//   const tfSpecialFrame = useImage(tfSpecialFrameSrc);
//   const tfUltraFrame = useImage(tfUltraFrameSrc);
//   const tfCharaFrame = useImage(tfCharaFrameSrc);

//   // text icons
//   const critIcon = useImage(critIconSrc);

//   const imageData = useMemo(
//     () => ({
//       armPatch,
//       uArmPatch,
//       grdPatch,
//       uGrdPatch,
//       contBoostIcon,
//       uContBoostIcon,
//       forceIcon,
//       specialFrame,
//       ultraFrame,
//       charaFrame,
//       exceedFrame,
//       extraFrame,
//       defaultImage,
//       defaultIcon,
//       tfSpecialFrame,
//       tfUltraFrame,
//       tfCharaFrame,
//       canCritIcon,
//       cancelIcon,
//       critIcon,
//     }),
//     [
//       armPatch,
//       uArmPatch,
//       grdPatch,
//       uGrdPatch,
//       contBoostIcon,
//       uContBoostIcon,
//       forceIcon,
//       specialFrame,
//       ultraFrame,
//       charaFrame,
//       exceedFrame,
//       extraFrame,
//       defaultImage,
//       defaultIcon,
//       tfSpecialFrame,
//       tfUltraFrame,
//       tfCharaFrame,
//       canCritIcon,
//       cancelIcon,
//       critIcon,
//     ],
//   );

//   return imageData;
// };

// export const drawCard = async (
//   ctx: CardDrawingContext,
//   card: Card,
//   userImage: HTMLImageElement | null,
//   userIcon: HTMLImageElement | null,
//   cardImageData: CardImageData,
// ) => {};

// export const drawCard = async (
//   ctx: CardDrawingContext,
//   card: Card,
//   userImage: HTMLImageElement | null,
//   userIcon: HTMLImageElement | null,
//   cardImageData: CardImageData,
// ) => {
//   // Draw imported image
//   const image = userImage ?? cardImageData.defaultImage;
//   if (image) drawCardImage(ctx, card, image);

//   // Draw imported image (or default) for the top right icon if ultra or special
//   const icon = userIcon ?? cardImageData.defaultIcon;
//   if (icon) drawCardIcon(ctx, icon);

//   // Draw the Frame on top of icon and image
//   const frame = getFrame(card, cardImageData);
//   if (frame) ctx.drawImage(frame, 0, 0);

//   // Draw shared elements for special and ultra
//   if (card.cardType == "special" || card.cardType == "ultra") {
//     // Draw the Patches and stat text
//     drawStats(ctx, card, cardImageData);
//     // Bottom left boost costs
//     if (card.mechanic !== "transform") drawBoostForceCost(ctx, card, 70, 959);

//     const contBoostOffset =
//       card.isContinuousBoost && card.mechanic === "cancel" ? 60 : 0;
//     if (card.mechanic === "cancel" && cardImageData.cancelIcon) {
//       ctx.drawImage(cardImageData.cancelIcon, 26 + contBoostOffset, 813);
//     }

//     // Draw the Name Text
//     drawName(ctx, card, 95, 89);

//     drawBoostName(ctx, card, 93 + contBoostOffset, 857);
//     drawBoostText(ctx, cardImageData, card, 395, 928);

//     drawTextAndFlavor(ctx, cardImageData, card, 375, 737);
//   }

//   if (card.cardType == "special") {
//     //Only card type with force cost top left
//     drawForceCost(ctx, card, 41, 83);
//   }

//   if (card.cardType == "ultra") {
//     // Only card type with gauge in top left
//     drawGaugeCost(ctx, card, 44, 80);
//   }

//   if (card.cardType == "character") {
//     // Name drawn at lower position
//     drawName(ctx, card, 374, 793);

//     // Only card type with exceed cost
//     if (!card.isExceedSide) {
//       drawExceedCost(ctx, card, 701, 900);
//     }

//     if (card.mechanic === "critical")
//       drawCanCritIcon(ctx, 627, 733, cardImageData);

//     drawTextAndFlavor(ctx, cardImageData, card, 367, 902);
//   }

//   if (card.cardType == "extra") {
//     drawName(ctx, card, 375, 793);

//     drawTextAndFlavor(ctx, cardImageData, card, 375, 902);
//   }

//   const barPosition =
//     card.cardType === "character" || card.cardType === "extra"
//       ? [86, 809]
//       : [130, 628];
//   if (card.credit) drawCredit(ctx, card, barPosition[0], barPosition[1]);
//};
