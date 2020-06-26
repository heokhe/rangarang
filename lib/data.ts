import { Data } from './helpers-and-types';

export function getDataFromCanvas(image: HTMLImageElement, divideSizeTo = 16): Data {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth / divideSizeTo;
  canvas.height = image.naturalHeight / divideSizeTo;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.remove();
  return data;
}
