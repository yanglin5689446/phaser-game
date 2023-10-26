import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { TILE_RADIUS } from "./coordinates";
import { Resources } from "constants/resources";

const HUMIDITY_SEED = "HUMIDITY_SEED";
const HEIGHT_SEED = "HEIGHT_SEED";
const RARITY_SEED = "RARITY_SEED";
const HUMIDITY_FREQUENCY = 0.6;
const FUDGE_FACTOR = 1.2;
const EXPONENT = 1.6;

export const humidityNoise = createNoise2D(alea(HUMIDITY_SEED));
export const elevationNoise = createNoise2D(alea(HEIGHT_SEED));
export const rarityNoise = createNoise2D(alea(RARITY_SEED));

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

export const BiomeResourceFactors: Record<Biomes, Record<Resources, number>> = {
  [Biomes.DESERT]: {
    [Resources.LUMBER]: 1,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 1,
  },
  [Biomes.DUNE]: {
    [Resources.LUMBER]: 1,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 1,
  },
  [Biomes.ROCK]: {
    [Resources.LUMBER]: 1,
    [Resources.STONE]: 1.5,
    [Resources.MINERALS]: 1.5,
  },
  [Biomes.GRASS]: {
    [Resources.LUMBER]: 1,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.SHRUBLAND]: {
    [Resources.LUMBER]: 2,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.FOREST]: {
    [Resources.LUMBER]: 2,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.MIXED_FOREST]: {
    [Resources.LUMBER]: 2,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.NEEDLE_LEAF_FOREST]: {
    [Resources.LUMBER]: 2,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.ALPINE_FOREST]: {
    [Resources.LUMBER]: 2,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 0,
  },
  [Biomes.SNOW]: {
    [Resources.LUMBER]: 0.5,
    [Resources.STONE]: 1,
    [Resources.MINERALS]: 2,
  },
  [Biomes.WATER]: {
    [Resources.LUMBER]: 0,
    [Resources.STONE]: 0,
    [Resources.MINERALS]: 0,
  },
  [Biomes.DEEP_WATER]: {
    [Resources.LUMBER]: 0,
    [Resources.STONE]: 0,
    [Resources.MINERALS]: 0,
  },
};

export const BiomeColors: Record<Biomes, number> = {
  [Biomes.DESERT]: 0xfff9c4,
  [Biomes.DUNE]: 0xffd687,
  [Biomes.ROCK]: 0x9e9e9e,
  [Biomes.GRASS]: 0x8bba31,
  [Biomes.SHRUBLAND]: 0x9e9d24,
  [Biomes.FOREST]: 0x00aa26,
  [Biomes.MIXED_FOREST]: 0x377657,
  [Biomes.NEEDLE_LEAF_FOREST]: 0x4c6a41,
  [Biomes.ALPINE_FOREST]: 0x4c6a41,
  [Biomes.SNOW]: 0xe3e3e3,
  [Biomes.WATER]: 0x64b5f6,
  [Biomes.DEEP_WATER]: 0x3f51b5,
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

export const CONTOUR_INTERVALS = [0.05, 0.2, 0.5, 0.7, 0.95];

export const generate = (x: number, y: number) => {
  const nx = x / TILE_RADIUS / 32;
  const ny = y / TILE_RADIUS / 32;
  const mnx = nx * HUMIDITY_FREQUENCY;
  const mny = ny * HUMIDITY_FREQUENCY;
  const ret: any = {};

  let humidity =
    1 * humidityNoise(nx, ny) +
    0.5 * humidityNoise(4 * nx, 4 * ny) +
    0.25 * humidityNoise(8 * nx, 8 * ny) +
    0.12 * humidityNoise(16 * nx, 16 * ny);
  // map from [-1, 1] to [0, 1]
  humidity = (humidity + 1) / 2;
  ret.humidity = humidity;

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

  let rarity =
    1 * rarityNoise(mnx, mny) +
    0.5 * rarityNoise(4 * mnx, 4 * mny) +
    0.25 * rarityNoise(8 * mnx, 8 * mny) +
    0.12 * rarityNoise(16 * mnx, 16 * mny);
  // map from [-1, 1] to [0, 1]
  rarity = (rarity + 1) / 2;

  ret.rarity = rarity;

  if (elevation < CONTOUR_INTERVALS[0]) {
    ret.type = Biomes.DEEP_WATER;
  } else if (elevation < CONTOUR_INTERVALS[1]) {
    ret.type = Biomes.WATER;
  } else if (elevation < CONTOUR_INTERVALS[2]) {
    if (ret.humidity < 0.16) {
      ret.type = Biomes.DESERT;
    } else if (ret.humidity < 0.6) {
      ret.type = Biomes.GRASS;
    } else {
      ret.type = Biomes.FOREST;
    }
  } else if (elevation < CONTOUR_INTERVALS[3]) {
    if (ret.humidity < 0.16) {
      ret.type = Biomes.DUNE;
    } else if (ret.humidity < 0.5) {
      ret.type = Biomes.GRASS;
    } else if (ret.humidity < 0.8) {
      ret.type = Biomes.MIXED_FOREST;
    } else {
      ret.type = Biomes.NEEDLE_LEAF_FOREST;
    }
  } else if (elevation < CONTOUR_INTERVALS[4]) {
    if (ret.humidity < 0.33) {
      ret.type = Biomes.ROCK;
    } else if (ret.humidity < 0.66) {
      ret.type = Biomes.SHRUBLAND;
    } else {
      ret.type = Biomes.ALPINE_FOREST;
    }
  } else {
    ret.type = Biomes.SNOW;
  }

  ret.color = BiomeColors[ret.type];

  return ret as TileData;
};

export const normalizeHumidity = (humidity: number) => 100 * humidity;
export const normalizeElevation = (elevation: number) => {
  if (elevation < CONTOUR_INTERVALS[1]) return -2000 * (0.3 - elevation);
  else
    return (
      (3000 * (elevation - CONTOUR_INTERVALS[1])) / (1 - CONTOUR_INTERVALS[1])
    );
};
