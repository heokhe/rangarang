import { Data } from './helpers-and-types';

type Size = number | ((originalWidth: number) => number);
const getDefaultSize = (x: number) => Math.max(80, x / 16);
export function getDataFromCanvas(image: HTMLImageElement, size: Size = getDefaultSize): Data {
  const canvas = document.createElement('canvas');
  const width: number = typeof size === 'function' ? size(image.naturalWidth) : size;
  const height = width * image.naturalHeight / image.naturalWidth;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  canvas.remove();
  return data;
}
