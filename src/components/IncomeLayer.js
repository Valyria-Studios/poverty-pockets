import { useEffect } from "react";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const IncomeLayer = ({ map, geojsonUrl }) => {
  useEffect(() => {
    // Define a renderer for adoption status
    const adoptionStatusRenderer = {
      type: "unique-value", // Renderer type for unique values
      field: "adoption_status", // Field in the GeoJSON for adoption status
      defaultSymbol: {
        type: "simple-fill",
        color: "gray", // Default color for undefined status
        outline: {
          color: "black", // Black border for polygons
          width: 1,
        },
      },
      uniqueValueInfos: [
        {
          value: "adopted", // Value for "adopted" status
          symbol: {
            type: "simple-fill",
            color: "rgba(34, 197, 94, 0.7)", // Green for adopted
            outline: {
              color: "black", // Black border
              width: 1,
            },
          },
          label: "Adopted",
        },
        {
          value: "not adopted", // Value for "not adopted" status
          symbol: {
            type: "simple-fill",
            color: "rgba(255, 69, 58, 0.7)", // Red for not adopted
            outline: {
              color: "black", // Black border
              width: 1,
            },
          },
          label: "Not Adopted",
        },
      ],
    };

    // Define a renderer for the borders
    const bordersRenderer = {
      type: "simple", // Simple renderer for polygons
      symbol: {
        type: "simple-fill", // Fill symbol
        color: "rgba(0, 0, 0, 0)", // Transparent fill
        outline: {
          color: "black", // Black border color
          width: 1.5, // Border thickness
        },
      },
    };

    // Create the GeoJSONLayer for income and adoption status
    const incomeAdoptionLayer = new GeoJSONLayer({
      url: geojsonUrl, // URL of the GeoJSON file for income and adoption status
      renderer: adoptionStatusRenderer, // Apply the renderer for adoption status
      popupTemplate: {
        title: "{NAMELSAD}",
        content: `
          <b>GEOID:</b> {GEOID}<br>
          <b>Land Area:</b> {ALAND} sq. meters<br>
          <b>Water Area:</b> {AWATER} sq. meters<br>
          <b>Adoption Status:</b> {adoption_status}
        `,
      },
    });

    // Create the GeoJSONLayer for borders
    const bordersLayer = new GeoJSONLayer({
      url: `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`, // URL of the GeoJSON file for borders
      renderer: bordersRenderer, // Apply the renderer for borders
    });

    // Add the layers to the map
    map.addMany([incomeAdoptionLayer, bordersLayer]);

    // Cleanup: Remove the layers when the component unmounts
    return () => {
      map.removeMany([incomeAdoptionLayer, bordersLayer]);
    };
  }, [map, geojsonUrl]);

  return null; // This component doesn't render any visible DOM
};

export default IncomeLayer;
