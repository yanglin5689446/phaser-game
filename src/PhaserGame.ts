import "phaser";
import HexagonPlugin from "phaser3-rex-plugins/plugins/hexagon-plugin.js";
import MainScene from "./game/scenes/MainScene";
import PreloadScene from "./game/scenes/PreloadScene";

const DEFAULT_WIDTH = window.innerWidth;
const DEFAULT_HEIGHT = window.innerHeight;

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  plugins: {
    global: [
      {
        key: "rexHexagon",
        plugin: HexagonPlugin,
        start: true,
      },
    ],
  },
};

export default new Phaser.Game(config);
