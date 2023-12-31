import { SceneKeys } from "constants/scenes";
import withSceneMatched from "libs/withSceneMatched";
import AreaSummary from "ui/components/AreaSummary";
import OverviewHint from "ui/components/OverviewHint";
import TileProductivity from "ui/components/TileProductivity";
import OwnedTileList from "ui/components/OwnedTileList";
import TileInfo from "ui/components/TileInfo";

const Map = withSceneMatched([SceneKeys.MAP])(() => {
  return (
    <>
      <TileInfo />
      <OverviewHint />
      <AreaSummary />
      <OwnedTileList />
      <TileProductivity />
    </>
  );
});

export default Map;
