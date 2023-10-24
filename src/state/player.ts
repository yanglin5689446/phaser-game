import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setOwnedTiles } = playerSlice.actions;

export default playerSlice.reducer;
