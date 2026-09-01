import { useEffect, useState } from "react";
import type { Card } from "./CardEditor";
import frameSrc from "./assets/trueemptycard.png";
import armPatchSrc from "./assets/armorpatch.png";
import grdPatchSrc from "./assets/guardpatch.png";
import contBoostIconSrc from "./assets/contboosticon.png";

const nameFont = "56px ShaXizor";
const statFont = "72px MKXTitle";
const textFont = "32px AlgrySansMed";

interface CardPreviewProps {
  card: Card;
}

export function CardPreview({ card }: CardPreviewProps) {
  const frame = useImage(frameSrc);
  const armPatch = useImage(armPatchSrc);
  const grdPatch = useImage(grdPatchSrc);
  const contBoostIcon = useImage(contBoostIconSrc);

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

    // Draw the Frame
    ctx.drawImage(frame, 0, 0);

    // Draw the Patches
    if (armPatch && card.armor > 0) {
      ctx.drawImage(armPatch, 22, 430);
    }
    if (grdPatch && card.guard > 0) {
      ctx.drawImage(grdPatch, 22, 532);
    }
    // Draw the Name Text
    ctx.textAlign = "left";
    ctx.letterSpacing = "1px";
    ctx.font = nameFont;
    ctx.fillText(card.name, 95, 89);

    // Draw the Stats Text
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.font = statFont;
    ctx.fillText(`${rangeToText(card.range)}`, 125, 183);
    ctx.fillText(`${powToText(card.power)}`, 116, 293);
    ctx.fillText(`${powToText(card.speed)}`, 110, 400);
    ctx.fillText(`${defStatToText(card.armor)}`, 100, 507);
    ctx.fillText(`${defStatToText(card.guard)}`, 100, 614);

    // Draw the Action Text
    ctx.letterSpacing = "0px";
    ctx.font = textFont;
    drawStackedLines(ctx, card.actionText, 375, 737);
  }, [card, frame]);

  return (
    <canvas
      width={750}
      height={1024}
      id="card-preview"
      className="w-[500px]"
    ></canvas>
  );
}

const rangeToText = (range: [number | undefined, number | undefined]) => {
  const min = range[0];
  const max = range[1];

  // Duplicate undefined values are N/A, otherwise don't include undefined values
  if (!Number.isInteger(min) && !Number.isInteger(max)) {
    return "N/A";
  } else if (Number.isInteger(min) && Number.isInteger(max)) {
    return `${min}~${max}`;
  } else {
    return !Number.isInteger(min) ? `${max}` : `${min}`;
  }
};

const powToText = (power: number | undefined) => {
  return Number.isInteger(power) ? `${power}` : "N/A";
};

function defStatToText(defStat: number) {
  return Number.isInteger(defStat) && defStat > 0 ? `${defStat}` : "";
}

const drawStackedLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) => {
  const lines = wrapTextLines(ctx, text);

  const lineHeight = 35;
  for (let i = 0; i < lines.length; i++) {
    const offset = (i - (lines.length - 1) / 2) * lineHeight;
    ctx.fillText(lines[i], x, y + offset);
  }
};

// Returns lines of text that are split so that they do not exceed the text box width,
// dropping text that exceeds the maximum number of lines.
const wrapTextLines = (ctx: CanvasRenderingContext2D, text: string) => {
  const textBoxWidth = 550;
  const maxLines = 5;
  const words = text.split(" ");
  const lines: string[] = [];

  if (ctx.measureText(text).width < textBoxWidth) {
    lines.push(text);
    return lines;
  }

  let currentLine = "";

  for (const word of words) {
    const candidateLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(candidateLine).width < textBoxWidth) {
      currentLine = candidateLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }

    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  return lines;
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
