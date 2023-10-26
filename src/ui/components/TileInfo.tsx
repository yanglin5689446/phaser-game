import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useAppSelector } from "state";
import {
  BiomeNames,
  Biomes,
  normalizeElevation,
  normalizeHumidity,
} from "libs/biome";
import { serialize } from "libs/coordinates";

const TileInfo = () => {
  const { center, select, tiles } = useAppSelector((state) => state.map);
  const tile = center ? tiles[serialize(center.q, center.r)] : null;
  return (
    <Box
      position="absolute"
      top={10}
      left={10}
      opacity={!!select ? 1 : 0}
      transition=".2s opacity"
    >
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} p={8}>
        <Text fontSize="2xl" fontWeight="bold">
          {BiomeNames[tile?.type as Biomes]}
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
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} p={8} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Resources
        </Text>
        <UnorderedList fontSize="lg" pt={3}>
          <ListItem>{tile?.rarity}</ListItem>
        </UnorderedList>
      </Box>
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} p={8} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Buildings
        </Text>
      </Box>
    </Box>
  );
};

export default TileInfo;
