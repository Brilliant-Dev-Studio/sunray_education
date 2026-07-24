import jsQR from "jsqr";

// jsQR is a plain binarizer with no perspective/scale correction of its own.
// Real phone photos are often huge (12MP+) with the QR occupying only a
// fraction of the frame, or so large that decoding a single giant frame is
// unreliable. Trying a few different working resolutions meaningfully
// improves the real-world hit rate.
const ATTEMPT_MAX_DIMENSIONS = [1000, 1600, 600];

function decodeAtScale(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxDimension: number
): string | null {
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(source, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });
  return result?.data ?? null;
}

export function decodeQrFromImageElement(img: HTMLImageElement): string | null {
  for (const maxDimension of ATTEMPT_MAX_DIMENSIONS) {
    const data = decodeAtScale(img, img.naturalWidth, img.naturalHeight, maxDimension);
    if (data) return data;
  }
  // Last resort: full native resolution, uncapped.
  return decodeAtScale(img, img.naturalWidth, img.naturalHeight, Infinity);
}
