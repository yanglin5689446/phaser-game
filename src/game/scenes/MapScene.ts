import Tile from "../objects/Tile";
import { setCenter } from "state/map";
import { store } from "state";
import {
  cartesianToHexagonal,
  hexagonalToCartesian,
  serialize,
} from "libs/coordinates";
import { setOwnedTiles } from "state/player";
import initOwnedTile from "libs/initOwnedTile";
import { Buildings } from "constants/buildings";
import { calculateProduction } from "libs/buildings";
import { Resources } from "constants/resources";

const ZOOM_LEVEL_MIN = 0.25;
const ZOOM_LEVEL_MAX = 1.5;

export default class MapScene extends Phaser.Scene {
  tiles: Record<string, Tile>;
  cameraOffset;
  state;

  constructor() {
    super({ key: "MapScene" });
    this.tiles = {};
  }

  preload() {
    // generate random starting point
    // @todo: use real generator for each playser
    const state = store.getState();
    const { q, r } = state.map.center || { q: 0, r: 0 };
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
    const { origin } = this.state;
    const camera = this.initCamera(origin);

    let dragging = false;
    let previousKey;
    let timestamp;

    const updateCenter = () => {
      const state = store.getState();
      const { center, jump, select } = state.map;
      if (!center) return;
      const centerKey = serialize(center.q, center.r);

      if (centerKey !== previousKey) {
        const { x, y } = hexagonalToCartesian(center.q, center.r);
        this.loadTiles(center.q, center.r);
        if (jump) {
          camera.scrollX = x - this.cameraOffset.x;
          camera.scrollY = y - this.cameraOffset.y;
        }
        if (select) {
          camera.zoom = ZOOM_LEVEL_MAX;
        }
        previousKey = centerKey;
      }
    };
    store.subscribe(updateCenter);
    updateCenter();

    // load first tile
    // @todo: connect real API
    let record;
    try {
      record = JSON.parse(localStorage.getItem("record") || "");
    } catch (e) {
      record = undefined;
    }
    const ownedTiles = record ? record.ownedTiles : [initOwnedTile(origin)];
    timestamp = record ? record.timestamp : Date.now();
    store.dispatch(setOwnedTiles(ownedTiles));

    // calculate yield based on time delta
    const calculateResourcesYield = () => {
      const state = store.getState();
      const now = Date.now();
      const delta = now - timestamp;
      const { ownedTiles } = state.player;
      const updated = ownedTiles.map((tile) => {
        const yields = [Buildings.LUMBER_MILL, Buildings.QUARRY].map(
          (building) =>
            (delta / 3600_000) *
            calculateProduction(building, tile.buildings[building])
        );
        const caps = [Buildings.LUMBER_STORAGE, Buildings.STONE_STORAGE].map(
          (building) => calculateProduction(building, tile.buildings[building])
        );
        return {
          ...tile,
          resources: {
            [Resources.LUMBER]: Math.min(
              tile.resources[Resources.LUMBER] + yields[0],
              caps[0]
            ),
            [Resources.STONE]: Math.min(
              tile.resources[Resources.STONE] + yields[1],
              caps[1]
            ),
            [Resources.MINERALS]: tile.resources[Resources.MINERALS],
          },
        };
      });
      timestamp = now;
      localStorage.setItem("record", JSON.stringify({ timestamp, ownedTiles }));
      store.dispatch(setOwnedTiles(updated));
    };

    this.time.addEvent({
      delay: 1000,
      callback: calculateResourcesYield,
      callbackScope: this,
      loop: true,
    });

    // Move camera on drag, load tiles when tiles are in viewport
    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) {
        dragging = false;

        return;
      } else {
        dragging = true;

        const viwerX = this.cameraOffset.x + camera.scrollX;
        const viwerY = this.cameraOffset.y + camera.scrollY;

        const { q, r } = cartesianToHexagonal(viwerX, viwerY);
        const key = serialize(q, r);
        if (previousKey !== key) {
          store.dispatch(setCenter({ q, r }));
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
        this.cameraOffset.x +
        (pointer.x - camera.centerX) / camera.zoom +
        camera.scrollX;
      const viwerY =
        this.cameraOffset.y +
        (pointer.y - camera.centerY) / camera.zoom +
        camera.scrollY;

      const { q, r } = cartesianToHexagonal(viwerX, viwerY);
      this.spotlightOn(q, r);
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

  private loadTiles(sq: number, sr: number) {
    const state = store.getState();
    const N = state.map.chunkSize;
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

  private initCamera(origin) {
    const camera = this.cameras.main;

    this.cameraOffset = {
      x: origin.offset.x + camera.width / 2,
      y: origin.offset.y + camera.height / 2,
    };
    camera.zoom = ZOOM_LEVEL_MIN;

    camera.scrollX = camera.width / 2;
    camera.scrollY = camera.height / 2;

    return camera;
  }

  private spotlightOn(q, r) {
    const camera = this.cameras.main;
    this.loadTiles(q, r);

    const { x, y } = hexagonalToCartesian(q, r);

    const duration =
      200 +
      ((ZOOM_LEVEL_MAX - camera.zoom) / (ZOOM_LEVEL_MAX - ZOOM_LEVEL_MIN)) *
        500;

    // Pan (or move) the camera to the specified position
    this.tweens.add({
      targets: camera,
      scrollX: x - this.cameraOffset.x,
      scrollY: y - this.cameraOffset.y,
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

    setTimeout(
      () => store.dispatch(setCenter({ q, r, select: true })),
      duration - 100
    );
  }
}
