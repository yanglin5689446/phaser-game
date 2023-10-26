import { createSlice } from "@reduxjs/toolkit";
import { generate } from "libs/biome";
import { hexagonalToCartesian, serialize } from "libs/coordinates";

const CHUNK_SIZE = 32;
export interface Mapstate {
  chunkSize: number;
  tiles: Record<string, TileData>;
  center?: {
    q: number;
    r: number;
  };
  // quick jump flag
  jump?: boolean;
  // select flag
  select?: boolean;
}

const initialState: Mapstate = {
  chunkSize: CHUNK_SIZE,
  tiles: {},
  center: undefined,
  jump: false,
  select: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action) => {
      const { q, r, jump, select } = action.payload;
      state.center = { q, r };
      state.jump = !!jump;
      state.select = !!select;
      if (!state.center) return;
      const { chunkSize } = state;
      for (let qi = -chunkSize; qi <= chunkSize; qi++) {
        for (
          let ri = Math.max(-chunkSize, -qi - chunkSize);
          ri <= Math.min(chunkSize, -qi + chunkSize);
          ri++
        ) {
          const key = serialize(q + qi, r + ri);

          if (!state.tiles[key]) {
            const { x, y } = hexagonalToCartesian(q + qi, r + ri);
            state.tiles[key] = generate(x, y);
          }
        }
      }
    },
  },
});

export const { setCenter } = mapSlice.actions;

export default mapSlice.reducer;
