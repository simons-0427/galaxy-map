import { GeoJSON, Tooltip } from "react-leaflet";
import { Region } from "../../interfaces/region";

export const RegionComponent = (inputRegion: Region) => {
  const { region, rid } = inputRegion.properties;

  return (
    <GeoJSON
      key={`poly-${rid}`}
      style={() => ({
        stroke: true,
        color: "#4a83ec",
        weight: 0.5,
        fill: true,
        fillOpacity: 0.08
      })}
      data={inputRegion as GeoJSON.Feature}
    >
      <Tooltip sticky permanent={false}>
        {region}
      </Tooltip>
    </GeoJSON>
  );
};
