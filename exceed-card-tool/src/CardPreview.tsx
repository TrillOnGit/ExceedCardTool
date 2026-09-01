import { useEffect, useState } from "react";
import type { Card } from "./CardEditor";
import frameSrc from "./assets/emptycard2C_wAG_CB.png";

const nameFont = "56px ShaXizor";
const statFont = "72px MKXTitle";

interface CardPreviewProps {
  card: Card;
}

export function CardPreview({ card }: CardPreviewProps) {
  const frame = useImage(frameSrc);
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

    // Draw the Name Text
    ctx.letterSpacing = "1px";
    ctx.textAlign = "left";
    ctx.font = nameFont;
    ctx.fillText(card.name, 95, 89);

    // Draw the Stats Text
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.font = statFont;
    ctx.fillText(`${rangeToText(card.range)}`, 125, 183);
    ctx.fillText(`${powToText(card.power)}`, 116, 293);
    ctx.fillText(`${powToText(card.speed)}`, 110, 400);
    ctx.fillText(`${powToText(card.armor)}`, 100, 507);
    ctx.fillText(`${powToText(card.guard)}`, 100, 614);
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

const useImage = (src: string) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
};
