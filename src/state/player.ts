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
      const { index, building } = action.payload;
      const ownedTile = state.ownedTiles[index];
      const level = ownedTile.buildings[building];
      const costs = calculateCost(building, level);
      if (
        Object.entries(costs).every(
          ([key, value]) => value <= ownedTile.resources[key]
        )
      ) {
        Object.entries(costs).forEach(
          ([key, value]) => (ownedTile.resources[key] -= value)
        );
        ownedTile.buildings[building]++;
      }
    },
  },
});

export const { setOwnedTiles, upgradeBuilding } = playerSlice.actions;

export default playerSlice.reducer;
