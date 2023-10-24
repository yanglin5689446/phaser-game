interface TileData {
  type: number;
  humidity: number;
  elevation: number;
  color: number;
  rarity: number;
}

interface OwnedTileData extends TileData {
  q: number;
  r: number;
  resources: {
    timber: number;
    rocks: number;
    minerals: number;
  };
}
