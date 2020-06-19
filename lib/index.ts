import { getHue, getLuminance, getSaturation } from './hsl';
import {
  RGB, Data, round, deserializeHex, serializeHex, calculateColorScore, nextIsBetter
} from './helpers-and-types';
import {
  HUE_STEP, SAT_STEP, MIN_SAT, MIN_LUM, MAX_LUM
} from './constants';

export default class ColorPicker {
  private _data: Data;

  private _colorsMap: Map<string, string>;

  private _occurencesMap: Map<string, number>;

  constructor(data: Data) {
    this._data = data;
    this._colorsMap = new Map();
    this._occurencesMap = new Map();
    this._extractIntoSet();
  }

  private _extractIntoSet() {
    const data = this._data;
    for (let i = 0; i < data.length; i += 4) {
      const rgb: RGB = [data[i], data[i + 1], data[i + 2]],
        hex = serializeHex(rgb),
        l = getLuminance(rgb);

      if (l > MIN_LUM && l < MAX_LUM && getSaturation(rgb) >= MIN_SAT) {
        const k = this._generateKey(hex);
        const value = this._occurencesMap.get(k) || 0;
        this._occurencesMap.set(k, value + 1);
        if (value === 0 || nextIsBetter(this._colorsMap.get(k), hex)) this._colorsMap.set(k, hex);
      }
    }
  }

  private _generateKey(color: string) {
    const rgb = deserializeHex(color),
      s = round(getSaturation(rgb), SAT_STEP),
      h = round(getHue(rgb), HUE_STEP);
    return `${h === 360 ? 0 : h} ${s}`;
  }

  private _getScore(color: string) {
    return calculateColorScore(deserializeHex(color)) * (
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

export { getDataFromCanvas } from './data';
export type { Data, Image, RGB } from './helpers-and-types';
