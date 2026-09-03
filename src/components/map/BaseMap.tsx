import { useEffect, useMemo, useState } from "react";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  Tooltip
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { createClusterCustomIcon, iconForPlanet } from "../../icon";
import { GridSquare } from "../../interfaces/gridsquare";
import { Hyperspace } from "../../interfaces/hyperspace";
import { Region } from "../../interfaces/region";
import { Sector } from "../../interfaces/sector";
import { geoToLatLng } from "../../utils/common";
import { allPlanets } from "../../utils/planets";
import { factionSpecificPopup } from "./CustomPopup";
import { GridComponent } from "./GridComponent";
import { HyperspaceRouteComponent } from "./HyperspaceRouteComponent";
import { MarkerClusterGroup } from "./MarkerCluster";
import { RegionComponent } from "./RegionComponent";
import { SearchComponent } from "./SearchComponent";
import { SectorComponent } from "./SectorComponent";

type OverlayData = {
  grid: { features: GridSquare[] };
  hyperspace: { features: Hyperspace[] };
  region: { features: Region[] };
  sector: { features: Sector[] };
};

function OverlayLayers() {
  const [data, setData] = useState<OverlayData | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("../../data/grid.json"),
      import("../../data/hyperspace.json"),
      import("../../data/region.json"),
      import("../../data/sector.json")
    ]).then(([grid, hyperspace, region, sector]) => {
      if (!cancelled) {
        setData({
          grid: grid.default,
          hyperspace: hyperspace.default,
          region: region.default,
          sector: sector.default
        } as unknown as OverlayData);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <>
      <LayersControl.Overlay name="Hyperspace routes">
        <LayerGroup>
          {data.hyperspace.features.map(route => (
            <HyperspaceRouteComponent
              key={`route-${route.properties.hid}`}
              {...route}
            />
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Grid" checked>
        <LayerGroup>
          {data.grid.features.map(square => (
            <GridComponent
              key={`grid-${square.properties.grid}`}
              {...square}
            />
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sectors" checked>
        <LayerGroup>
          {data.sector.features.map(s => (
            <SectorComponent key={`sector-${s.properties.sid}`} {...s} />
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Regions">
        <LayerGroup>
          {data.region.features.map(r => (
            <RegionComponent key={`region-${r.properties.rid}`} {...r} />
          ))}
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  );
}

export function BaseMap() {
  const markers = useMemo(
    () =>
      allPlanets().map(planet => {
        const { coordinates } = planet.geometry;
        const { name, uid } = planet.properties;
        return (
          <Marker
            key={`marker-${uid}-${name}`}
            position={geoToLatLng(coordinates)}
            title={name}
            icon={iconForPlanet(name)}
          >
            <Tooltip>{name}</Tooltip>
            <Popup>{factionSpecificPopup(planet.properties)}</Popup>
          </Marker>
        );
      }),
    []
  );

  return (
    <>
      <div className="galaxy-chrome galaxy-title">
        Galaxy Map
        <small>Unofficial Star Wars fan project</small>
      </div>
      <div className="galaxy-chrome galaxy-credit">
        Revival of{" "}
        <a href="https://github.com/jennygrahamjones/galaxy-map">
          jennygrahamjones/galaxy-map
        </a>
      </div>
      <MapContainer
        center={[0, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={10}
        inertia
        attributionControl={false}
        worldCopyJump={false}
      >
        <SearchComponent />
        <LayersControl position="topright">
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={55}
            disableClusteringAtZoom={5}
            spiderLegPolylineOptions={{ weight: 0, opacity: 0 }}
            polygonOptions={{ weight: 0, opacity: 0 }}
            chunkedLoading
          >
            {markers}
          </MarkerClusterGroup>
          <OverlayLayers />
        </LayersControl>
      </MapContainer>
    </>
  );
}
