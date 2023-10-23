import { createSlice } from "@reduxjs/toolkit";
import { generate } from "libs/biome";
import { hexagonalToCartesian, serialize } from "libs/coordinates";
export interface Mapstate {
  tiles: Record<string, TileData>;
  selected?: string;
  center?: string;
}

const initialState: Mapstate = {
  tiles: {},
  selected: undefined,
  center: undefined,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    select: (state, action) => {
      state.selected = action.payload;
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    generateChunk(state, action) {
      const { q: sq, r: sr, n } = action.payload;
      for (let q = -n; q <= n; q++) {
        for (let r = Math.max(-n, -q - n); r <= Math.min(n, -q + n); r++) {
          const key = serialize(sq + q, sr + r);

          if (!state.tiles[key]) {
            const { x, y } = hexagonalToCartesian(sq + q, sq + r);
            state.tiles[key] = generate(x, y);
          }
        }
      }
    },
  },
});

export const { select, generateChunk, setCenter } = mapSlice.actions;

export default mapSlice.reducer;
