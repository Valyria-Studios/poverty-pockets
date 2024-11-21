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
          <b>Poverty Rate:</b> {poverty_rate}%<br/>
          <b>Population:</b> {population}<br/>
          <b>Median Income:</b> ${"{median_income}"}
        `
      },
      renderer: {
        type: "simple", // Simple renderer
        symbol: {
          type: "simple-fill", // Fill the counties with color
          color: "rgba(0, 0, 255, 0.1)", // Light blue fill
          outline: {
            color: "rgba(0, 0, 255, 1)", // Blue outline
            width: "1px" // Width of county lines
          }
        },
        visualVariables: [
          {
            type: "color",
            field: "poverty_rate", // Use the poverty_rate field for visualization
            stops: [
              { value: 0, color: "rgba(255, 255, 255, 0.1)" },   // Low poverty: White
              { value: 10, color: "rgba(255, 229, 204, 0.7)" }, // Medium poverty: Light orange
              { value: 20, color: "rgba(255, 153, 51, 0.7)" },  // High poverty: Orange
              { value: 30, color: "rgba(255, 51, 51, 0.7)" }    // Very high poverty: Red
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
