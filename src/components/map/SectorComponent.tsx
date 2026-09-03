import { GeoJSON, Tooltip } from "react-leaflet";
import { Sector } from "../../interfaces/sector";
import { sectorColourByFaction, sectorFaction } from "../../utils/sectors";

export const SectorComponent = (inputSector: Sector) => {
  const { sector, sid } = inputSector.properties;
  const colour = sectorColourByFaction(inputSector.properties.sector);
  const faction = sectorFaction(sector);

  return (
    <GeoJSON
      key={`poly-${sid}`}
      style={() => ({
        stroke: true,
        color: colour,
        weight: 0.5,
        fill: true,
        fillOpacity: 0.12
      })}
      data={inputSector as GeoJSON.Feature}
    >
      <Tooltip sticky permanent={false}>
        {sector} {faction && `- ${faction}`}
      </Tooltip>
    </GeoJSON>
  );
};
