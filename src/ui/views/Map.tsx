import { SceneKeys } from "constants/scenes";
import withSceneMatched from "libs/withSceneMatched";
import OverviewHint from "ui/components/OverviewHint";
import TileInfo from "ui/components/TileInfo";

const Map = withSceneMatched([SceneKeys.MAP])(() => {
  return (
    <>
      <TileInfo />
      <OverviewHint />
    </>
  );
});

export default Map;
