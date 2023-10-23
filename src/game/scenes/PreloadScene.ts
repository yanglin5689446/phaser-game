import { SceneKeys } from "constants/scenes";
import { store } from "state";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {}

  create() {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.scene.current === SceneKeys.MAP) {
        unsubscribe();
        this.scene.start("MapScene");
      }
    });
  }
}
