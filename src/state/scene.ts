import { createSlice } from "@reduxjs/toolkit";
import { SceneKeys } from "constants/scenes";

const initialState: {
  current: SceneKeys;
  previous?: SceneKeys;
} = {
  current: SceneKeys.LOADING,
  previous: undefined,
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    goto: (state, action) => {
      state.previous = state.current;
      state.current = action.payload;
    },
    back(state) {
      if (!state.previous) return;
      const current = state.current;
      state.current = state.previous;
      state.previous = current;
    },
  },
});

export const { goto, back } = sceneSlice.actions;

export default sceneSlice.reducer;
