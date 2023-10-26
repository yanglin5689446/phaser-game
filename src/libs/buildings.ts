import { Resources } from "constants/resources";
import {
  COSTS_BASE,
  BASE_PRODUCTION,
  COST_FACTORS,
  PRODUCTION_FACTORS,
  PRODUCTION_MIN,
} from "constants/buildings";

export const calculateCost = (building: Buildings, level: number) => {
  return {
    [Resources.LUMBER]:
      COSTS_BASE[building][Resources.LUMBER] *
      Math.pow(COST_FACTORS[building], level),
    [Resources.STONE]:
      COSTS_BASE[building][Resources.STONE] *
      Math.pow(COST_FACTORS[building], level),
  };
};

export const calculateProduction = (building: Buildings, level: number) => {
  return (
    PRODUCTION_MIN[building] +
    BASE_PRODUCTION[building] *
      (level > 0
        ? level * Math.pow(PRODUCTION_FACTORS[building], level - 1)
        : 0)
  );
};
