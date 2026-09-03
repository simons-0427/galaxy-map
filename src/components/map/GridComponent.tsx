import { GeoJSON } from "react-leaflet";
import { GridSquare } from "../../interfaces/gridsquare";

export const GridComponent = (input: GridSquare) => {
  return (
    <GeoJSON
      data={input as GeoJSON.Feature}
      style={() => ({
        color: "#4a83ec",
        weight: 0.5,
        fill: false
      })}
    />
  );
};
