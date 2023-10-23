import Tile from "../objects/Tile";
import { generateChunk, select, setCenter } from "state/map";
import { store } from "state";
import {
  cartesianToHexagonal,
  hexagonalToCartesian,
  serialize,
} from "libs/coordinates";

const ZOOM_LEVEL_MIN = 0.25;
const ZOOM_LEVEL_MAX = 1.5;

const CHUNK_SIZE = 32;

export default class MapScene extends Phaser.Scene {
  tiles: Record<string, Tile>;
  state;

  constructor() {
    super({ key: "MapScene" });
    this.tiles = {};
  }

  preload() {
    // generate random starting point
    // @todo: use real generator for each playser
    const state = store.getState();
    const { q, r } = state.player.origin;
    const { x, y } = hexagonalToCartesian(q, r);
    this.state = {
      origin: {
        q,
        r,
        offset: {
          x,
          y,
        },
      },
    };
  }

  create() {
    const camera = this.initCamera();
    const { origin } = this.state;
    this.loadTiles(origin.q, origin.r);
    store.dispatch(setCenter(serialize(origin.q, origin.r)));

    let dragging = false;
    let previousKey;

    const cameraOffset = {
      x: this.state.origin.offset.x + camera.width / 2,
      y: this.state.origin.offset.y + camera.height / 2,
    };

    // Move camera on drag, load tiles when tiles are in viewport
    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) {
        dragging = false;

        return;
      } else {
        dragging = true;

        // reset selected
        const { map } = store.getState();
        if (map.selected) store.dispatch(select(undefined));

        const viwerX = cameraOffset.x + camera.scrollX;
        const viwerY = cameraOffset.y + camera.scrollY;

        const { q, r } = cartesianToHexagonal(viwerX, viwerY);
        const key = serialize(q, r);
        if (previousKey !== key) {
          store.dispatch(setCenter(key));
          this.loadTiles(q, r);
        }
        previousKey = key;

        camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
        camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
      }
    });

    // Register mouse click events
    this.input.on("pointerup", (pointer) => {
      if (dragging) return;

      const viwerX =
        cameraOffset.x +
        (pointer.x - camera.centerX) / camera.zoom +
        camera.scrollX;
      const viwerY =
        cameraOffset.y +
        (pointer.y - camera.centerY) / camera.zoom +
        camera.scrollY;

      const { q, r } = cartesianToHexagonal(viwerX, viwerY);
      const { x, y } = hexagonalToCartesian(q, r);
      this.loadTiles(q, r);

      const duration =
        200 +
        ((ZOOM_LEVEL_MAX - camera.zoom) / (ZOOM_LEVEL_MAX - ZOOM_LEVEL_MIN)) *
          500;

      // Pan (or move) the camera to the specified position
      this.tweens.add({
        targets: camera,
        scrollX: x - cameraOffset.x,
        scrollY: y - cameraOffset.y,
        duration: duration,
        ease: "Sine.easeInOut",
      });

      // Zoom the camera to the specified zoom level
      this.tweens.add({
        targets: camera,
        zoom: ZOOM_LEVEL_MAX,
        duration,
        ease: "Sine.easeInOut",
      });

      setTimeout(() => store.dispatch(select(serialize(q, r))), duration - 100);
    });

    // Register mouse wheel events
    this.input.on("wheel", (pointer, gameObject, dx, dy, dz) => {
      // Adjust the camera zoom based on mouse wheel input
      camera.zoom += dy * 0.005;

      // Clamp the zoom level within desired bounds
      camera.zoom = Phaser.Math.Clamp(
        camera.zoom,
        ZOOM_LEVEL_MIN,
        ZOOM_LEVEL_MAX
      ); // Adjust min and max zoom levels as needed
    });
  }

  update() {}

  private loadTiles(sq: number, sr: number, N = CHUNK_SIZE) {
    store.dispatch(generateChunk({ q: sq, r: sr, n: N }));

    // load cells in range N
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        const key = serialize(sq + q, sr + r);
        if (!this.tiles[key])
          this.tiles[key] = new Tile(
            this,
            sq + q,
            sr + r,
            this.state.origin.offset
          );
      }
    }

    const center = this.tiles[serialize(sq, sr)];

    // check visibility of all cells in pool
    // if distance > 2 * N, destroy the object to save memory
    Object.values(this.tiles).forEach((tile) => {
      if (center.distance(tile) <= N) {
        tile.setActive(true).setVisible(true);
      } else if (center.distance(tile) <= 2 * N) {
        tile.destroy();
        delete this.tiles[serialize(tile.q, tile.r)];
      } else {
        tile.setActive(false).setVisible(false);
      }
    });
  }

  private initCamera() {
    const camera = this.cameras.main;
    camera.zoom = ZOOM_LEVEL_MIN;

    camera.scrollX = camera.width / 2;
    camera.scrollY = camera.height / 2;

    return camera;
  }
}
