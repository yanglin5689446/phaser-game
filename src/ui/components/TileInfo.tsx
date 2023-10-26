import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "state";
import {
  BiomeNames,
  BiomeResourceFactors,
  Biomes,
  normalizeElevation,
  normalizeHumidity,
} from "libs/biome";
import { serialize } from "libs/coordinates";
import { upgradeBuilding } from "state/player";
import { BUILDING_IMAGE_MAP, Buildings } from "constants/buildings";
import { RESOURCE_IMAGE_MAP, Resources } from "constants/resources";
import { calculateCost, calculateProduction } from "libs/buildings";

const Building = ({ image, level, name, onUpgrade }) => (
  <Box position="relative" height="100px" width="108px" cursor="pointer">
    <Tooltip label={name} aria-label={name}>
      <Image src={image} width="100px" border="4px solid #9e9e9e" />
    </Tooltip>
    <Flex
      fontWeight="bold"
      position="absolute"
      bottom="4px"
      left="4px"
      right="12px"
      height="28px"
      bg="rgba(0, 0, 0, 0.6)"
      justify="space-between"
      alignItems="center"
    >
      <Text color="#e3e3e3" pl={1}>
        Lv. {level}
      </Text>
      <Box
        as="button"
        onClick={onUpgrade}
        width="20px"
        height="20px"
        lineHeight="20px"
        bg="green.400"
        color="white"
        fontWeight="bold"
        borderRadius={2}
        mr={1}
      >
        ↑
      </Box>
    </Flex>
  </Box>
);

const ResourceFactor = ({ name, image, factor }) => (
  <Box cursor="pointer">
    <Tooltip label={name} aria-label={name}>
      <Image src={image} width="60px" />
    </Tooltip>
    <Text fontWeight="bold" textAlign="center">
      {factor}x
    </Text>
  </Box>
);

const TileInfo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [upgrading, setUpgrading] = useState<Buildings>();
  const { center, select, tiles } = useAppSelector((state) => state.map);
  const { ownedTiles } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  const ownedTile = ownedTiles.find(
    (tile) => tile.q === center?.q && tile.r === center.r
  );
  const tile =
    ownedTile || (center ? tiles[serialize(center.q, center.r)] : null);

  const biome = tile?.type as Biomes;
  const currentLevel =
    upgrading && ownedTile ? ownedTile.buildings[upgrading] : 0;
  const costs = upgrading ? calculateCost(upgrading, currentLevel) : {};

  const isStorage = upgrading
    ? [Buildings.LUMBER_STORAGE, Buildings.STONE_STORAGE].includes(upgrading)
    : false;

  const openUpgradeUI = useCallback(
    (building: Buildings) => () => {
      setUpgrading(building);
      onOpen();
    },
    [onOpen]
  );

  const upgrade = useCallback(() => {
    if (!upgrading) return;
    const index = ownedTiles.findIndex(
      (tile) => tile.q === center?.q && tile.r === center.r
    );
    dispatch(upgradeBuilding({ index, building: upgrading }));
    onClose();
  }, [center, onClose, dispatch, ownedTiles, upgrading]);

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
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} px={8} py={4} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Resource Factors
        </Text>
        <Flex gap={2}>
          {Object.entries(BiomeResourceFactors[biome]).map(
            ([key, value]) =>
              !!value && (
                <ResourceFactor
                  key={key}
                  name={key[0].toUpperCase() + key.slice(1)}
                  image={RESOURCE_IMAGE_MAP[key]}
                  factor={value}
                />
              )
          )}
        </Flex>
      </Box>
      {!!ownedTile && (
        <Box
          bg="rgba(255, 255, 255, 0.8)"
          borderRadius={8}
          px={8}
          py={4}
          mt={4}
        >
          <Text fontSize="2xl" fontWeight="bold" pb={3}>
            Buildings
          </Text>
          <Flex mb={2}>
            <Building
              image={BUILDING_IMAGE_MAP[Buildings.LUMBER_MILL]}
              name="Lumber Mill"
              level={ownedTile.buildings[Buildings.LUMBER_MILL]}
              onUpgrade={openUpgradeUI(Buildings.LUMBER_MILL)}
            />
            <Building
              image={BUILDING_IMAGE_MAP[Buildings.QUARRY]}
              name="Quarry"
              level={ownedTile.buildings[Buildings.QUARRY]}
              onUpgrade={openUpgradeUI(Buildings.QUARRY)}
            />
            <Building
              image={BUILDING_IMAGE_MAP[Buildings.LUMBER_STORAGE]}
              name="Lumber Storage"
              level={ownedTile.buildings[Buildings.LUMBER_STORAGE]}
              onUpgrade={openUpgradeUI(Buildings.LUMBER_STORAGE)}
            />
            <Building
              image={BUILDING_IMAGE_MAP[Buildings.STONE_STORAGE]}
              name="Stone Storage"
              level={ownedTile.buildings[Buildings.STONE_STORAGE]}
              onUpgrade={openUpgradeUI(Buildings.STONE_STORAGE)}
            />
          </Flex>
        </Box>
      )}
      <Modal isOpen={isOpen && !!ownedTile} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upgrade</ModalHeader>
          <ModalCloseButton />
          {upgrading && (
            <ModalBody>
              <Flex align="center" gap={4}>
                <Box>
                  <Image
                    src={BUILDING_IMAGE_MAP[upgrading]}
                    width={40}
                    border="4px solid #9e9e9e"
                  />
                  <Text fontWeight="bold" fontSize="xl" align="center">
                    Lv. {currentLevel}
                  </Text>
                  <Text fontWeight="bold" fontSize="md" align="center">
                    {calculateProduction(upgrading, currentLevel || 0).toFixed(
                      2
                    )}{" "}
                    {isStorage ? "Unit" : "per Hour"}
                  </Text>
                </Box>
                <Text fontSize="4xl">→</Text>
                <Box>
                  <Image
                    src={BUILDING_IMAGE_MAP[upgrading]}
                    width={40}
                    border="4px solid #9e9e9e"
                  />
                  <Text fontWeight="bold" fontSize="xl" align="center">
                    Lv. {currentLevel + 1}
                  </Text>
                  <Text fontWeight="bold" fontSize="md" align="center">
                    {calculateProduction(upgrading, currentLevel + 1).toFixed(
                      2
                    )}{" "}
                    {isStorage ? "Unit" : "per Hour"}
                  </Text>
                </Box>
              </Flex>
              <Center flexDirection="column" my={3}>
                <Box pb={5}>
                  <Text fontWeight="bold" align="center">
                    Cost
                  </Text>
                  <Flex gap={4}>
                    <Flex align="center" gap={2}>
                      <Image
                        src={RESOURCE_IMAGE_MAP[Resources.LUMBER]}
                        width={10}
                      />
                      <Box fontSize="lg" fontWeight="bold">
                        {Math.ceil(costs[Resources.LUMBER])}
                      </Box>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Image
                        src={RESOURCE_IMAGE_MAP[Resources.STONE]}
                        width={10}
                      />
                      <Box fontSize="lg" fontWeight="bold">
                        {Math.ceil(costs[Resources.STONE])}
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
                <Button colorScheme="blue" onClick={upgrade}>
                  Confirm
                </Button>
              </Center>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TileInfo;
