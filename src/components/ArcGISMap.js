<<<<<<< HEAD
import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import "@arcgis/core/assets/esri/themes/light/main.css";
import IncomeLayer from "./IncomeLayer";
import Legend from "./Legend";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { getBayAreaGeoJSON } from '../utils/geoUtils';

const ArcGISMap = () => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      basemap: "topo-vector", 
    });

    const view = new MapView({
      container: mapDivRef.current,
      map: map,
      zoom: 11,
      center: [-121.8863, 37.3382], 
    });

    fetch(`${process.env.PUBLIC_URL}/san_jose_tracts.geojson`)
      .then(response => response.json())
      .then(caCounties => { 
        const bayAreaGeoJSON = getBayAreaGeoJSON(caCounties);

        // Add the Bay Area counties GeoJSON Layer
        const bayAreaLayer = new GeoJSONLayer({
          data: bayAreaGeoJSON, 
          renderer: { 
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: [226, 119, 40, 0.75], // Example: Semi-transparent orange fill
              outline: {
                color: "white", 
                width: 1 
              }
            }
          }
        });

        map.add(bayAreaLayer);

        // Add boundary GeoJSON Layer for tract borders 
        const boundaryLayer = new GeoJSONLayer({
          url: `${process.env.PUBLIC_URL}/san_jose_tracts.geojson`, 
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: "rgba(0, 0, 0, 0)", // Transparent fill
              outline: {
                color: "black", 
                width: 1.5, 
              },
            },
          },
        });

        map.add(boundaryLayer); 

        // Zoom to the Bay Area 
        view.goTo({
          target: bayAreaGeoJSON, 
          zoom: 8  
        });
      })
      .catch(error => {
        console.error("Error loading GeoJSON data:", error);
      }); 

    mapRef.current = map;

=======
import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import Legend from "./Legend"; // Import the Legend component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null); // State to hold the map instance

  useEffect(() => {
    // Create a new map instance
    const newMap = new Map({
      basemap: "topo-vector" // Use the "topo-vector" basemap
    });

    // Create the MapView instance
    const view = new MapView({
      container: viewDivRef.current, // Reference to the map's container div
      map: newMap,
      zoom: 10, // Adjust zoom level for better view
      center: [-121.8863, 37.3382] // Center on San Jose, CA
    });

    // Save the map instance in state
    setMap(newMap);

    // Cleanup on unmount
>>>>>>> 237c28b0b0c78068c831d9d77e68c7cc23cd2528
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

<<<<<<< HEAD
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div ref={mapDivRef} style={{ height: "100%", width: "100%" }}></div>
      {mapRef.current && <IncomeLayer map={mapRef.current} />}
      <Legend />
=======
  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_data.geojson`; // GeoJSON URL

  return (
    <div
      style={{
        position: "relative", // Ensure the legend can be positioned within the map
        height: "100vh",
        width: "100vw"
      }}
      ref={viewDivRef}
    >
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}
      <Legend /> {/* Add the Legend component */}
>>>>>>> 237c28b0b0c78068c831d9d77e68c7cc23cd2528
    </div>
  );
};

<<<<<<< HEAD
export default ArcGISMap;
=======
export default ArcGISMap;
>>>>>>> 237c28b0b0c78068c831d9d77e68c7cc23cd2528
