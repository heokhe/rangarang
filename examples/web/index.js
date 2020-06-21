/* eslint-disable no-restricted-globals, no-console */
import rangarang, { getDataFromCanvas } from '../../dist/index.modern.js';

window.onload = () => {
  const filename = new URLSearchParams(location.search).get('i');
  if (filename) {
    const image = new Image();
    image.src = `images/${filename}`;
    image.onload = () => {
      console.time('picker');
      const bestColor = rangarang(getDataFromCanvas(image)).primary;
      console.timeEnd('picker');
      document.body.prepend(image);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          image.classList.add('active');
          document.body.style.backgroundColor = bestColor;
          document.title = bestColor;
          document.querySelector('meta[name=theme-color]').content = bestColor;
        });
      });
    };
  } else {
    document.body.insertAdjacentHTML('beforeend', `
      <span>
        Add a picture to <b>/examples/web</b>,
        and use the <b>?i=&lt;file-name&gt;</b> query string.
      </span>
    `);
  }
};
