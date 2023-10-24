import {
  Box,
  Collapse,
  Flex,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "state";
import { BiomeColors, BiomeNames } from "libs/biome";
import { useMemo } from "react";
import { serialize } from "libs/coordinates";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const AreaSummary = () => {
  const { center, tiles, chunkSize } = useAppSelector((state) => state.map);
  const { isOpen, onToggle } = useDisclosure();

  const composition = useMemo(() => {
    if (!center) return {};
    const N = chunkSize;
    let count = 0;
    const result = {};
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        const key = serialize(center.q + q, center.r + r);
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
  }, [center, chunkSize, tiles]);

  return (
    <Box
      position="absolute"
      top={10}
      right={10}
      bg="rgba(255, 255, 255, 0.8)"
      py={4}
      px={8}
      borderRadius={8}
      width="400px"
      pointerEvents="auto"
    >
      <Flex
        alignItems="center"
        justify="space-between"
        onClick={onToggle}
        cursor="pointer"
      >
        <Text fontSize="xl" fontWeight="bold">
          Area Summary
        </Text>
        {isOpen ? <MinusIcon /> : <AddIcon />}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <List fontSize="lg" pt={3}>
          {Object.entries(composition).map(([biome, value]) => (
            <ListItem display="flex" gap={3} pb={2} key={biome}>
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
      </Collapse>
    </Box>
  );
};

export default AreaSummary;
