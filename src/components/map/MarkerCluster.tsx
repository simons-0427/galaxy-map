import { createPathComponent } from "@react-leaflet/core";
import L from "leaflet";
import type { ReactNode } from "react";
import "leaflet.markercluster";

type MarkerClusterProps = L.MarkerClusterGroupOptions & {
  children?: ReactNode;
};

export const MarkerClusterGroup = createPathComponent<
  L.MarkerClusterGroup,
  MarkerClusterProps
>(function createMarkerCluster({ children: _c, ...props }, ctx) {
  const instance = L.markerClusterGroup(props);
  return {
    instance,
    context: { ...ctx, layerContainer: instance }
  };
});
