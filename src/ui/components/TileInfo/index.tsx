import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useAppSelector } from "state";
import {
  BiomeNames,
  Biomes,
  normalizeElevation,
  normalizeHumidity,
} from "libs/biome";
import { serialize } from "libs/coordinates";
import ResourceFactors from "./ResourceFactors";
import BuildingsPanel from "./BuildingsPanel";

const TileInfo = () => {
  const { center, select, tiles } = useAppSelector((state) => state.map);
  const { ownedTiles } = useAppSelector((state) => state.player);

  const ownedTile = ownedTiles.find(
    (tile) => tile.q === center?.q && tile.r === center.r
  );
  const tile =
    ownedTile || (center ? tiles[serialize(center.q, center.r)] : null);

  const biome = tile?.type as Biomes;

  return (
    <Box
      position="absolute"
      top={10}
      left={10}
      opacity={!!select ? 1 : 0}
      transition=".2s opacity"
      pointerEvents="auto"
    >
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} px={8} py={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {BiomeNames[biome]}
        </Text>
        <UnorderedList fontSize="lg" pt={3}>
          <ListItem>
            Coordinate: ({center?.q}, {center?.r})
          </ListItem>
          <ListItem>
            Elevation: {normalizeElevation(tile?.elevation || 0).toFixed(2)}m
          </ListItem>
          <ListItem>
            Humidity: {normalizeHumidity(tile?.humidity || 0).toFixed(1)}%
          </ListItem>
        </UnorderedList>
      </Box>
      <ResourceFactors biome={biome} />
      <BuildingsPanel tile={ownedTile} />
    </Box>
  );
};

export default TileInfo;
