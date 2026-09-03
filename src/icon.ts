import L from "leaflet";

import bastion from "./assets/planets/bastion.png";
import city from "./assets/planets/city.png";
import cloudCity from "./assets/planets/cloud-city.png";
import concordDawn from "./assets/planets/concord-dawn.png";
import desert from "./assets/planets/desert.png";
import endor from "./assets/planets/endor.png";
import gasGiant from "./assets/planets/gas-giant.png";
import jovan from "./assets/planets/jovan.png";
import kuat from "./assets/planets/kuat.png";
import lahmu from "./assets/planets/lahmu.png";
import lushAllianceCapital from "./assets/planets/lush-alliance-capital.png";
import lush from "./assets/planets/lush.png";
import ringOfKafrene from "./assets/planets/ringofkafrene.png";
import snowWorld from "./assets/planets/snow-world.png";
import spaceStation from "./assets/planets/space-station.png";
import temperate from "./assets/planets/temperate.png";
import volcanic from "./assets/planets/volcanic.png";
import waterworld from "./assets/planets/waterworld.png";
import { PlanetProperties } from "./interfaces/planet";
import {
  featuresOfPlanet,
  findFactionForPlanetWithName,
  getDataForPlanetWithName,
  isFactionCapitol
} from "./utils/planets";

const namedIcons: Record<string, string> = {
  "bastion.png": bastion,
  "city.png": city,
  "cloud-city.png": cloudCity,
  "concord-dawn.png": concordDawn,
  "desert.png": desert,
  "endor.png": endor,
  "gas-giant.png": gasGiant,
  "jovan.png": jovan,
  "kuat.png": kuat,
  "lahmu.png": lahmu,
  "lush-alliance-capital.png": lushAllianceCapital,
  "lush.png": lush,
  "ringofkafrene.png": ringOfKafrene,
  "snow-world.png": snowWorld,
  "space-station.png": spaceStation,
  "temperate.png": temperate,
  "volcanic.png": volcanic,
  "waterworld.png": waterworld
};

const urlForPlanet = (planet: string) => {
  const { climate, terrain } = featuresOfPlanet(planet);
  const planetProperties: PlanetProperties | undefined =
    getDataForPlanetWithName(planet);
  const hasPlanetSpecificIcon = !!planetProperties?.icon;
  const capitol = isFactionCapitol(planet);
  const faction = findFactionForPlanetWithName(planet);

  if (hasPlanetSpecificIcon && planetProperties.icon) {
    return namedIcons[planetProperties.icon] ?? temperate;
  }

  if (capitol) {
    return faction.factionName === "Alliance" ? lushAllianceCapital : city;
  }

  switch (climate) {
    case "frozen":
      return snowWorld;
    case "tropical":
      return lush;
    case "arid":
      return desert;
    default:
      switch (terrain) {
        case "cityscape":
          return city;
        case "ocean":
          return waterworld;
        case "gas giant":
          return gasGiant;
        case "volcanoes":
          return volcanic;
        default:
          return temperate;
      }
  }
};

export const iconForPlanet = (planet: string) => {
  return L.icon({
    iconUrl: urlForPlanet(planet),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -12]
  });
};

export const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  let size = "LargeXL";

  if (count < 10) {
    size = "Small";
  } else if (count >= 10 && count < 100) {
    size = "Medium";
  } else if (count >= 100 && count < 500) {
    size = "Large";
  }

  return L.divIcon({
    html: `<div><img class="markerCluster${size}" src="${temperate}" alt="" /></div>`,
    className: `markerCluster${size}`,
    iconSize: [30, 30]
  });
};
