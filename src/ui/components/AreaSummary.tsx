import { Box, List, ListItem, Text } from "@chakra-ui/react";
import { useAppSelector } from "state";
import { deserialize } from "libs/coordinates";
import { BiomeColors, BiomeNames } from "libs/biome";
import { useMemo } from "react";
import { serialize } from "libs/coordinates";

const AreaSummary = () => {
  const { selected, center, tiles } = useAppSelector((state) => state.map);
  const [cq, cr] = center ? deserialize(center) : [0, 0];

  const composition = useMemo(() => {
    if (!center) return {};
    const N = 32;
    let count = 0;
    const result = {};
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        const key = serialize(cq + q, cr + r);
        const biome = tiles[key].type;
        if (!result[biome]) result[biome] = 1;
        else result[biome]++;
        count++;
      }
    }
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        ((value as number) / count) * 100,
      ])
    );
  }, [center, cq, cr, tiles]);

  return (
    <Box
      position="absolute"
      top={10}
      right={10}
      bg="rgba(255, 255, 255, 0.8)"
      p={10}
      borderRadius={8}
      opacity={selected ? 0 : 1}
      transition=".2s opacity"
    >
      <Text fontSize="xl" fontWeight="bold">
        Area Summary
      </Text>
      <List fontSize="lg" pt={3}>
        {Object.entries(composition).map(([biome, value]) => (
          <ListItem display="flex" gap={3} pb={2}>
            <Box
              width="24px"
              height="24px"
              bg={`#${BiomeColors[biome].toString(16)}`}
            />
            <Box flex={1}>{BiomeNames[biome]}</Box>
            <Box>{value.toFixed(2)}%</Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AreaSummary;
