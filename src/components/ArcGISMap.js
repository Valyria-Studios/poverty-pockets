import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import "@arcgis/core/assets/esri/themes/light/main.css"; // Import ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      basemap: "topo-vector"
    });

    const view = new MapView({
      container: viewDivRef.current,
      map: map,
      zoom: 10,
      center: [-121.8863, 37.3382] // Centered on San Jose
    });

    // Define the URL of the GeoJSON file
    const geojsonUrl = `${process.env.PUBLIC_URL}/bay_data.geojson`;

    // Define the GeoJSONLayer and set up the symbology based on poverty rate
    const geojsonLayer = new GeoJSONLayer({
      url: geojsonUrl,
      outFields: ["*"], // Get all fields from GeoJSON data
      renderer: {
        type: "simple", // Use a simple renderer
        symbol: {
          type: "simple-fill", // Fills each neighborhood with color
          color: "rgba(0, 0, 255, 0.1)", // Light blue base color for all neighborhoods
          outline: {
            color: "rgba(0, 0, 255, 0.5)",
            width: "0.5px"
          }
        },
        visualVariables: [
          {
            type: "color",
            field: "poverty_rate", // Replace with the name of your poverty rate field
            stops: [
              { value: 0, color: "rgba(255, 255, 255, 0.1)" },   // Low poverty: White
              { value: 10, color: "rgba(255, 229, 204, 0.7)" }, // Medium poverty: Light orange
              { value: 20, color: "rgba(255, 153, 51, 0.7)" },  // High poverty: Dark orange
              { value: 30, color: "rgba(255, 51, 51, 0.7)" },   // Very high poverty: Red
            ]
          }
        ]
      },
      popupTemplate: {
        title: "{name}", // Display the name of the neighborhood
        content: "Poverty Rate: {poverty_rate}%" // Display poverty rate in the popup
      }
    });

    // Add the GeoJSONLayer to the map
    map.add(geojsonLayer);

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div style={{ height: "100vh", width: "100vw" }} ref={viewDivRef}></div>;
};

export default ArcGISMap;
