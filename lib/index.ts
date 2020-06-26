import { getHue, getLuminance, getSaturation } from './hsl';
import {
  Data, round, deserializeHex, serializeHex,
  createScoreCalculator, ScoreCalculator,
  createComparator, Comparator
} from './helpers-and-types';
import { ensureContrastRatio } from './contrast';

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
  skipPixels: 0
};

export class ColorPicker {
  private _colorsMap: Map<string, string>;

  private _occurencesMap: Map<string, number>;

  private _options: Options;

  private _calculateScore: ScoreCalculator;

  private _compare: Comparator;

  constructor(data: Data, options: Options) {
    this._options = options;
    this._calculateScore = createScoreCalculator(
      this._options.minLuminance, this._options.maxLuminance
    );
    this._compare = createComparator(this._calculateScore);
    this._colorsMap = new Map();
    this._occurencesMap = new Map();
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
      const k = this._generateKey(hex);
      this._occurencesMap.set(k, (this._occurencesMap.get(k) || 0) + 1);
      const prevColor = this._colorsMap.get(k);
      if (!prevColor) this._colorsMap.set(k, hex);
    }
  }

  private _generateKey(color: string) {
    const rgb = deserializeHex(color),
      s = round(getSaturation(rgb), 1 / 3).toPrecision(),
      h = round(getHue(rgb), 6),
      l = round(getLuminance(rgb), 0.25).toPrecision();
    return `${h} ${s} ${l}`;
  }

  private _getScore(color: string) {
    return this._calculateScore(deserializeHex(color)) * (
      this._occurencesMap.get(this._generateKey(color)) || 0
    );
  }

  getBestColor() {
    let prevColor: string,
      prevBg: string,
      prevScore: number,
      prevBgScore: number;
    for (const color of this._colorsMap.values()) {
      const bgScore = this._occurencesMap.get(this._generateKey(color)) || 0;
      if (!prevBg || bgScore > prevBgScore) {
        prevBg = color;
        prevBgScore = bgScore;
      }
    }
    for (const color of this._colorsMap.values()) {
      if (!this._isGood(color)) continue;
      const score = this._getScore(color);
      if (!prevColor || score > prevScore) {
        prevColor = color;
        prevScore = score;
      }
    }
    prevColor = serializeHex(
      ensureContrastRatio(deserializeHex(prevBg), deserializeHex(prevColor ?? prevBg))
    );
    return { primary: prevColor, background: prevBg };
  }
}

export default function rangarang(data: Data, options: Partial<Options> = {}) {
  const picker = new ColorPicker(data, { ...DEFAULT_OPTIONS, ...options });
  return picker.getBestColor();
}

export { getDataFromCanvas } from './data';
export type { Data, Image, RGB } from './helpers-and-types';
