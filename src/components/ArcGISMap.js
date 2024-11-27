import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);

  useEffect(() => {
    // Create a new map instance
    const map = new Map({
      basemap: "topo-vector" // Use the "topo-vector" basemap
    });

    // Create the MapView instance
    const view = new MapView({
      container: viewDivRef.current, // Reference to the map's container div
      map: map,
      zoom: 9, // Zoom level
      center: [-121.8863, 37.3382] // Center on San Jose, CA
    });

    // Add the GeoJSON file URL from the public folder
    const geojsonUrl = "/bay_data.geojson";

    // Create a GeoJSONLayer and configure its renderer
    const geojsonLayer = new GeoJSONLayer({
      url: geojsonUrl, // Load GeoJSON from the specified URL
      outFields: ["*"], // Fetch all fields from the GeoJSON file
      popupTemplate: {
        title: "{name}", // Display the name field in the popup
        content: `
          <b>Median Family Income:</b> ${"{median_income}"}<br/>
          <b>Population:</b> {population}
        `
      },
      renderer: {
        type: "simple", // Simple renderer
        symbol: {
          type: "simple-fill", // Fill the counties with color
          color: "rgba(0, 255, 0, 0.1)", // Light green fill
          outline: {
            color: "rgba(0, 255, 0, 1)", // Green outline
            width: "1px" // Width of county lines
          }
        },
        visualVariables: [
          {
            type: "color",
            field: "median_income", // Use the median_income field for visualization
            stops: [
              { value: 0, color: "rgba(255, 245, 240, 0.7)" },   // Very low income: Light red
              { value: 60000, color: "rgba(254, 224, 210, 0.7)" }, // Low income: Orange
              { value: 100000, color: "rgba(253, 187, 132, 0.7)" },  // Medium income: Yellow
              { value: 200000, color: "rgba(217, 239, 139, 0.7)" },  // High income: Light green
              { value: 300000, color: "rgba(116, 196, 118, 0.7)" }   // Very high income: Green
            ]
          }
        ]
      }
    });

    // Add the GeoJSON layer to the map
    map.add(geojsonLayer);

    // Cleanup on unmount
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
      ref={viewDivRef}
    ></div>
  );
};

export default ArcGISMap;
