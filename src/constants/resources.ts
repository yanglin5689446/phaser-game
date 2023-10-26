import lumber from "assets/images/lumber.png";
import stone from "assets/images/stone.png";
import minerals from "assets/images/minerals.png";

export enum Resources {
  LUMBER = "LUMBER",
  STONE = "STONE",
  MINERALS = "MINERALS",
}

export const RESOURCE_IMAGE_MAP = {
  [Resources.LUMBER]: lumber,
  [Resources.STONE]: stone,
  [Resources.MINERALS]: minerals,
};
