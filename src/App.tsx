import { Box } from "@chakra-ui/react";
import TileInfo from "ui/components/TileInfo";
import OverviewHint from "ui/components/OverviewHint";

const App = () => (
  <Box position="absolute" width="100vw" height="100vh" pointerEvents="none">
    <TileInfo />
    <OverviewHint />
  </Box>
);

export default App;
