import { useEffect, useMemo, useState } from "react";
import type { Card, Character, Special, Ultra } from "./CardEditor";
import frameSrc from "./assets/trueemptycard.png";
import ultraFrameSrc from "./assets/ultraemptycard.png";
import charaFrameSrc from "./assets/characteremptycard.png";
import exceedFrameSrc from "./assets/exceedcharaemptycard.png";
import extraFrameSrc from "./assets/extraemptycard.png";
import redBackground from "./assets/redbackground.png";
import blankIcon from "./assets/blankicon.png";
import armPatchSrc from "./assets/armorpatch.png";
import uArmPatchSrc from "./assets/uarmorpatch.png";
import grdPatchSrc from "./assets/guardpatch.png";
import uGrdPatchSrc from "./assets/uguardpatch.png";
import contBoostIconSrc from "./assets/contboosticon.png";
import uContBoostIconSrc from "./assets/ucontboosticon.png";
import forceIconSrc from "./assets/forceicon.png";

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

const isInteger = (val: number | undefined): val is number =>
  val !== undefined && Number.isInteger(val);

type CardDrawingContext =
  CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

interface CardPreviewProps {
  card: Card;
}

export function CardPreview({ card }: CardPreviewProps) {
  const cardImage = useImage(card.cardImage ?? redBackground);
  const cardIcon = useImage(
    card.cardType == "special" || card.cardType == "ultra"
      ? card.cardIcon
      : undefined,
  );
  const imageData = useCardImageData();
  const frame = getFrame(card, imageData);
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
    if (frame == null) {
      return;
    }
    const ctx = cardCanvas.getContext("2d");
    if (!ctx) return;
    console.log("card changed!", cardCanvas);

    ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

    // Draw the card

    drawCard(ctx, card, cardImage, cardIcon, imageData);
  }, [card, frame, cardImage, cardIcon, areFontsReady, imageData]);

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
    setImage(null);
    if (src === undefined) {
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
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

// A piece of rich text with a uniform style
interface Fragment {
  // A font representing the style
  font: string;
  // The text
  content: string;
  // The color
  color: string;
}

// Take a string of text with bbcode-esque formatting, e.g. "hello [b]bold world[/b]", and split it inito
// rich text fragments
const parseFragments = (
  text: string,
  font = textFont,
  colorOverride = "#000000",
): Fragment[] => {
  return text
    .split(/(\[[birgyupf]{1,2}\].*?\[\/[birgyupf]{1,2}\])/gs)
    .map((split) => {
      let curFont = font;
      let curColor = colorOverride;
      let curSplit = split;
      if (split.startsWith("[b]") && split.endsWith("[/b]")) {
        curFont = boldTextFont;
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[i]") && split.endsWith("[/i]")) {
        curFont = italicTextFont;
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[bi]") && split.endsWith("[/bi]")) {
        curFont = boldItalicTextFont;
        curSplit = split.slice(4, -5);
      } else if (split.startsWith("[r]") && split.endsWith("[/r]")) {
        curColor = "#b80000";
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[g]") && split.endsWith("[/g]")) {
        curColor = "#127a00";
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[y]") && split.endsWith("[/y]")) {
        curColor = "#877400";
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[p]") && split.endsWith("[/p]")) {
        curColor = "#7d2e81";
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[u]") && split.endsWith("[/u]")) {
        curColor = "#0069ff";
        curSplit = split.slice(3, -4);
      } else if (split.startsWith("[f]") && split.endsWith("[/f]")) {
        // flavor text
        curColor = "#b80000";
        curFont = boldItalicTextFont;
        curSplit = split.slice(3, -4);
      }
      return { font: curFont, content: curSplit, color: curColor };
    });
};

// Take a fragment of text and split it on `splitter` into several fragments,
// each with the same style as the original one
const splitFragment = (fragment: Fragment, splitter: string): Fragment[] =>
  fragment.content.split(splitter).map((s) => ({ ...fragment, content: s }));

// Take a list of fragments and split it into multiple fragment lists,
// where any fragments containing `splitter` are separated into multiple fragments
const splitFragments = (
  fragments: Fragment[],
  splitter: string,
): Fragment[][] => {
  const outputFragmentSets = [];

  let currentFragmentSet: Fragment[] = [];
  for (const fragment of fragments) {
    const [firstSplit, ...restSplits] = splitFragment(fragment, splitter);

    // The first split goes into the current fragment list,
    // any subsequent splits get their own list
    currentFragmentSet.push(firstSplit);
    for (const split of restSplits) {
      outputFragmentSets.push(currentFragmentSet);
      currentFragmentSet = [split];
    }
  }

  // Any leftover fragments go in
  outputFragmentSets.push(currentFragmentSet);

  return outputFragmentSets;
};

const wrapFragmentLine = (
  ctx: CardDrawingContext,
  line: Fragment[],
  textBoxWidth: number,
): Fragment[][] => {
  const words = splitFragments(line, " ");
  const lines: Fragment[][] = [];

  if (getFragmentLineWidth(ctx, line) < textBoxWidth) {
    lines.push(line);
    return lines;
  }

  let currentLine: Fragment[] = [];

  for (const word of words) {
    // Build a new candidate line by sticking a space on the end of the current
    // line, and then appending the next word

    // First, stick the space onto the last fragment
    const candidateLinePrefix = [...currentLine];
    if (candidateLinePrefix.length > 0) {
      const lastFragment = candidateLinePrefix[candidateLinePrefix.length - 1];
      candidateLinePrefix[candidateLinePrefix.length - 1] = {
        ...lastFragment,
        content: `${lastFragment.content} `,
      };
    }
    // Now add the new word and merge it into the existing fragments if possible
    const candidateLine = collapseFragments([...candidateLinePrefix, ...word]);

    if (getFragmentLineWidth(ctx, candidateLine) < textBoxWidth) {
      currentLine = candidateLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines;
};

// Merge fragments that have the same style together
const collapseFragments = (fragments: Fragment[]): Fragment[] => {
  const outputFragments: Fragment[] = [];
  for (const fragment of fragments) {
    if (
      outputFragments.length == 0 ||
      outputFragments[outputFragments.length - 1].font != fragment.font ||
      outputFragments[outputFragments.length - 1].color != fragment.color
    ) {
      outputFragments.push(fragment);
    } else {
      outputFragments[outputFragments.length - 1] = {
        ...fragment,
        content: `${outputFragments[outputFragments.length - 1].content}${fragment.content}`,
      };
    }
  }
  return outputFragments;
};

const measureFragment = (ctx: CardDrawingContext, fragment: Fragment) => {
  ctx.font = fragment.font;
  return ctx.measureText(fragment.content);
};

const getFragmentLineWidth = (ctx: CardDrawingContext, line: Fragment[]) =>
  line.map((f) => measureFragment(ctx, f).width).reduce((a, b) => a + b, 0);

const drawFragment = (
  ctx: CardDrawingContext,
  fragment: Fragment,
  leftX: number,
  y: number,
) => {
  ctx.font = fragment.font;
  ctx.textAlign = "left";
  ctx.fillStyle = fragment.color;
  ctx.fillText(fragment.content, leftX, y);
};

const drawFragmentLine = (
  ctx: CardDrawingContext,
  line: Fragment[],
  x: number,
  y: number,
) => {
  const totalWidth = getFragmentLineWidth(ctx, line);

  let cursorX = x - totalWidth / 2;
  for (const fragment of line) {
    const width = measureFragment(ctx, fragment).width;
    drawFragment(ctx, fragment, cursorX, y);
    cursorX += width;
  }
};

// Takes an array of lines and draws them on a canvas, centered on (x,y)
// Each line is an array of fragments
const drawFragmentLines = (
  ctx: CardDrawingContext,
  lines: Fragment[][],
  x: number,
  y: number,
  lineHeight: number,
) => {
  const totalHeight = lines.length * lineHeight;
  const startY = y - totalHeight / 2 + lineHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    drawFragmentLine(ctx, line, x, startY + i * lineHeight);
  }
};

const drawRichText = (
  ctx: CardDrawingContext,
  text: string,
  x: number,
  y: number,
  maximumLineCount: number,
  textBoxWidth: number,
  lineHeight = 35,
  font = textFont,
  colorOverride = "#000000",
) => {
  const parsedFragments = parseFragments(text, font, colorOverride);
  const fragmentLines = splitFragments(parsedFragments, "\n").filter(
    (line) => !isBlankLine(line),
  );
  const wrappedFragmentLines = fragmentLines.flatMap((l) =>
    wrapFragmentLine(ctx, l, textBoxWidth),
  );
  drawFragmentLines(
    ctx,
    wrappedFragmentLines.slice(0, maximumLineCount),
    x,
    y,
    lineHeight,
  );
};

const isBlankLine = (line: Fragment[]): boolean =>
  line.every((fragment) => fragment.content.trim() === "");

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

// Helper functions to draw on the canvas:
const drawStats = (
  ctx: CardDrawingContext,
  card: Ultra | Special,
  cardImages: CardImageData,
) => {
  if (cardImages.armPatch && card.armor > 0) {
    const patch =
      card.cardType === "ultra" ? cardImages.uArmPatch : cardImages.armPatch;
    if (patch) ctx.drawImage(patch, 22, 430);
  }
  if (cardImages.grdPatch && card.guard > 0) {
    const patch =
      card.cardType === "ultra" ? cardImages.uGrdPatch : cardImages.grdPatch;
    if (patch) ctx.drawImage(patch, 22, 532);
  }
  if (cardImages.contBoostIcon && card.isContinuousBoost) {
    const boostIcon =
      card.cardType === "ultra"
        ? cardImages.uContBoostIcon
        : cardImages.contBoostIcon;
    if (boostIcon) ctx.drawImage(boostIcon, 12, 809);
  }
  if (
    cardImages.forceIcon &&
    card.resourceCost > 0 &&
    card.cardType === "special"
  ) {
    ctx.drawImage(cardImages.forceIcon, 4, 8);
  }

  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";
  ctx.font = statFont;
  ctx.fillStyle = "#000000";
  ctx.fillText(`${rangeToText(card.range)}`, 125, 183);
  ctx.fillText(`${valToTextWithNA(card.power)}`, 116, 293);
  ctx.fillText(`${valToTextMinZero(card.speed)}`, 110, 400);
  ctx.fillText(`${valToTextWithEmpty(card.armor)}`, 100, 507);
  ctx.fillText(`${valToTextWithEmpty(card.guard)}`, 100, 614);
};

const drawName = (
  ctx: CardDrawingContext,
  card: Card,
  x: number,
  y: number,
) => {
  if (card.cardType == "special" || card.cardType == "ultra") {
    ctx.textAlign = "left";
    ctx.letterSpacing = "1px";
  } else {
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
  }
  ctx.font = nameFont;
  ctx.fillStyle = "#000000";
  ctx.fillText(card.name, x, y);
};

const drawCardImage = (
  ctx: CardDrawingContext,
  card: Card,
  image: HTMLImageElement,
) => {
  if (image) {
    if (card.cardType == "special" || card.cardType == "ultra") {
      const targetWidth = 536;

      const scale = targetWidth / image.width;
      const targetHeight = image.height * scale;

      ctx.drawImage(image, 146, 100, targetWidth, targetHeight);
    } else {
      const targetWidth = 622;

      const scale = targetWidth / image.width;
      const targetHeight = image.height * scale;

      ctx.drawImage(image, 60, 108, targetWidth, targetHeight);
    }
  }
};

const drawCardIcon = (ctx: CardDrawingContext, iconImage: HTMLImageElement) => {
  if (iconImage) {
    const targetWidth = 92;
    const scale = targetWidth / iconImage.width;
    const targetHeight = iconImage.height * scale;

    drawIconClippedToCircle(ctx, iconImage, 627, 25, targetWidth, targetHeight);
  }
};

const drawTextAndFlavor = (
  ctx: CardDrawingContext,
  card: Card,
  textX: number,
  textY: number,
  flavX: number,
  flavY: number,
) => {
  const hasFlavorText = !(
    card.flavorText === "" || card.flavorText === undefined
  );

  if (card.cardType == "special" || card.cardType == "ultra") {
    // Draw the Flavor Text
    ctx.letterSpacing = "0px";
    drawRichText(
      ctx,
      card.flavorText ? card.flavorText : "",
      flavX,
      flavY,
      2,
      500,
      30,
      boldItalicTextFont,
      "#b80000",
    );

    // Draw the Action Text
    drawRichText(
      ctx,
      card.cardText,
      textX,
      hasFlavorText ? textY + 33 : textY,
      hasFlavorText ? 3 : 5,
      500,
    );
  }

  if (card.cardType == "character") {
    // Draw the Flavor Text
    ctx.letterSpacing = "0px";
    drawRichText(
      ctx,
      card.flavorText ? card.flavorText : "",
      flavX,
      flavY,
      2,
      572,
      30,
      boldItalicTextFont,
      "#b80000",
    );

    // Draw the Ability Text
    drawRichText(
      ctx,
      card.cardText,
      textX,
      hasFlavorText ? textY + 33 : textY,
      hasFlavorText ? 3 : 5,
      572,
      29,
      characterTextFont,
      card.isExceedSide ? "#CCCCCC" : "#000000",
    );
  }

  if (card.cardType == "extra") {
    // Draw Flavor Text
    ctx.letterSpacing = "0px";
    drawRichText(
      ctx,
      card.flavorText ? card.flavorText : "",
      flavX,
      flavY,
      2,
      575,
      30,
      boldItalicTextFont,
      "#b80000",
    );

    // Draw the Ability Text
    drawRichText(
      ctx,
      card.cardText,
      textX,
      hasFlavorText ? textY + 33 : textY,
      hasFlavorText ? 3 : 5,
      608,
      29,
      characterTextFont,
      card.isExceedSide ? "#CCCCCC" : "#000000",
    );
  }
};

const drawBoostName = (
  ctx: CardDrawingContext,
  card: Ultra | Special,
  x: number,
  y: number,
) => {
  ctx.textAlign = "left";
  ctx.letterSpacing = "1px";
  ctx.font = boostNameFont;
  ctx.fillStyle = "#CCCCCC";
  ctx.fillText(card.boostName.toUpperCase(), x, y);
};

const drawBoostText = (
  ctx: CardDrawingContext,
  card: Ultra | Special,
  x: number,
  y: number,
) => {
  ctx.textAlign = "center";
  ctx.letterSpacing = "0px";
  ctx.font = textFont;
  ctx.fillStyle = "#000000";
  drawRichText(ctx, card.boostText, x, y, 3, 550);
};

const drawGaugeCost = (
  ctx: CardDrawingContext,
  card: Ultra,
  x: number,
  y: number,
) => {
  ctx.textAlign = "center";
  ctx.font = gaugeFont;
  ctx.fillText(`${valToTextMinZero(card.resourceCost)}`, x, y);
};

const drawForceCost = (
  ctx: CardDrawingContext,
  card: Special,
  x: number,
  y: number,
) => {
  ctx.textAlign = "center";
  ctx.font = statFont;
  ctx.fillStyle = "#000000";
  ctx.fillText(`${valToTextWithEmpty(card.resourceCost)}`, x, y);
};

const drawBoostForceCost = (
  ctx: CardDrawingContext,
  card: Ultra | Special,
  x: number,
  y: number,
) => {
  ctx.font = statFont;
  ctx.fillStyle = "#000000";
  ctx.fillText(`${valToTextMinZero(card.boostForceCost)}`, x, y);
};

const drawExceedCost = (
  ctx: CardDrawingContext,
  card: Character,
  x: number,
  y: number,
) => {
  ctx.textAlign = "center";
  ctx.font = exceedCostFont;
  ctx.fillText(`${valToTextMinZero(card.resourceCost)}`, x, y);
};

const getFrame = (card: Card, cardImageData: CardImageData) => {
  switch (card.cardType) {
    case "character":
      return card.isExceedSide
        ? cardImageData.exceedFrame
        : cardImageData.charaFrame;
    case "ultra":
      return cardImageData.ultraFrame;
    case "extra":
      return card.isExceedSide
        ? cardImageData.exceedFrame
        : cardImageData.extraFrame;
    default:
      return cardImageData.specialFrame;
  }
};

interface CardImageData {
  armPatch: HTMLImageElement | null;
  grdPatch: HTMLImageElement | null;
  uArmPatch: HTMLImageElement | null;
  uGrdPatch: HTMLImageElement | null;
  contBoostIcon: HTMLImageElement | null;
  uContBoostIcon: HTMLImageElement | null;
  forceIcon: HTMLImageElement | null;
  defaultImage: HTMLImageElement | null;
  defaultIcon: HTMLImageElement | null;
  // Frames
  specialFrame: HTMLImageElement | null;
  ultraFrame: HTMLImageElement | null;
  charaFrame: HTMLImageElement | null;
  exceedFrame: HTMLImageElement | null;
  extraFrame: HTMLImageElement | null;
}

export const useCardImageData = (): CardImageData => {
  const armPatch = useImage(armPatchSrc);
  const uArmPatch = useImage(uArmPatchSrc);
  const grdPatch = useImage(grdPatchSrc);
  const uGrdPatch = useImage(uGrdPatchSrc);
  const contBoostIcon = useImage(contBoostIconSrc);
  const uContBoostIcon = useImage(uContBoostIconSrc);
  const forceIcon = useImage(forceIconSrc);
  const specialFrame = useImage(frameSrc);
  const ultraFrame = useImage(ultraFrameSrc);
  const charaFrame = useImage(charaFrameSrc);
  const exceedFrame = useImage(exceedFrameSrc);
  const extraFrame = useImage(extraFrameSrc);
  const defaultImage = useImage(redBackground);
  const defaultIcon = useImage(blankIcon);

  const imageData = useMemo(
    () => ({
      armPatch,
      uArmPatch,
      grdPatch,
      uGrdPatch,
      contBoostIcon,
      uContBoostIcon,
      forceIcon,
      specialFrame,
      ultraFrame,
      charaFrame,
      exceedFrame,
      extraFrame,
      defaultImage,
      defaultIcon,
    }),
    [
      armPatch,
      uArmPatch,
      grdPatch,
      uGrdPatch,
      contBoostIcon,
      uContBoostIcon,
      forceIcon,
      specialFrame,
      ultraFrame,
      charaFrame,
      exceedFrame,
      extraFrame,
      defaultImage,
      defaultIcon,
    ],
  );

  return imageData;
};

export const drawCard = async (
  ctx: CardDrawingContext,
  card: Card,
  userImage: HTMLImageElement | null,
  userIcon: HTMLImageElement | null,
  cardImageData: CardImageData,
) => {
  // Draw imported image
  const image = userImage ?? cardImageData.defaultImage;
  if (image) drawCardImage(ctx, card, image);

  // Draw imported image (or default) for the top right icon if ultra or special
  const icon = userIcon ?? cardImageData.defaultIcon;
  if (icon) drawCardIcon(ctx, icon);

  // Draw the Frame on top of icon and image
  const frame = getFrame(card, cardImageData);
  if (frame) ctx.drawImage(frame, 0, 0);

  // Draw shared elements for special and ultra
  if (card.cardType == "special" || card.cardType == "ultra") {
    // Draw the Patches and stat text
    drawStats(ctx, card, cardImageData); // <- Bad?
    // Bottom left boost costs
    drawBoostForceCost(ctx, card, 70, 959);

    // Draw the Name Text
    drawName(ctx, card, 95, 89);

    drawBoostName(ctx, card, 93, 857);
    drawBoostText(ctx, card, 395, 928);

    drawTextAndFlavor(ctx, card, 375, 737, 375, 680);
  }

  if (card.cardType == "special") {
    //Only card type with force cost top left
    drawForceCost(ctx, card, 41, 83);
  }

  if (card.cardType == "ultra") {
    // Only card type with gauge in top left
    drawGaugeCost(ctx, card, 44, 80);
  }

  if (card.cardType == "character") {
    // Name drawn at lower position
    drawName(ctx, card, 374, 793);

    // Only card type with exceed cost
    if (!card.isExceedSide) {
      drawExceedCost(ctx, card, 698, 901);
    }

    drawTextAndFlavor(ctx, card, 367, 902, 370, 857);
  }

  if (card.cardType == "extra") {
    drawName(ctx, card, 375, 793);

    drawTextAndFlavor(ctx, card, 375, 902, 375, 857);
  }
};
