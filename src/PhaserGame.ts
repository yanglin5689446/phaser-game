import "phaser";
import HexagonPlugin from "phaser3-rex-plugins/plugins/hexagon-plugin.js";
import PreloadScene from "./game/scenes/PreloadScene";
import MapScene from "./game/scenes/MapScene";

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
  scene: [PreloadScene, MapScene],
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
