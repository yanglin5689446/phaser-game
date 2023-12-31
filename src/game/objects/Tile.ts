import { Biomes } from "libs/biome";
import { TILE_RADIUS, hexagonalToCartesian } from "libs/coordinates";
import { store } from "state";
import { serialize } from "libs/coordinates";

class Tile extends Phaser.GameObjects.Container {
  r: number;
  q: number;
  interactionArea;
  focused: boolean;
  isOwned: boolean;
  biomeInfo: {
    type: Biomes;
    elevation: number;
    humidity: number;
    color: number;
  };

  static BORDER_SIZE = 8;

  constructor(scene, q, r, offset) {
    const coordinate = hexagonalToCartesian(q, r);
    super(scene, coordinate.x - offset.x, coordinate.y - offset.y, [
      new Phaser.GameObjects.Graphics(scene),
    ]);
    scene.add.existing(this);
    this.q = q;
    this.r = r;

    const state = store.getState();
    this.biomeInfo = state.map.tiles[serialize(q, r)];
    this.focused = false;

    this.initialize();
  }

  initialize() {
    const children = this.getAll();
    const base = children[0] as Phaser.GameObjects.Graphics;
    // @ts-expect-error
    const interactionArea = new Phaser.Geom.rexHexagon(
      0,
      0,
      TILE_RADIUS - Tile.BORDER_SIZE / 4,
      1
    );
    this.interactionArea = interactionArea;
    // set hit area
    base
      .setInteractive(interactionArea, Phaser.Geom.Polygon.Contains)
      .on("pointerover", (pointer, gameObject) => {
        this.focused = true;
        this.render();
      })
      .on("pointerout", (pointer, gameObject) => {
        this.focused = false;
        this.render();
      });
    this.render();
  }

  render() {
    const children = this.getAll();
    const base = children[0] as Phaser.GameObjects.Graphics;

    const state = store.getState();
    const { ownedTiles } = state.player;
    const isOwned = ownedTiles.find(
      (tile) => tile.q === this.q && tile.r === this.r
    );
    base.clear();
    base
      .fillStyle(this.biomeInfo?.color)
      .fillPoints(this.interactionArea.points, true);
    // @todo: better way to portrait the owner ship of the tile
    base
      .lineStyle(
        Tile.BORDER_SIZE * (isOwned ? 2 : 1),
        isOwned ? 0xef5350 : 0xcccccc
      )
      .strokePoints([
        ...this.interactionArea.points,
        this.interactionArea.points[0],
        this.interactionArea.points[1],
      ]);

    if (isOwned) this.setDepth(1);
  }

  preUpdate() {}

  distance(target: Tile) {
    return (
      (Math.abs(this.q - target.q) +
        Math.abs(this.q + this.r - target.q - target.r) +
        Math.abs(this.r - target.r)) /
      2
    );
  }
}

export default Tile;
