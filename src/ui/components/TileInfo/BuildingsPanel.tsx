import { useCallback, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Tooltip,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Center,
  Button,
} from "@chakra-ui/react";
import { BUILDING_IMAGE_MAP, Buildings } from "constants/buildings";
import { RESOURCE_IMAGE_MAP, Resources } from "constants/resources";
import { upgradeBuilding } from "state/player";
import { useAppDispatch } from "state";
import { calculateCost, calculateProduction } from "libs/buildings";

const Building = ({ type, tile, name, onUpgrade }) => {
  const level = tile.buildings[type];
  const costs = calculateCost(type, level);
  const upgradable = Object.entries(costs).every(
    ([key, value]) => value <= tile.resources[key]
  );
  return (
    <Box position="relative" height="100px" width="108px" cursor="pointer">
      <Tooltip label={name} aria-label={name}>
        <Image
          src={BUILDING_IMAGE_MAP[type]}
          width="100px"
          border="4px solid #9e9e9e"
        />
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
          onClick={upgradable ? onUpgrade : () => null}
          width="20px"
          height="20px"
          lineHeight="20px"
          bg={upgradable ? "green.400" : "gray.400"}
          color="white"
          fontWeight="bold"
          borderRadius={2}
          mr={1}
          disabled={!upgradable}
        >
          ↑
        </Box>
      </Flex>
    </Box>
  );
};

const BuildingsPanel = ({ tile }) => {
  const dispatch = useAppDispatch();
  const [upgrading, setUpgrading] = useState<Buildings>();
  const currentLevel = upgrading && tile ? tile.buildings[upgrading] : 0;
  const costs = upgrading ? calculateCost(upgrading, currentLevel) : {};

  const isStorage = upgrading
    ? [Buildings.LUMBER_STORAGE, Buildings.STONE_STORAGE].includes(upgrading)
    : false;

  const openUpgradeUI = useCallback(
    (building: Buildings) => () => setUpgrading(building),
    []
  );

  const resetUpgrading = useCallback(() => setUpgrading(undefined), []);

  const upgrade = useCallback(() => {
    if (!upgrading) return;
    dispatch(
      upgradeBuilding({
        coordinate: { q: tile.q, r: tile.r },
        building: upgrading,
      })
    );
    resetUpgrading();
  }, [upgrading, dispatch, tile, resetUpgrading]);

  return tile ? (
    <>
      <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} px={8} py={4} mt={4}>
        <Text fontSize="2xl" fontWeight="bold" pb={3}>
          Buildings
        </Text>
        <Flex mb={2}>
          <Building
            type={Buildings.LUMBER_MILL}
            name="Lumber Mill"
            onUpgrade={openUpgradeUI(Buildings.LUMBER_MILL)}
            tile={tile}
          />
          <Building
            type={Buildings.QUARRY}
            name="Quarry"
            onUpgrade={openUpgradeUI(Buildings.QUARRY)}
            tile={tile}
          />
          <Building
            type={Buildings.LUMBER_STORAGE}
            name="Lumber Storage"
            onUpgrade={openUpgradeUI(Buildings.LUMBER_STORAGE)}
            tile={tile}
          />
          <Building
            type={Buildings.STONE_STORAGE}
            name="Stone Storage"
            onUpgrade={openUpgradeUI(Buildings.STONE_STORAGE)}
            tile={tile}
          />
        </Flex>
      </Box>
      <Modal isOpen={!!upgrading} onClose={resetUpgrading} isCentered>
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
    </>
  ) : null;
};

export default BuildingsPanel;
