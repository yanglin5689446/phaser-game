import { store } from "state";
import { serialize } from "./coordinates";
import { Resources } from "constants/resources";
import { Buildings } from "constants/buildings";

const initOwnedTile = ({ q, r }: TileCoordinate) => {
  const map = store.getState().map;
  const key = serialize(q, r);
  const tile = map.tiles[key];

  return {
    q,
    r,
    ...tile,
    resources: {
      [Resources.LUMBER]: 1000,
      [Resources.STONE]: 500,
      [Resources.MINERALS]: 0,
    },
    buildings: {
      [Buildings.LUMBER_MILL]: 0,
      [Buildings.QUARRY]: 0,
      [Buildings.LUMBER_STORAGE]: 0,
      [Buildings.STONE_STORAGE]: 0,
    },
  };
};

export default initOwnedTile;
