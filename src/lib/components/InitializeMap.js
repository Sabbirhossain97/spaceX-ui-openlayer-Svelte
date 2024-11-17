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
import { defaults as defaultControls } from "ol/control";

/**
 * Initialize the map and return the map instance.
 * @param {string} target - The ID of the DOM element to render the map in.
 * @param {Array} activeLandpads - Array of landpad data with location info.
 * @returns {Map} OpenLayers Map instance.
 */
export function initializeMap(target, initialLandpads) {
    const markersSource = new VectorSource();

    const markersLayer = new VectorLayer({
        source: markersSource,
    });

    const tileLayer = new TileLayer({
        source: new OSM(),
    });

    const map = new Map({
        target,
        layers: [tileLayer, markersLayer],
        controls: defaultControls({
            zoom: false,
            attribution: false,
        }),
        view: new View({
            center: fromLonLat([-100.0, 40.0]),
            zoom: 3,
        }),
    });

    const updateMarkers = (landpads) => {
        markersSource.clear();

        const features = landpads.map((zone) => {
            const fillColor =
                zone.status === "active"
                    ? "#00FF00"
                    : zone.status === "retired"
                        ? "#FF0000"
                        : "#0000FF";

            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                  <ellipse cx="7.45512" cy="7.0047" rx="6.78385" ry="6.96759" fill="${fillColor}"/>
                </svg>
            `;

            const svgBase64 = `data:image/svg+xml;base64,${btoa(svg)}`;

            const feature = new Feature({
                geometry: new Point(
                    fromLonLat([zone.location.longitude, zone.location.latitude])
                ),
                name: zone.name,
            });

            feature.setStyle(
                new Style({
                    image: new Icon({
                        src: svgBase64,
                        scale: 1,
                    }),
                })
            );

            return feature;
        });

        markersSource.addFeatures(features);
    };

    updateMarkers(initialLandpads);

    return {
        map,
        updateMarkers,
    };
}