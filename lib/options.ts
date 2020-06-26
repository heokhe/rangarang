export type Options = {
  skipPixels: number;
  minLuminance: number;
  maxLuminance: number;
  minSaturation: number;
}

export const DEFAULT_OPTIONS: Options = {
  maxLuminance: 0.8,
  minLuminance: 0.2,
  minSaturation: 0.1,
  skipPixels: 0
};
