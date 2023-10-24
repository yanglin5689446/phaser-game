import { SceneKeys } from "constants/scenes";
import { store } from "state";
import { goto } from "state/scene";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.once("complete", () => store.dispatch(goto(SceneKeys.REGISTER)));
    this.load.start();
  }

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
