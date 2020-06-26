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
