# Galaxy Map

[![CI](https://github.com/simons-0427/galaxy-map/actions/workflows/ci.yml/badge.svg)](https://github.com/simons-0427/galaxy-map/actions/workflows/ci.yml)
[![Pages](https://github.com/simons-0427/galaxy-map/actions/workflows/pages.yml/badge.svg)](https://github.com/simons-0427/galaxy-map/actions/workflows/pages.yml)

Interactive map of the Star Wars galaxy. Pan, zoom, search planets, and toggle sectors, regions, grid squares, and hyperspace routes.

**Live demo:** [simons-0427.github.io/galaxy-map](https://simons-0427.github.io/galaxy-map/)

This is a maintained revival of [jennygrahamjones/galaxy-map](https://github.com/jennygrahamjones/galaxy-map) (Create React App 3, 2020). It now builds on Node 20 with Vite, React 18, and Leaflet 1.9.

> Unofficial fan project. Star Wars and all related names are trademarks of Lucasfilm Ltd. Not affiliated with Lucasfilm or Disney.

## Quick start

Requires **Node.js 20+**.

```bash
git clone https://github.com/simons-0427/galaxy-map.git
cd galaxy-map
npm install
npm start
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm test      # data + coordinate smoke tests
npm run build # production bundle in dist/
npm run preview
```

## Features

- Planet markers clustered by zoom, with climate/terrain icons
- Click a planet for faction, sector, region, and Wookieepedia
- Search by planet, sector, region, or grid square (`/` focuses search)
- Layer toggles: hyperspace routes, grid, sectors, regions
- Works as a static site (GitHub Pages)

## Stack

- React 18 + TypeScript + Vite
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/)
- [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

## Project layout

```
src/
  components/map/   Map, search, layers, popups
  data/             GeoJSON planets, sectors, regions, routes
  assets/planets/   Marker icons
  utils/            Lookups and search scoring
```

## Launch notes

The original repo could not be cloned or built as-is on a current machine:

| Problem | Fix |
|---|---|
| File named `.env ` (trailing space) breaks Windows checkout | Removed; not needed |
| CRA 3 / `react-scripts` 3.3.1 fail on modern Node OpenSSL | Migrated to Vite |
| Abandoned `react-leaflet-search` and `react-leaflet-markercluster` RC | Replaced with a local search control and `leaflet.markercluster` |
| `coordinates.reverse()` mutated GeoJSON in place | Convert `[lng, lat]` → `[lat, lng]` without mutating |
| Markers had tooltips only | Click opens a planet popup |
| Dual `yarn.lock` + `package-lock.json` | npm only |
| README had no run instructions | This file |

## Credits

- Original app: [Jenny Graham Jones](https://github.com/jennygrahamjones/galaxy-map)
- Planet / sector / hyperspace GeoJSON from the original project
- Climate/terrain extras from the public SWAPI dump shipped with the original repo

## License

MIT. See [LICENSE](LICENSE).
