import { getSaturation, getHue, getLuminance } from './hsl';

export type RGB = [number, number, number];
export type Data = Uint8Array | Uint8ClampedArray;

export const clamp = (x: number) => Math.max(Math.min(x, 255), 0);

export const serializeHex = ([r, g, b]: RGB) => `#${
  [r, g, b].map(x => clamp(x).toString(16).padStart(2, '0')).join('')
}`;

export const round = (x: number, r: number) => Math.round(x / r) * r;

export function generateKey(rgb: RGB) {
  const s = round(getSaturation(rgb), 1 / 3),
    h = round(getHue(rgb), 6),
    l = round(getLuminance(rgb), 0.25);
  return `${h} ${s} ${l}`;
}
