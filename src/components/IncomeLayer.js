import React, { useEffect } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const IncomeLayer = ({ map }) => {
  useEffect(() => {
    const geojsonLayer = new GeoJSONLayer({
      url: `${process.env.PUBLIC_URL}/san_jose_income.geojson`, // Correct path for your income GeoJSON
      outFields: ["*"],
      popupTemplate: {
        title: "{name}", // Name field in the GeoJSON
        content: `<b>Median Income:</b> $ {median_income}`,
      },
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          outline: {
            color: "white",
            width: 1.0,
          },
        },
        visualVariables: [
          {
            type: "color",
            field: "median_income",
            stops: [
              { value: 30000, color: "rgba(255, 69, 58, 0.7)" }, // Red for low income
              { value: 75000, color: "rgba(255, 221, 51, 0.7)" }, // Yellow for medium income
              { value: 100000, color: "rgba(34, 197, 94, 0.7)" }, // Green for high income
            ],
          },
        ],
      },
    });

    map.add(geojsonLayer);

    return () => {
      if (map && geojsonLayer) {
        map.remove(geojsonLayer); // Cleanup
      }
    };
  }, [map]);

  return null;
};

export default IncomeLayer;
