import { DEFAULT_OPTIONS, Options } from './options'
import { getLuminance, getSaturation } from './hsl'
import {
  Data,
  RGB,
  serializeHex,
  generateKey,
  maxMap,
} from './helpers-and-types'
import { ensureContrastRatio } from './contrast'

export class ColorPicker {
  private _colorsMap: Map<string, RGB> = new Map()

  private _occurencesMap: Map<string, number> = new Map()

  private _options: Options

  constructor(data: Data, options?: Partial<Options>) {
    this._options = { ...DEFAULT_OPTIONS, ...options }
    this._collectData(data)
  }

  private _isGood(color: RGB) {
    const l = getLuminance(color),
      { maxLuminance, minSaturation, minLuminance } = this._options
    return (
      l > minLuminance &&
      l < maxLuminance &&
      getSaturation(color) >= minSaturation
    )
  }

  private _collectData(data: Data) {
    const step = 4 * (this._options.skipPixels + 1)
    const { length } = data
    for (let i = 0; i < length; i += step) {
      const rgb: RGB = [data[i], data[i + 1], data[i + 2]]
      const key = generateKey(rgb)
      this._occurencesMap.set(key, (this._occurencesMap.get(key) || 0) + 1)
      if (!this._colorsMap.has(key)) this._colorsMap.set(key, rgb)
    }
  }

  private _getScore(color: RGB, key: string) {
    const l = getLuminance(color)
    return (
      (l - this._options.minLuminance) *
      (this._options.maxLuminance - l) *
      (this._occurencesMap.get(key) || 0)
    )
  }

  getBestColor(): { text: string; background: string } {
    const bestBackgroundColor = maxMap(
      [...this._colorsMap.values()],
      color => {
        return this._occurencesMap.get(generateKey(color)) || 0
      },
      0,
    )
    const bestForegroundColorWithoutContrast = maxMap(
      [...this._colorsMap.entries()],
      ([key, color]) => {
        return this._isGood(color) ? this._getScore(color, key) : 0
      },
      0,
    )[1]
    const bestForegroundColor = ensureContrastRatio(
      bestBackgroundColor,
      bestForegroundColorWithoutContrast,
    )
    return {
      text: serializeHex(bestForegroundColor),
      background: serializeHex(bestBackgroundColor),
    }
  }
}

export default function rangarang(data: Data, options?: Partial<Options>) {
  const picker = new ColorPicker(data, options)
  return picker.getBestColor()
}

export { getDataFromCanvas } from './data'
export type { Data, RGB } from './helpers-and-types'
