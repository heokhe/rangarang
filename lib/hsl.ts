import { RGB } from './helpers-and-types';

export const getLuminosity = ([r, g, b]: RGB) => (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;

export function getHue([r, g, b]: RGB) {
  [r, g, b] = [r, g, b].map(x => x / 255);
  let h = 0;
  if (r >= g && g >= b) {
    h = (g - b) / (r - b);
  } else if (g > r && r >= b) {
    h = 2 - (r - b) / (g - b);
  } else if (g >= b && b > r) {
    h = 2 + (b - r) / (g - r);
  } else if (b > g && g > r) {
    h = 4 - (g - r) / (b - r);
  } else if (b > r && r >= g) {
    h = 4 + (r - g) / (b - g);
  } else if (r >= b && b > g) {
    h = 6 - (b - g) / (r - g);
  }

  h *= 60;
  if (h < 0) h += 360;

  if (360 - h <= 5) return 0;

  return h;
}

export function getSaturation([r, g, b]: RGB) {
  const l = getLuminosity([r, g, b]);
  if (l === 1) return 0;
  return (Math.max(r, g, b) - Math.min(r, g, b)) / 255 / (1 - Math.abs(2 * l - 1));
}
