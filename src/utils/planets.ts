import factionPlanets from "../data/factionPlanets.json";
import factionSectors from "../data/factionSectors.json";
import planets from "../data/planets.json";
import planetsGeo from "../data/planetsGeo.json";
import missingPlanets from "../data/missingPlanets.json";
import { Planet, PlanetProperties } from "../interfaces/planet";
import { PRIMARY, UNKNOWN, SECONDARY } from "./constants";
import { geoToLatLng } from "./common";

let cachedPlanets: Planet[] | null = null;

export const allPlanets = (): Planet[] => {
  if (!cachedPlanets) {
    const incompletePlanets = missingPlanets.features as Planet[];
    const completePlanets = planetsGeo.features as Planet[];
    cachedPlanets = completePlanets
      .concat(incompletePlanets)
      .filter(planet => planet.properties?.name);
  }
  return cachedPlanets;
};

export const coordinatesForPlanet = (name: string): [number, number] | null => {
  const planet = allPlanets().find(x => x.properties.name === name);
  if (!planet?.geometry?.coordinates) return null;
  return geoToLatLng(planet.geometry.coordinates);
};

const getDataForPlanetWithName = (name: string): PlanetProperties | undefined => {
  return allPlanets()
    .map(planet => planet.properties)
    .find(property => property.name === name);
};

const findFactionForPlanetWithName = (name: string) => {
  const planetData = getDataForPlanetWithName(name);

  const planetFaction = factionPlanets.find(
    faction => faction.planets.includes(name) && faction.type === PRIMARY
  );
  const sectorFaction = planetData?.sector
    ? factionSectors.find(sector => sector.sectors.includes(planetData.sector))
    : undefined;

  return planetFaction
    ? { factionName: planetFaction.factionName, colour: planetFaction.colour }
    : sectorFaction
      ? { factionName: sectorFaction.factionName, colour: sectorFaction.colour }
      : { factionName: UNKNOWN, colour: "black" };
};

const findSubFactionsForPlanetWithName = (name: string) => {
  const factions = factionPlanets.filter(
    faction => faction.planets.includes(name) && faction.type === SECONDARY
  );
  return factions ? factions : [];
};

const featuresOfPlanet = (name: string) => {
  const planet = planets.find(p => p.name === name);
  return planet
    ? planet
    : { climate: UNKNOWN, terrain: UNKNOWN, population: UNKNOWN };
};

export const isFactionCapitol = (name: string) => {
  const faction = factionPlanets.find(
    f => f.planets.includes(name) && f.type === PRIMARY
  );
  return faction ? faction.capitol === name : false;
};

export {
  getDataForPlanetWithName,
  findFactionForPlanetWithName,
  featuresOfPlanet,
  findSubFactionsForPlanetWithName
};
