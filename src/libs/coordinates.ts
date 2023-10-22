export const TILE_RADIUS = 200;

export const serialize = (q: number, r: number) => `key_${q}_${r}`;

export const deserialize = (key: string) =>
  key
    .split("_")
    .slice(1)
    .map((n) => +n);

export const hexagonalToCartesian = (
  q: number,
  r: number,
  radius = TILE_RADIUS
) => {
  const qVector = { x: Math.cos(Math.PI / 6), y: 0 };
  const rVector = { x: Math.cos(Math.PI / 6) / 2, y: 3 / 4 };
  return {
    x: 2 * TILE_RADIUS * (r * rVector.x + q * qVector.x),
    y: 2 * TILE_RADIUS * (r * rVector.y + q * qVector.y),
  };
};

export const cartesianToHexagonal = (x: number, y: number) => {
  const xVector = { q: 3 / 4, r: 0 };
  const yVector = { q: -Math.cos(Math.PI / 6) / 2, r: Math.cos(Math.PI / 6) };
  const det = (3 / 4) * Math.cos(Math.PI / 6);

  const q = Math.round(
    (x * xVector.q + y * yVector.q) / det / (2 * TILE_RADIUS)
  );
  const r = Math.round(
    (x * xVector.r + y * yVector.r) / det / (2 * TILE_RADIUS)
  );

  return { q, r };
};
