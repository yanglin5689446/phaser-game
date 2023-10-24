import { Box, CircularProgress } from "@chakra-ui/react";
import { SceneKeys } from "constants/scenes";
import withSceneMatched from "libs/withSceneMatched";

const Loading = withSceneMatched([SceneKeys.LOADING])(() => (
  <Box width="100vw" height="100vh" bg="white" pointerEvents="auto">
    <CircularProgress />
  </Box>
));

export default Loading;
