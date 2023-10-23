import { configureStore } from "@reduxjs/toolkit";
import player from "./player";
import tiles from "./tiles";
import scene from "./scene";

export const store = configureStore({
  reducer: {
    player,
    tiles,
    scene,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
