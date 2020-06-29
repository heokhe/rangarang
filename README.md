# 🌈 Rangarang
Rangarang (Persian word for "Colorful") is a tiny library that **chooses the best colors from a picture**. It extracts a beautiful background color, and an accessible text color.

It is:
- Very, very lightweight ⚡️
- Fast 🤔
- TypeScript-friendly ✅
- Works in both Node.js and broswer environments 🌍
- **Accessible**: The colors have a >= 4.5 contrast ratio when used together!

## Usage
This library uses the pixel data of the image. In browsers, it's easy to gather the pixel data using a `<canvas>` element:
```js
import rangarang, { getDataFromCanvas } from 'rangarang';

const img = document.querySelector('img');
img.onload = () => {
  const { background, text } = rangarang(getDataFromCanvas(img)));
  console.log(background, text) // prints two hexacodes
};
```
But in Node.js environments, it's a bit harder. This library does not have any functions to extract pixel data from an image in Node, but you can extract it using your favorite library and use it:
```js
const rangarang = require('rangarang').default;
rangarang(somehowGetPixelData());
```

## Documentation
### `rangarang`
| Argument name | Type | Description
| - | - | -
| `data` | `Uint8Array \| Uint8ClampedArray` | Image's pixel data.
| `options` | `object?` | Options. 👇
| `options.skipPixels` | `number?` | Number of pixels to skip in each iteration. Defaults to 0
| `options.minLuminance` | `number?` | The minimum luminance for an acceptable color. Defaults to 0.2
| `options.maxLuminance` | `number?` | The maximum luminance for an acceptable color. Defaults to 0.8
| `options.minSaturation` | `number?` | The maximum saturation for an acceptable color. Defaults to 0.1
### `getDataFromCanvas`
| Argument name | Type | Description
| - | - | -
| `image` | `HTMLImageElement` | The source image.
| `size` | `number \| (originalWidth: number) => number` | Number or function to determine the `<canvas>`'s size. Bigger number/output results in a faster and less precise operation. Defaults to `x => Math.max(80, x / 16)`

## Development
You can visually test the code:
```sh
npm run serve
npm run build -- --watch
```
Then head to `localhost:8080/examples/web`.

## Todos
- [ ] Better support for Node.js environments
- [x] Choose not only one color but more colors (secondary, background, etc.)
- [x] Allow to modify the behaviour of the code
- [x] Improve the performance
- [ ] Write tests
