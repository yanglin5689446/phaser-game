import lumberMill from "assets/images/lumber_mill.png";
import quarry from "assets/images/querry.png";
import lumberStorage from "assets/images/lumber_storage.png";
import stoneStorage from "assets/images/stone_storage.png";
import { Resources } from "./resources";

export enum Buildings {
  LUMBER_MILL = "LUMBER_MILL",
  QUARRY = "QUARRY",
  LUMBER_STORAGE = "LUMBER_STORAGE",
  STONE_STORAGE = "STONE_STORAGE",
}

export const BUILDING_IMAGE_MAP = {
  [Buildings.LUMBER_MILL]: lumberMill,
  [Buildings.QUARRY]: quarry,
  [Buildings.LUMBER_STORAGE]: lumberStorage,
  [Buildings.STONE_STORAGE]: stoneStorage,
};

export const COSTS_BASE = {
  [Buildings.LUMBER_MILL]: {
    [Resources.LUMBER]: 60,
    [Resources.STONE]: 15,
  },
  [Buildings.QUARRY]: {
    [Resources.LUMBER]: 48,
    [Resources.STONE]: 24,
  },
  [Buildings.LUMBER_STORAGE]: {
    [Resources.LUMBER]: 1000,
    [Resources.STONE]: 500,
  },
  [Buildings.STONE_STORAGE]: {
    [Resources.LUMBER]: 1500,
    [Resources.STONE]: 500,
  },
};

export const COST_FACTORS = {
  [Buildings.LUMBER_MILL]: 1.5,
  [Buildings.QUARRY]: 1.6,
  [Buildings.LUMBER_STORAGE]: 2,
  [Buildings.STONE_STORAGE]: 2,
};

export const BASE_PRODUCTION = {
  [Buildings.LUMBER_MILL]: 30,
  [Buildings.QUARRY]: 20,
  [Buildings.LUMBER_STORAGE]: 5000,
  [Buildings.STONE_STORAGE]: 5000,
};

export const PRODUCTION_FACTORS = {
  [Buildings.LUMBER_MILL]: 1.1,
  [Buildings.QUARRY]: 1.1,
  [Buildings.LUMBER_STORAGE]: 1.6,
  [Buildings.STONE_STORAGE]: 1.6,
};

export const PRODUCTION_MIN = {
  [Buildings.LUMBER_MILL]: 0,
  [Buildings.QUARRY]: 0,
  [Buildings.LUMBER_STORAGE]: 10000,
  [Buildings.STONE_STORAGE]: 10000,
};
