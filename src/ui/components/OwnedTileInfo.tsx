import { Center, Flex, Image, Text } from "@chakra-ui/react";
import { useAppSelector } from "state";
import timber from "assets/images/timber.png";
import rocks from "assets/images/rocks.png";
import minerals from "assets/images/minerals.png";

const OwnedTileInfo = () => {
  const { select } = useAppSelector((state) => state.map);

  return (
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
          <Image src={timber} width={12} height={12} />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            letterSpacing={2}
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
          >
            {/* resources.timber */}
          </Text>
        </Flex>
        <Flex alignItems="center" justify="space-between" gap={3} width={120}>
          <Image src={rocks} width={12} height={12} />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            letterSpacing={2}
            textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
          >
            {/* resources.rocks */}
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
            {/* resources.minerals */}
          </Text>
        </Flex>
      </Flex>
    </Center>
  );
};

export default OwnedTileInfo;
