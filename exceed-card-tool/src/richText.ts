import type { CardDrawingContext } from "./types";

const textFont = "26px AlgrySansMed";
const boldTextFont = "26px AlgrySansBold";
const italicTextFont = "26px AlgrySansItalic";
const boldItalicTextFont = "26px AlgrySansBoldItalic";

// A piece of rich text with a uniform style
export interface TextFragment {
  type: "text";
  // A font representing the style
  font: string;
  // The text
  content: string;
  // The color
  color: string;
}

interface ImageFragment {
  type: "image";
  image: HTMLImageElement | null;
  width: number;
  height: number;
}

type Fragment = TextFragment | ImageFragment;

export interface TextIcons {
  critIcon: HTMLImageElement | null;
}

/* ***************************************
 * Fragment functions
 *****************************************/

// Merge two fragments into a single fragment, if possible
// Otherwise returns null
const mergeFragments = (
  fragmentA: Fragment,
  fragmentB: Fragment,
): Fragment | null => {
  if (fragmentA.type != "text") {
    // Only text fragments can be merged
    return null;
  }
  if (fragmentB.type != "text") {
    // Fragments have different types
    return null;
  }

  // if fragment B is just whitespace, we can always merge it
  if (fragmentB.content.trim() != "") {
    // fragment B has actual content, so
    // check to make sure the styles are the same
    if (fragmentA.font != fragmentB.font) {
      return null;
    }
    if (fragmentA.color != fragmentB.color) {
      return null;
    }
  }
  return { ...fragmentA, content: `${fragmentA.content}${fragmentB.content}` };
};

const measureFragmentWidth = (
  ctx: CardDrawingContext,
  fragment: Fragment,
): number => {
  if (fragment.type == "text") {
    ctx.font = fragment.font;
    return ctx.measureText(fragment.content).width;
  } else {
    // Image fragment
    return fragment.width;
  }
};

const drawFragment = (
  ctx: CardDrawingContext,
  fragment: Fragment,
  leftX: number,
  y: number,
) => {
  if (fragment.type == "text") {
    ctx.font = fragment.font;
    ctx.textAlign = "left";
    ctx.fillStyle = fragment.color;
    ctx.fillText(fragment.content, leftX, y);
  } else {
    // Image fragment
    if (fragment.image == null) {
      return;
    }
    ctx.drawImage(fragment.image, leftX, y - fragment.height / 1.3);
    ctx.fillStyle = "#F00";
    // ctx.fillRect(leftX, y - fragment.height, fragment.width, fragment.height);
  }
};

// Take a string of text with bbcode-esque formatting, e.g. "hello [b]bold world[/b]", and split it inito
// rich text fragments
const parseFragments = (
  icons: TextIcons,
  text: string,
  font = textFont,
  colorOverride = "#000000",
): Fragment[] => {
  return text
    .trim()
    .split(/(\[[birgyupfc]{1,2}\].*?\[\/[birgyupfc]{1,2}\])/gs)
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
      } else if (split.startsWith("[c]") && split.endsWith("[/c]")) {
        // crit icon
        return {
          type: "image",
          image: icons.critIcon,
          width: 37.0,
          height: 35.0,
        };
      }
      return {
        type: "text",
        font: curFont,
        content: curSplit,
        color: curColor,
      };
    });
};

// Take a fragment of text and split it on `splitter` into several fragments,
// each with the same style as the original one
const splitFragment = (fragment: Fragment, splitter: string): Fragment[] =>
  fragment.type === "text"
    ? fragment.content.split(splitter).map((s) => ({ ...fragment, content: s }))
    : [fragment];

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
    let candidateLinePrefix = [...currentLine];
    if (candidateLinePrefix.length > 0) {
      candidateLinePrefix = collapseFragments([
        ...candidateLinePrefix,
        {
          type: "text",
          content: " ",

          // font and color doesn't matter cuz it's whitespace
          font: textFont,
          color: "#000",
        },
      ]);
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
    if (outputFragments.length == 0) {
      outputFragments.push(fragment);
      continue;
    }
    const merged = mergeFragments(
      outputFragments[outputFragments.length - 1],
      fragment,
    );
    if (merged == null) {
      outputFragments.push(fragment);
      continue;
    }
    outputFragments[outputFragments.length - 1] = merged;
  }
  return outputFragments;
};

const getFragmentLineWidth = (ctx: CardDrawingContext, line: Fragment[]) =>
  line.map((f) => measureFragmentWidth(ctx, f)).reduce((a, b) => a + b, 0);

const drawFragmentLine = (
  ctx: CardDrawingContext,
  line: Fragment[],
  x: number,
  y: number,
) => {
  const totalWidth = getFragmentLineWidth(ctx, line);

  let cursorX = x - totalWidth / 2;
  for (const fragment of line) {
    const width = measureFragmentWidth(ctx, fragment);
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

export const drawRichText = (
  ctx: CardDrawingContext,
  icons: TextIcons,
  text: string,
  x: number,
  y: number,
  maximumLineCount: number,
  textBoxWidth: number,
  lineHeight = 35,
  font = textFont,
  colorOverride = "#000000",
) => {
  const parsedFragments = parseFragments(icons, text, font, colorOverride);
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
