import { useEffect, useState } from "react";
import type { Card } from "./CardEditor";
import frameSrc from "./assets/trueemptycard.png";
import ultraFrameSrc from "./assets/ultraemptycard.png";
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
const textFont = "32px AlgrySansMed";
const boldTextFont = "32px AlgrySansBold";
const italicTextFont = "32px AlgrySansItalic";
const boldItalicTextFont = "33px AlgrySansBoldItalic";
const boostNameFont = "28px ShaXizor";

interface CardPreviewProps {
  card: Card;
}

export function CardPreview({ card }: CardPreviewProps) {
  const frame = useImage(card.isUltra ? ultraFrameSrc : frameSrc);
  const armPatch = useImage(armPatchSrc);
  const uArmPatch = useImage(uArmPatchSrc);
  const grdPatch = useImage(grdPatchSrc);
  const uGrdPatch = useImage(uGrdPatchSrc);
  const contBoostIcon = useImage(contBoostIconSrc);
  const uContBoostIcon = useImage(uContBoostIconSrc);
  const forceIcon = useImage(forceIconSrc);
  const cardImage = useImage(card.cardImage);
  const cardIcon = useImage(card.cardIcon);

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
    console.log("card changed!", cardCanvas);

    ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

    // Draw imported image
    if (cardImage) {
      const targetWidth = 536;

      const scale = targetWidth / cardImage.width;
      const targetHeight = cardImage.height * scale;

      ctx.drawImage(cardImage, 146, 100, targetWidth, targetHeight);
    }

    // Draw imported image (or default) for the top right icon
    if (cardIcon) {
      const targetWidth = 92;
      const scale = targetWidth / cardIcon.width;
      const targetHeight = cardIcon.height * scale;

      //ctx.drawImage(cardIcon, 629, 31, targetWidth, targetHeight);
      drawIconClippedToCircle(
        ctx,
        cardIcon,
        626,
        35,
        targetWidth,
        targetHeight,
      );
    }

    // Draw the Frame
    ctx.drawImage(frame, 0, 0);

    // Draw the Patches, checking for if its an ultra.
    if (armPatch && card.armor > 0) {
      ctx.drawImage(card.isUltra ? uArmPatch : armPatch, 22, 430);
    }
    if (grdPatch && card.guard > 0) {
      ctx.drawImage(card.isUltra ? uGrdPatch : grdPatch, 22, 532);
    }
    if (contBoostIcon && card.isContinuousBoost) {
      ctx.drawImage(card.isUltra ? uContBoostIcon : contBoostIcon, 12, 809);
    }
    // Only use force icon if its not an ultra. Gauge is built into ultra frames.
    if (forceIcon && card.resourceCost > 0 && !card.isUltra) {
      ctx.drawImage(forceIcon, 4, 8);
    }

    // Draw the Name Text
    ctx.textAlign = "left";
    ctx.letterSpacing = "1px";
    ctx.font = nameFont;
    ctx.fillStyle = "#000000";
    ctx.fillText(card.name, 95, 89);

    // Draw the Stats Text
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.font = statFont;
    ctx.fillText(`${rangeToText(card.range)}`, 125, 183);
    ctx.fillText(`${powToText(card.power)}`, 116, 293);
    ctx.fillText(`${spdOrCostToText(card.speed)}`, 110, 400);
    ctx.fillText(`${defStatToText(card.armor)}`, 100, 507);
    ctx.fillText(`${defStatToText(card.guard)}`, 100, 614);

    // Draw the Resource Cost Text
    if (card.isUltra) {
      ctx.font = gaugeFont;
      ctx.fillText(`${spdOrCostToText(card.resourceCost)}`, 44, 80);
    } else {
      ctx.font = statFont;
      ctx.fillText(`${defStatToText(card.resourceCost)}`, 41, 83);
    }
    ctx.font = statFont;
    ctx.fillText(`${spdOrCostToText(card.boostForceCost)}`, 70, 959);

    // Draw the Flavor Text
    ctx.letterSpacing = "0px";
    ctx.font = boldItalicTextFont;
    drawRichText(ctx, card.flavorText, 375, 680, 2, 500, 30);

    // Draw the Action Text
    ctx.letterSpacing = "0px";
    ctx.font = textFont;
    const hasFlavorText = card.flavorText != "";
    drawRichText(
      ctx,
      card.actionText,
      375,
      hasFlavorText ? 770 : 737,
      hasFlavorText ? 3 : 5,
      500,
    );

    // Draw the Boost Name
    ctx.textAlign = "left";
    ctx.letterSpacing = "1px";
    ctx.font = boostNameFont;
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText(card.boostName.toUpperCase(), 93, 857);

    // Draw the Boost Text
    ctx.textAlign = "center";
    ctx.letterSpacing = "0px";
    ctx.font = textFont;
    ctx.fillStyle = "#000000";
    drawRichText(ctx, card.boostText, 395, 928, 3, 550);
  }, [
    card,
    frame,
    cardImage,
    cardIcon,
    armPatch,
    grdPatch,
    contBoostIcon,
    forceIcon,
  ]);

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

const powToText = (power: number | undefined) => {
  return Number.isInteger(power) ? `${power}` : "N/A";
};

const defStatToText = (defStat: number | undefined) => {
  return Number.isInteger(defStat) && defStat > 0 ? `${defStat}` : "";
};

const spdOrCostToText = (spdOrCost: number | undefined) => {
  return Number.isInteger(spdOrCost) ? `${spdOrCost}` : "0";
};

const drawIconClippedToCircle = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  tw: number,
  th: number,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 100, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, x, y, tw, th);
  ctx.restore();
};

const useImage = (src: string) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
};

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
const parseFragments = (text: string): Fragment[] => {
  return text
    .split(/(\[[birgyupf]{1,2}\].*?\[\/[birgyupf]{1,2}\])/)
    .map((split) => {
      let curFont = textFont;
      let curColor = "#000000";
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
        curColor = "#ff0000";
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

  let currentFragmentSet = [];
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
  ctx: CanvasRenderingContext2D,
  line: Fragment[],
  textBoxWidth: number,
): Fragment[][] => {
  const words = splitFragments(line, " ");
  const lines: Fragment[][] = [];

  if (getFragmentLineWidth(ctx, line) < textBoxWidth) {
    lines.push(line);
    return lines;
  }

  let currentLine = [];

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

const measureFragment = (ctx: CanvasRenderingContext2D, fragment: Fragment) => {
  ctx.font = fragment.font;
  return ctx.measureText(fragment.content);
};

const getFragmentLineWidth = (
  ctx: CanvasRenderingContext2D,
  line: Fragment[],
) => line.map((f) => measureFragment(ctx, f).width).reduce((a, b) => a + b, 0);

const drawFragment = (
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maximumLineCount: number,
  textBoxWidth: number,
  lineHeight = 35,
) => {
  const parsedFragments = parseFragments(text);
  const fragmentLines = splitFragments(parsedFragments, "\n");
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
