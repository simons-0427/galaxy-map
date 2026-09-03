import { GeoJSON, Tooltip } from "react-leaflet";
import { Hyperspace } from "../../interfaces/hyperspace";

export const HyperspaceRouteComponent = (input: Hyperspace) => {
  return (
    <GeoJSON
      data={input as GeoJSON.Feature}
      style={() => ({
        color: "white",
        weight: 2
      })}
    >
      <Tooltip sticky permanent={false}>
        {input.properties.hyperspace}
      </Tooltip>
    </GeoJSON>
  );
};
