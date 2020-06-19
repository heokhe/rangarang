/* eslint-disable no-console */
import rangarang, { getDataFromCanvas } from '../../dist/index.modern.js';

window.onload = () => {
  const image = new Image();
  image.src = 'leaf.jpg';
  image.onload = () => {
    console.time('picker');
    const bestColor = rangarang(getDataFromCanvas(image)).primary;
    console.timeEnd('picker');
    document.body.style.backgroundColor = bestColor;
    document.title = bestColor;
    document.querySelector('meta[name=theme-color]').content = bestColor;
    document.body.prepend(image);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        image.classList.add('active');
      });
    });
  };
};
