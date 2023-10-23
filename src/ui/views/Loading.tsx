import { Box, CircularProgress } from "@chakra-ui/react";
import { SceneKeys } from "constants/scenes";
import withSceneMatched from "libs/withSceneMatched";
import { useEffect } from "react";
import { useAppDispatch } from "state";
import { goto } from "state/scene";

const Loading = withSceneMatched([SceneKeys.LOADING])(() => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(goto(SceneKeys.REGISTER));
  }, [dispatch]);

  return (
    <Box width="100vw" height="100vh" bg="white" pointerEvents="auto">
      <CircularProgress />
    </Box>
  );
});

export default Loading;
