declare type Resources = string;
declare type Buildings = string;
interface TileData {
  type: number;
  humidity: number;
  elevation: number;
  color: number;
  rarity: number;
}

interface TileCoordinate {
  q: number;
  r: number;
}

interface OwnedTileData extends TileData, TileCoordinate {
  resources: Record<Resources, number>;
  buildings: Record<Buildings, number>;
}
