import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { matchesQuery } from "../../utils/common";
import { allPlanets, coordinatesForPlanet } from "../../utils/planets";

type Hit = { name: string; sector?: string; region?: string };

export function SearchComponent() {
  const map = useMap();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return allPlanets()
      .map(planet => {
        const { name, sector, region, grid } = planet.properties;
        const score =
          matchesQuery(name, q) * 3 +
          matchesQuery(sector || "", q) * 2 +
          matchesQuery(region || "", q) +
          matchesQuery(grid || "", q);
        return { name, sector, region, score };
      })
      .filter(hit => hit.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 12);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const flyTo = (hit: Hit) => {
    const latlng = coordinatesForPlanet(hit.name);
    if (!latlng) return;
    map.flyTo(latlng, 6, { duration: 0.8 });
    setQuery("");
  };

  return (
    <div className="galaxy-chrome galaxy-search">
      <input
        ref={inputRef}
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search planet, sector, grid…  (/)"
        aria-label="Search planets"
        onKeyDown={event => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive(i => Math.min(i + 1, Math.max(results.length - 1, 0)));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive(i => Math.max(i - 1, 0));
          } else if (event.key === "Enter" && results[active]) {
            flyTo(results[active]);
          } else if (event.key === "Escape") {
            setQuery("");
            inputRef.current?.blur();
          }
        }}
      />
      {results.length > 0 && (
        <ul className="galaxy-search-results" role="listbox">
          {results.map((hit, index) => (
            <li key={hit.name}>
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => flyTo(hit)}
              >
                {hit.name}
                {hit.sector ? <em>{hit.sector}</em> : hit.region ? <em>{hit.region}</em> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
