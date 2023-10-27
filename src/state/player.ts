import { createSlice } from "@reduxjs/toolkit";
import { calculateCost } from "libs/buildings";

const initialState: {
  ownedTiles: Array<OwnedTileData>;
} = {
  ownedTiles: [],
};

export const playerSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setOwnedTiles: (state, action) => {
      state.ownedTiles = action.payload;
    },
    upgradeBuilding: (state, action) => {
      const { coordinate, building } = action.payload;
      const tile = state.ownedTiles.find(
        (tile) => tile.q === coordinate.q && tile.r === coordinate.r
      );
      if (!tile) return;
      const level = tile.buildings[building];
      const costs = calculateCost(building, level);
      if (
        Object.entries(costs).every(
          ([key, value]) => value <= tile.resources[key]
        )
      ) {
        Object.entries(costs).forEach(
          ([key, value]) => (tile.resources[key] -= value)
        );
        tile.buildings[building]++;
      }
    },
  },
});

export const { setOwnedTiles, upgradeBuilding } = playerSlice.actions;

export default playerSlice.reducer;
