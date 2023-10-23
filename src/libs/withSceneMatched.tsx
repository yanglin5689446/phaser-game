import { SceneKeys } from "constants/scenes";
import { ComponentType } from "react";
import { useAppSelector } from "state";

const withSceneMatched =
  (scenes: SceneKeys[]) => (Component: ComponentType) => (props) => {
    const scene = useAppSelector((state) => state.scene);
    return scenes.includes(scene.current) ? <Component {...props} /> : null;
  };

export default withSceneMatched;
