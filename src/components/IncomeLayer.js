import React, { useEffect } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const IncomeLayer = ({ map }) => {
  useEffect(() => {
    const geojsonUrl = "/bay_data.geojson"; // Adjust the path if needed

    // Define the GeoJSON Layer
    const incomeLayer = new GeoJSONLayer({
      url: geojsonUrl,
      outFields: ["*"], // Fetch all fields
      popupTemplate: {
        title: "{name}",
        content: `
          <b>Median Income:</b> ${"{median_income}"}
        `,
      },
      renderer: {
        type: "simple", // Simple Renderer
        visualVariables: [
          {
            type: "color",
            field: "median_income", // Field to visualize
            stops: [
              { value: 30000, color: "rgba(255, 69, 58, 0.7)" }, // Low income (less transparent red)
              { value: 75000, color: "rgba(255, 221, 51, 0.7)" }, // Medium income (less transparent yellow)
              { value: 100000, color: "rgba(34, 197, 94, 0.7)" }, // High income (less transparent green)
            ],
          },
        ],
        symbol: {
          type: "simple-fill", // Fill symbol
          outline: {
            color: "rgba(0, 0, 0, 0.5)", // Border outline color
            width: "0.75px", // Thinner border for better visibility
          },
        },
      },
    });

    // Add the GeoJSON Layer to the map
    map.add(incomeLayer);

    return () => {
      if (map && incomeLayer) {
        map.remove(incomeLayer); // Cleanup when component unmounts
      }
    };
  }, [map]);

  return null; // This component doesn't render anything
};

export default IncomeLayer;
