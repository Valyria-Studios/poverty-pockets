import { useEffect } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const IncomeLayer = ({ map, geojsonUrl }) => {
  useEffect(() => {
    // Define a renderer for visualizing the features
    const renderer = {
      type: "simple", // Simple renderer for polygons
      symbol: {
        type: "simple-fill", // Fill symbol
        color: [0, 120, 210, 0.5], // Blue with transparency
        outline: {
          color: "white",
          width: 1,
        },
      },
    };

    // Create a GeoJSONLayer
    const geoJsonLayer = new GeoJSONLayer({
      url: geojsonUrl, // URL of the GeoJSON file
      renderer, // Apply the renderer
      popupTemplate: {
        title: "{NAMELSAD}",
        content: `
          <b>GEOID:</b> {GEOID}<br>
          <b>Land Area:</b> {ALAND} sq. meters<br>
          <b>Water Area:</b> {AWATER} sq. meters<br>
        `,
      },
    });

    // Add the layer to the map
    map.add(geoJsonLayer);

    // Cleanup: Remove the layer when the component unmounts
    return () => {
      map.remove(geoJsonLayer);
    };
  }, [map, geojsonUrl]);

  return null; // This component doesn't render any visible DOM
};

export default IncomeLayer;
