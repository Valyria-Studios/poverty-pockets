import { useEffect } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const IncomeLayer = ({ map, geojsonUrl }) => {
  useEffect(() => {
    // Define a renderer for the income data
    const incomeRenderer = {
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

    // Define a renderer for the borders
    const bordersRenderer = {
      type: "simple", // Simple renderer for polygons
      symbol: {
        type: "simple-fill", // Fill symbol
        color: "rgba(0, 0, 0, 0)", // Transparent fill
        outline: {
          color: "blue", // Border color
          width: 1.5, // Border thickness
        },
      },
    };

    // Create the GeoJSONLayer for income data
    const incomeLayer = new GeoJSONLayer({
      url: geojsonUrl, // URL of the GeoJSON file for income data
      renderer: incomeRenderer, // Apply the renderer for income data
      popupTemplate: {
        title: "{NAMELSAD}",
        content: `
          <b>GEOID:</b> {GEOID}<br>
          <b>Land Area:</b> {ALAND} sq. meters<br>
          <b>Water Area:</b> {AWATER} sq. meters<br>
        `,
      },
    });

    // Create the GeoJSONLayer for borders
    const bordersLayer = new GeoJSONLayer({
      url: `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`, // URL of the GeoJSON file for borders
      renderer: bordersRenderer, // Apply the renderer for borders
    });

    // Add the layers to the map
    map.addMany([incomeLayer, bordersLayer]);

    // Cleanup: Remove the layers when the component unmounts
    return () => {
      map.removeMany([incomeLayer, bordersLayer]);
    };
  }, [map, geojsonUrl]);

  return null; // This component doesn't render any visible DOM
};

export default IncomeLayer;
