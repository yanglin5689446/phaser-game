import { Box, Text } from "@chakra-ui/react";
import { useAppSelector } from "state";

const OverviewHint = () => {
  const { selected } = useAppSelector((state) => state.tiles);

  return (
    <Box
      position="absolute"
      bottom={20}
      left={0}
      width="100%"
      transition="all .2s"
      opacity={!!selected ? 0 : 1}
    >
      <Text
        color="whiteAlpha.900"
        letterSpacing={2}
        mx="auto"
        bg="rgba(0, 0, 0, 0.7)"
        textAlign="center"
        borderRadius={2}
        py={1}
        width={320}
      >
        Drag to look around
      </Text>
    </Box>
  );
};

export default OverviewHint;
