import { describe, expect, it } from "vitest";
import { geoToLatLng, matchesQuery } from "./common";
import { allPlanets, coordinatesForPlanet } from "./planets";

describe("galaxy data", () => {
  it("loads named planets", () => {
    const planets = allPlanets();
    expect(planets.length).toBeGreaterThan(1000);
    expect(planets.every(planet => Boolean(planet.properties.name))).toBe(true);
  });

  it("finds Coruscant without mutating coordinates", () => {
    const planet = allPlanets().find(p => p.properties.name === "Coruscant");
    expect(planet).toBeTruthy();
    const original = [...planet!.geometry.coordinates];
    const latlng = coordinatesForPlanet("Coruscant");
    expect(latlng).not.toBeNull();
    expect(latlng![0]).toBe(original[1]);
    expect(latlng![1]).toBe(original[0]);
    expect(planet!.geometry.coordinates).toEqual(original);
  });

  it("converts GeoJSON [lng, lat] to Leaflet [lat, lng]", () => {
    expect(geoToLatLng([10, 20])).toEqual([20, 10]);
  });

  it("ranks exact search matches first", () => {
    expect(matchesQuery("Tatooine", "tatooine")).toBeGreaterThan(
      matchesQuery("Tatooine", "tat")
    );
  });
});
