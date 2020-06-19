import { getLuminance, getSaturation } from './hsl';
import { MAX_LUM, MIN_LUM } from './constants';

export type RGB = [number, number, number];
export type Data = Uint8Array | Uint8ClampedArray;
export type Image = HTMLImageElement | Buffer | Data;

export const serializeHex = ([r, g, b]: RGB) => `#${
  [r, g, b].map(x => Math.min(Math.round(x), 255).toString(16).padStart(2, '0')).join('')
}`;

export const deserializeHex = (hex: string) => [
  hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)
].map(s => parseInt(s, 16)) as RGB;

export const round = (x: number, r: number) => Math.round(x / r) * r;

export const calculateColorScore = (rgb: RGB, includeSaturation = false) => {
  const l = getLuminance(rgb);
  return (l - MIN_LUM) * (MAX_LUM - l) * (includeSaturation ? getSaturation(rgb) : 1);
};

export const nextIsBetter = (prev: string, next: string) => {
  return next !== prev && (
    calculateColorScore(
      deserializeHex(prev), true
    ) < calculateColorScore(
      deserializeHex(next), true
    )
  );
};
