import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useAppSelector } from "state";
import { deserialize } from "libs/coordinates";
import {
  BiomeNames,
  Biomes,
  normalizeElevation,
  normalizeHumidity,
} from "libs/biome";

const TileInfo = () => {
  const { selected, tiles } = useAppSelector((state) => state.map);
  const tile = selected ? tiles[selected] : null;
  const [q, r] = selected ? deserialize(selected) : [0, 0];
  return !!selected ? (
    <Box
      position="absolute"
      top={10}
      left={10}
      bg="rgba(255, 255, 255, 0.8)"
      p={10}
      borderRadius={8}
    >
      <Text fontSize="2xl" fontWeight="bold">
        {BiomeNames[tile?.type as Biomes]}
      </Text>
      <UnorderedList fontSize="lg" pt={3}>
        <ListItem>
          Coordinate: ({r}, {q})
        </ListItem>
        <ListItem>
          Elevation: {normalizeElevation(tile?.elevation || 0).toFixed(2)}m
        </ListItem>
        <ListItem>
          Humidity: {normalizeHumidity(tile?.humidity || 0).toFixed(1)}%
        </ListItem>
      </UnorderedList>
    </Box>
  ) : null;
};

export default TileInfo;
