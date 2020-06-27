import { DEFAULT_OPTIONS, Options } from './options';
import { getLuminance, getSaturation } from './hsl';
import {
  Data, deserializeHex, serializeHex, generateKey
} from './helpers-and-types';
import { ensureContrastRatio } from './contrast';

export class ColorPicker {
  private _colorsMap: Map<string, string> = new Map();

  private _occurencesMap: Map<string, number> = new Map();

  private _options: Options;

  constructor(data: Data, options?: Partial<Options>) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
    this._collectData(data);
  }

  private _isGood(color: string) {
    const rgb = deserializeHex(color),
      l = getLuminance(rgb),
      { maxLuminance, minSaturation, minLuminance } = this._options;
    return l > minLuminance && l < maxLuminance && getSaturation(rgb) >= minSaturation;
  }

  private _collectData(data: Data) {
    const s = 4 * (this._options.skipPixels + 1);
    for (let i = 0; i < data.length; i += s) {
      const hex = serializeHex([data[i], data[i + 1], data[i + 2]]);
      const key = generateKey(hex);
      this._occurencesMap.set(key, (this._occurencesMap.get(key) || 0) + 1);
      if (!this._colorsMap.has(key)) this._colorsMap.set(key, hex);
    }
  }

  private _getScore(color: string) {
    const l = getLuminance(deserializeHex(color));
    return (l - this._options.minLuminance) * (this._options.maxLuminance - l) * (
      this._occurencesMap.get(generateKey(color)) || 0
    );
  }

  getBestColor() {
    let prevColor: string,
      prevBg: string,
      prevScore: number,
      prevBgScore: number;
    for (const color of this._colorsMap.values()) {
      const bgScore = this._occurencesMap.get(generateKey(color)) || 0;
      if (!prevBg || bgScore > prevBgScore) {
        prevBg = color;
        prevBgScore = bgScore;
      }
      if (this._isGood(color)) {
        const score = this._getScore(color);
        if (!prevColor || score > prevScore) {
          prevColor = color;
          prevScore = score;
        }
      }
    }
    prevColor = serializeHex(
      ensureContrastRatio(deserializeHex(prevBg), deserializeHex(prevColor ?? prevBg))
    );
    return { text: prevColor, background: prevBg };
  }
}

export default function rangarang(data: Data, options?: Partial<Options>) {
  const picker = new ColorPicker(data, options);
  return picker.getBestColor();
}

export { getDataFromCanvas } from './data';
export type { Data, RGB } from './helpers-and-types';
