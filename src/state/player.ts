import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  origin: {
    q: number;
    r: number;
  };
} = {
  origin: {
    q: NaN,
    r: NaN,
  },
};

export const playerSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
  },
});

export const { setOrigin } = playerSlice.actions;

export default playerSlice.reducer;
