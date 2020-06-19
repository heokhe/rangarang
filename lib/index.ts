import { getHue, getLuminance, getSaturation } from './hsl';
import {
  RGB, Data, round, deserializeHex, serializeHex,
  createScoreCalculator, ScoreCalculator,
  createComparator, Comparator
} from './helpers-and-types';

export type Options = {
  skipPixels: number;
  minLuminance: number;
  maxLuminance: number;
  minSaturation: number;
}

const DEFAULT_OPTIONS: Options = {
  maxLuminance: 0.8,
  minLuminance: 0.2,
  minSaturation: 0.1,
  skipPixels: 1
};

export class ColorPicker {
  private _data: Data;

  private _colorsMap: Map<string, string>;

  private _occurencesMap: Map<string, number>;

  private _options: Options;

  private _calculateScore: ScoreCalculator;

  private _compare: Comparator;

  constructor(data: Data, options: Options) {
    this._data = data;
    this._options = options;
    this._calculateScore = createScoreCalculator(
      this._options.minLuminance, this._options.maxLuminance
    );
    this._compare = createComparator(this._calculateScore);
    this._colorsMap = new Map();
    this._occurencesMap = new Map();
    this._extractIntoSet();
  }

  private _extractIntoSet() {
    const data = this._data,
      {
        maxLuminance: maxl, minLuminance: minl, minSaturation: mins, skipPixels
      } = this._options;
    for (let i = 0; i < data.length; i += 4 * skipPixels) {
      const rgb: RGB = [data[i], data[i + 1], data[i + 2]],
        hex = serializeHex(rgb),
        l = getLuminance(rgb);

      if (l > minl && l < maxl && getSaturation(rgb) >= mins) {
        const k = this._generateKey(hex);
        const value = this._occurencesMap.get(k) || 0;
        this._occurencesMap.set(k, value + 1);
        if (value === 0 || this._compare(this._colorsMap.get(k), hex)) this._colorsMap.set(k, hex);
      }
    }
  }

  private _generateKey(color: string) {
    const rgb = deserializeHex(color),
      s = round(getSaturation(rgb), 4),
      h = round(getHue(rgb), 30);
    return `${h === 360 ? 0 : h} ${s}`;
  }

  private _getScore(color: string) {
    return this._calculateScore(deserializeHex(color)) * (
      this._occurencesMap.get(this._generateKey(color)) || 0
    );
  }

  getBestColor() {
    let prevColor: string,
      prevScore: number;
    for (const color of this._colorsMap.values()) {
      const score = this._getScore(color);
      if (!prevColor || score > prevScore) {
        prevColor = color;
        prevScore = score;
      }
    }
    return { primary: prevColor };
  }
}

export default function rangarang(data: Data, options: Partial<Options> = {}) {
  const picker = new ColorPicker(data, { ...options, ...DEFAULT_OPTIONS });
  return picker.getBestColor();
}

export { getDataFromCanvas } from './data';
export type { Data, Image, RGB } from './helpers-and-types';
