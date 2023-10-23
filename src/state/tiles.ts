import { createSlice } from "@reduxjs/toolkit";
import { generate } from "libs/biome";
import { hexagonalToCartesian, serialize } from "libs/coordinates";

interface TileData {
  type: number;
  moisture: number;
  elevation: number;
  color: number;
}

export interface TilesState {
  tiles: Record<string, TileData>;
  selected?: string;
}

const initialState: TilesState = {
  tiles: {},
  selected: undefined,
};

export const tilesSlice = createSlice({
  name: "tiles",
  initialState,
  reducers: {
    select: (state, action) => {
      state.selected = action.payload;
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

export const { select, generateChunk } = tilesSlice.actions;

export default tilesSlice.reducer;
