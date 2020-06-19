import { Data/* , Image */ } from './helpers-and-types';

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

// export default function getData(image: Image): Data {
//   if (typeof window !== 'undefined' && image instanceof HTMLImageElement) {
//     return getDataFromCanvas(image);
//   }
//   if (image instanceof Buffer) {
//     return new Uint8Array(image);
//   }
//   return image as Data;
// }
