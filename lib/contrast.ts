import { RGB, clamp } from './helpers-and-types';

function getRelativeLuminance(color: RGB) {
  const [r, g, b] = color.map(x => x / 255).map(x => {
    if (x <= 0.03928) return x / 12.92;
    return ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calculateContrastRatio(a: RGB | number, b: RGB | number) {
  const la = (typeof a === 'number' ? a : getRelativeLuminance(a)) + 0.05,
    lb = (typeof b === 'number' ? b : getRelativeLuminance(b)) + 0.05;
  return la > lb ? la / lb : lb / la;
}

const STEP = 5;
export function ensureContrastRatio(background: RGB, color: RGB): RGB {
  if (calculateContrastRatio(background, color) >= 4.5) return color;

  const rlb = getRelativeLuminance(background);
  let isNegative = getRelativeLuminance(color) < rlb;
  let hasSwitched = false;
  let [r, g, b] = color;
  for (;;) {
    if (r === g && r === b && (r === 255 || r === 0)) {
      if (!hasSwitched) {
        isNegative = !isNegative;
        [r, g, b] = color;
        hasSwitched = true;
        continue;
      } else {
        return calculateContrastRatio(rlb, 0) > calculateContrastRatio(rlb, 1)
          ? [0, 0, 0]
          : [255, 255, 255];
      }
    }
    const step = isNegative ? -STEP : STEP;
    r = clamp(r + step);
    g = clamp(g + step);
    b = clamp(b + step);
    if (calculateContrastRatio(rlb, [r, g, b]) >= 4.5) return [r, g, b];
  }
}
