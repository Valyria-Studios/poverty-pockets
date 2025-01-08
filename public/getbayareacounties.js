import { readFileSync, writeFileSync } from "fs";

// Bay Area county FIPS codes
const bayAreaCountyFIPS = {
  Alameda: "06001",
  "Contra Costa": "06013",
  Marin: "06041",
  Napa: "06055",
  "San Francisco": "06075",
  "San Mateo": "06081",
  "Santa Clara": "06085",
  Solano: "06095",
  Sonoma: "06097",
};

// Function to filter GeoJSON data
function filterBayAreaTracts(inputFilePath, outputFilePath) {
  // Read the GeoJSON file
  const geojsonData = JSON.parse(readFileSync(inputFilePath, "utf-8"));

  // Filter features based on COUNTYFP matching Bay Area FIPS codes
  const filteredFeatures = geojsonData.features.filter((feature) =>
    Object.values(bayAreaCountyFIPS).includes(
      feature.properties.STATEFP + feature.properties.COUNTYFP
    )
  );

  // Create a new GeoJSON object
  const filteredGeoJSON = {
    type: "FeatureCollection",
    name: geojsonData.name,
    crs: geojsonData.crs,
    features: filteredFeatures,
  };

  // Write the filtered GeoJSON to a new file
  writeFileSync(
    outputFilePath,
    JSON.stringify(filteredGeoJSON, null, 2),
    "utf-8"
  );

  console.log(`Filtered GeoJSON saved to ${outputFilePath}`);
}

// Example usage
const inputFilePath = "san_jose_tracts.geojson";
const outputFilePath = "bay_area_tracts_geometry.geojson";
filterBayAreaTracts(inputFilePath, outputFilePath);
