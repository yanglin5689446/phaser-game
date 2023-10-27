import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { RESOURCE_IMAGE_MAP } from "constants/resources";
import { BiomeResourceFactors } from "libs/biome";

const ResourceFactors = ({ biome }) => (
  <Box bg="rgba(255, 255, 255, 0.8)" borderRadius={8} px={8} py={4} mt={4}>
    <Text fontSize="2xl" fontWeight="bold">
      Resource Factors
    </Text>
    <Flex gap={2}>
      {Object.entries(BiomeResourceFactors[biome]).map(
        ([key, value]) =>
          !!value && (
            <Box cursor="pointer" key={key}>
              <Tooltip
                label={key[0].toUpperCase() + key.slice(1)}
                aria-label={key[0].toUpperCase() + key.slice(1)}
              >
                <Image src={RESOURCE_IMAGE_MAP[key]} width="60px" />
              </Tooltip>
              <Text fontWeight="bold" textAlign="center">
                {value}x
              </Text>
            </Box>
          )
      )}
    </Flex>
  </Box>
);

export default ResourceFactors;
