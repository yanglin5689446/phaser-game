import { Box, Flex, Text } from "@chakra-ui/react";
import { BiomeColors, BiomeNames } from "libs/biome";
import { serialize } from "libs/coordinates";
import { useAppDispatch, useAppSelector } from "state";
import { setCenter } from "state/map";

const OwnedTileList = () => {
  const { ownedTiles } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  return (
    <Box
      position="absolute"
      bottom={10}
      right={10}
      height={400}
      width={400}
      borderRadius={4}
      bg="rgba(255, 255, 255, 0.8)"
      p={6}
      pointerEvents="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Kingdom
      </Text>
      <Box mt={4}>
        {ownedTiles?.map((tile: OwnedTileData) => (
          <Flex
            key={serialize(tile.q, tile.r)}
            justify="center"
            gap={3}
            onClick={() =>
              dispatch(setCenter({ q: tile.q, r: tile.r, jump: true }))
            }
            cursor="pointer"
            p={2}
            bg="#e3e3e3"
            border="2px solid #cccccc"
            _hover={{
              opacity: 0.7,
            }}
            transition=".2s opacity"
          >
            <Box
              width="24px"
              height="24px"
              bg={`#${BiomeColors[tile.type].toString(16)}`}
            />
            <Box>{BiomeNames[tile.type]}</Box>
            <Box>
              ({tile.q}, {tile.r})
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default OwnedTileList;
