import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { TILE_RADIUS } from "./coordinates";

const MOISTURE_SEED = "MOISTURE_SEED";
const HEIGHT_SEED = "HEIGHT_SEED";
const MOISTURE_FREQUENCY = 0.6;
const FUDGE_FACTOR = 1.2;
const EXPONENT = 1.6;

export const moistureNoise = createNoise2D(alea(MOISTURE_SEED));
export const elevationNoise = createNoise2D(alea(HEIGHT_SEED));

export enum Biomes {
  DESERT,
  DUNE,
  ROCK,
  GRASS,
  SHRUBLAND,
  FOREST,
  MIXED_FOREST,
  NEEDLE_LEAF_FOREST,
  ALPINE_FOREST,
  SNOW,
  WATER,
  DEEP_WATER,
}

export const BiomeColors: Record<Biomes, number> = {
  [Biomes.DESERT]: 0xf6f2cb,
  [Biomes.DUNE]: 0xffd687,
  [Biomes.ROCK]: 0x9e9e9e,
  [Biomes.GRASS]: 0x8bba31,
  [Biomes.SHRUBLAND]: 0x8c6c28,
  [Biomes.FOREST]: 0x00aa26,
  [Biomes.MIXED_FOREST]: 0x377657,
  [Biomes.NEEDLE_LEAF_FOREST]: 0x4c6a41,
  [Biomes.ALPINE_FOREST]: 0x4c6a41,
  [Biomes.SNOW]: 0xdcdcdc,
  [Biomes.WATER]: 0x29557a,
  [Biomes.DEEP_WATER]: 0x2e3359,
};

export const BiomeNames: Record<Biomes, string> = {
  [Biomes.DESERT]: "Desert",
  [Biomes.DUNE]: "Dune",
  [Biomes.ROCK]: "Rock",
  [Biomes.GRASS]: "Grass",
  [Biomes.SHRUBLAND]: "Shrubland",
  [Biomes.FOREST]: "Forest",
  [Biomes.MIXED_FOREST]: "Mixed Forest",
  [Biomes.NEEDLE_LEAF_FOREST]: "Needle Leaf Forest",
  [Biomes.ALPINE_FOREST]: "Alpine Forest",
  [Biomes.SNOW]: "Snow",
  [Biomes.WATER]: "Shallow Water",
  [Biomes.DEEP_WATER]: "Deep Water",
};

export const CONTOUR_INTERVALS = [0.08, 0.2, 0.5, 0.7, 0.95];

export const generate = (x: number, y: number) => {
  const nx = x / TILE_RADIUS / 64;
  const ny = y / TILE_RADIUS / 64;
  const mnx = nx * MOISTURE_FREQUENCY;
  const mny = ny * MOISTURE_FREQUENCY;
  const ret: any = {};

  let moisture =
    1 * moistureNoise(nx, ny) +
    0.5 * moistureNoise(4 * nx, 4 * ny) +
    0.25 * moistureNoise(8 * nx, 8 * ny) +
    0.12 * moistureNoise(16 * nx, 16 * ny);
  // map from [-1, 1] to [0, 1]
  moisture = (moisture + 1) / 2;
  ret.moisture = moisture;

  let elevation =
    1 * elevationNoise(mnx, mny) +
    0.5 * elevationNoise(4 * mnx, 4 * mny) +
    0.25 * elevationNoise(8 * mnx, 8 * mny) +
    0.12 * elevationNoise(16 * mnx, 16 * mny);
  // map from [-1, 1] to [0, 1]
  elevation = (elevation + 1) / 2;

  // redistribution
  elevation = Math.pow(elevation * FUDGE_FACTOR, EXPONENT);
  elevation /= FUDGE_FACTOR ** EXPONENT;

  ret.elevation = elevation;

  if (elevation < CONTOUR_INTERVALS[0]) {
    ret.type = Biomes.DEEP_WATER;
  } else if (elevation < CONTOUR_INTERVALS[1]) {
    ret.type = Biomes.WATER;
  } else if (elevation < CONTOUR_INTERVALS[2]) {
    if (ret.moisture < 0.16) {
      ret.type = Biomes.DESERT;
    } else if (ret.moisture < 0.6) {
      ret.type = Biomes.GRASS;
    } else {
      ret.type = Biomes.FOREST;
    }
  } else if (elevation < CONTOUR_INTERVALS[3]) {
    if (ret.moisture < 0.16) {
      ret.type = Biomes.DUNE;
    } else if (ret.moisture < 0.5) {
      ret.type = Biomes.GRASS;
    } else if (ret.moisture < 0.8) {
      ret.type = Biomes.MIXED_FOREST;
    } else {
      ret.type = Biomes.NEEDLE_LEAF_FOREST;
    }
  } else if (elevation < CONTOUR_INTERVALS[4]) {
    if (ret.moisture < 0.33) {
      ret.type = Biomes.ROCK;
    } else if (ret.moisture < 0.66) {
      ret.type = Biomes.SHRUBLAND;
    } else {
      ret.type = Biomes.ALPINE_FOREST;
    }
  } else {
    ret.type = Biomes.SNOW;
  }

  ret.color = BiomeColors[ret.type];

  return ret as {
    type: Biomes;
    moisture: number;
    elevation: number;
    color: number;
  };
};

export const normalizeMoisture = (moisture: number) => 100 * moisture;
export const normalizeElevation = (elevation: number) => {
  if (elevation < CONTOUR_INTERVALS[1]) return -2000 * (0.3 - elevation);
  else
    return (
      (3000 * (elevation - CONTOUR_INTERVALS[1])) / (1 - CONTOUR_INTERVALS[1])
    );
};
