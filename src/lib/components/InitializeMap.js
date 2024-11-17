import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";

/**
 * Initialize the map and return the map instance.
 * @param {string} target - The ID of the DOM element to render the map in.
 * @param {Array} activeLandpads - Array of landpad data with location info.
 * @returns {Map} OpenLayers Map instance.
 */
export function initializeMap(target, activeLandpads) {
    const markers = activeLandpads.map((zone) => {
        const feature = new Feature({
            geometry: new Point(
                fromLonLat([zone.location.longitude, zone.location.latitude])
            ),
        });
        feature.setStyle(
            new Style({
                image: new Icon({
                    color: "#00FF00",
                    crossOrigin: "anonymous",
                    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE0IDE1IiBmaWxsPSJub25lIj4KPGVsbGlwc2UgY3g9IjcuMTY0NDciIGN5PSI3LjYzOTU2IiByeD0iNi43ODM4NSIgcnk9IjcuMDg3MzEiIGZpbGw9IiM5MUY3NTIiLz4KPC9zdmc+",
                    scale: 1.5,
                }),
            })
        );
        return feature;
    });

    const tileLayer = new TileLayer({
        source: new OSM(),
    });

    const markerLayer = new VectorLayer({
        source: new VectorSource({
            features: markers,
        }),
    });

    const map = new Map({
        target,
        layers: [tileLayer, markerLayer],
        view: new View({
            center: fromLonLat([-100.0, 40.0]),
            zoom: 3,
        }),
    });

    return map;
}