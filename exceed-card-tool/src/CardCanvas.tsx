import { useEffect, useRef, useState } from "react";
import type { Card } from "./CardEditor";

// Import your actual frame assets — adjust paths to wherever you keep them
import frameBoth from "./assets/emptycard2C_wAG_CB.png";
import frameArmorOnly from "./assets/emptycard2C_wAG_CB.png";
import frameGuardOnly from "./assets/emptycard2C_wAG_CB.png";
import frameNeither from "./assets/emptycard2C_wAG_CB.png";

type FrameKey = "both" | "armorOnly" | "guardOnly" | "neither";

const FRAME_SOURCES: Record<FrameKey, string> = {
  both: frameBoth,
  armorOnly: frameArmorOnly,
  guardOnly: frameGuardOnly,
  neither: frameNeither,
};

function getFrameKey(card: Card): FrameKey {
  const hasArmor = card.armor !== undefined;
  const hasGuard = card.guard !== undefined;
  if (hasArmor && hasGuard) return "both";
  if (hasArmor) return "armorOnly";
  if (hasGuard) return "guardOnly";
  return "neither";
}

function useFrameImages() {
  const [images, setImages] = useState<
    Partial<Record<FrameKey, HTMLImageElement>>
  >({});

  useEffect(() => {
    let cancelled = false;
    const entries = Object.entries(FRAME_SOURCES) as [FrameKey, string][];

    Promise.all(
      entries.map(
        ([key, src]) =>
          new Promise<[FrameKey, HTMLImageElement]>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve([key, img]);
            img.onerror = reject;
            img.src = src;
          }),
      ),
    ).then((loaded) => {
      if (!cancelled) setImages(Object.fromEntries(loaded));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

export interface CardCanvasProps {
  card: Card;
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 420;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

export function CardCanvas(props: CardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameImages = useFrameImages();
  const { card } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameKey = getFrameKey(card);
    const frameImg = frameImages[frameKey];

    ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      // frames still loading on first render — plain fallback
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }

    ctx.fillStyle = "#111827";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(card.name, 16, 32);

    ctx.font = "13px sans-serif";
    ctx.fillText(`PWR: ${card.power ?? "N/A"}`, 16, 60);
    ctx.fillText(`SPD: ${card.speed ?? "N/A"}`, 100, 60);

    // Only draw armor/guard text when the field is defined — there's no
    // circle on the frame art to put it in otherwise.
    if (card.armor !== undefined) {
      ctx.fillText(`${card.armor}`, 220, 60); // placeholder position — align to your frame's armor circle
    }
    if (card.guard !== undefined) {
      ctx.fillText(`${card.guard}`, 260, 60); // placeholder position — align to your frame's guard circle
    }

    const [rangeMin, rangeMax] = card.range;
    const rangeText =
      rangeMin === undefined && rangeMax === undefined
        ? "Range: N/A"
        : `Range: ${rangeMin ?? "N/A"}~${rangeMax ?? "N/A"}`;
    ctx.fillText(rangeText, 16, 84);

    wrapText(ctx, card.actionText, 16, 116, CARD_WIDTH - 32, 18);
  }, [card, frameImages]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const filename =
      card.name.trim().replace(/\s+/g, "_").toLowerCase() || "card";
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={CARD_WIDTH} height={CARD_HEIGHT} />
      <button
        className="mt-2 bg-gray-800 text-white px-3 py-1"
        onClick={handleExport}
      >
        Export PNG
      </button>
    </div>
  );
}
