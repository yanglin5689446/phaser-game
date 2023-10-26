import { Center, Flex, Image, Text } from "@chakra-ui/react";
import { useAppSelector } from "state";
import lumber from "assets/images/lumber.png";
import stone from "assets/images/stone.png";
import minerals from "assets/images/minerals.png";
import { Resources } from "constants/resources";

const TileProductivity = () => {
  const { ownedTiles } = useAppSelector((state) => state.player);
  const center = useAppSelector((state) => state.map.center);
  const tile = ownedTiles.find((t) => t.q === center?.q && t.r === center?.r);

  return tile ? (
    <Center
      position="absolute"
      top={10}
      left={0}
      right={0}
      transition=".2s opacity"
    >
      <Flex
        bg="rgba(255, 255, 255, 0.8)"
        px={6}
        py={3}
        borderRadius={4}
        gap={4}
      >
        <Flex alignItems="center" justify="space-between" gap={3} width={120}>
          <Image src={lumber} width={12} height={12} />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            letterSpacing={2}
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
          >
            {Math.floor(tile.resources[Resources.LUMBER])}
          </Text>
        </Flex>
        <Flex alignItems="center" justify="space-between" gap={3} width={120}>
          <Image src={stone} width={12} height={12} />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            letterSpacing={2}
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
          >
            {Math.floor(tile.resources[Resources.STONE])}
          </Text>
        </Flex>
        <Flex alignItems="center" justify="space-between" gap={3} width={120}>
          <Image src={minerals} width={12} height={12} />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            letterSpacing={2}
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
          >
            {Math.floor(tile.resources[Resources.MINERALS])}
          </Text>
        </Flex>
      </Flex>
    </Center>
  ) : null;
};

export default TileProductivity;
