import { useEffect } from "react";
import { loadModules } from "esri-loader";

const IncomeLayer = ({ view }) => {
  useEffect(() => {
    let incomeLayer;

    loadModules(["esri/layers/FeatureLayer", "esri/renderers/ClassBreaksRenderer"])
      .then(([FeatureLayer, ClassBreaksRenderer]) => {
        // Define renderer to style income levels
        const incomeRenderer = new ClassBreaksRenderer({
          field: "Median_Income", // Update with the actual field name in your dataset
          legendOptions: {
            title: "Median Family Income in Dollars",
          },
          classBreakInfos: [
            {
              minValue: 0,
              maxValue: 60000,
              symbol: {
                type: "simple-fill",
                color: "#f7e1d7", // Light pink
                outline: {
                  color: "#a3a3a3",
                  width: 0.5,
                },
              },
              label: "< $60,000",
            },
            {
              minValue: 60001,
              maxValue: 100000,
              symbol: {
                type: "simple-fill",
                color: "#d39aa0", // Medium purple
                outline: {
                  color: "#a3a3a3",
                  width: 0.5,
                },
              },
              label: "$60,001 - $100,000",
            },
            {
              minValue: 100001,
              maxValue: 200000,
              symbol: {
                type: "simple-fill",
                color: "#8e5c83", // Darker purple
                outline: {
                  color: "#a3a3a3",
                  width: 0.5,
                },
              },
              label: "$100,001 - $200,000",
            },
            {
              minValue: 200001,
              maxValue: Infinity,
              symbol: {
                type: "simple-fill",
                color: "#4b2c4e", // Dark purple
                outline: {
                  color: "#a3a3a3",
                  width: 0.5,
                },
              },
              label: "> $200,000",
            },
          ],
        });

        // Add the FeatureLayer for income levels
        incomeLayer = new FeatureLayer({
          url: "YOUR_FEATURE_LAYER_URL", // Replace with your Feature Layer or GeoJSON URL
          renderer: incomeRenderer,
          outFields: ["*"], // Ensure you fetch all fields, especially Median_Income
          popupTemplate: {
            title: "{Name}", // Replace "Name" with your feature's name field
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "Median_Income", // Replace with your income field name
                    label: "Median Family Income in Dollars",
                    format: {
                      digitSeparator: true,
                      places: 0,
                    },
                  },
                ],
              },
            ],
          },
        });

        // Add the layer to the map's operational layers
        view.map.add(incomeLayer);
      })
      .catch((error) => console.error(error));

    // Cleanup on component unmount
    return () => {
      if (incomeLayer) {
        view.map.remove(incomeLayer);
      }
    };
  }, [view]);

  return null;
};

export default IncomeLayer;
