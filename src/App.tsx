import { Box } from "@chakra-ui/react";
import Loading from "ui/views/Loading";
import Register from "ui/views/Register";
import Map from "ui/views/Map";

const App = () => (
  <Box position="absolute" width="100vw" height="100vh" pointerEvents="none">
    <Loading />
    <Register />
    <Map />
  </Box>
);

export default App;
