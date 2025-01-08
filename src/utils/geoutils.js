import * as geojsonLookup from "geojson-geometries-lookup";

export const getBayAreaGeoJSON = (caCounties) => {
  const bayAreaCounties = [
    "Alameda",
    "Contra Costa",
    "Marin",
    "Napa",
    "San Francisco",
    "San Mateo",
    "Santa Clara",
    "Solano",
    "Sonoma",
  ];

  const bayAreaCountyFIPS = {
    Alameda: "06001",
    "Contra Costa": "06013",
    Marin: "06041",
    Napa: "06055",
    "San Francisco": "06075",
    "San Mateo": "06081",
    "Santa Clara": "06085",
    Solano: " 06095",
    Sonoma: "06097",
  };

  const lookup = geojsonLookup(caCounties);

  const bayAreaGeoJSON = {
    type: "FeatureCollection",
    features: caCounties.features.filter((county) => {
      const countyName = county.properties.COUNTY_NAME;
      return bayAreaCounties.includes(countyName);
    }),
  };

  return bayAreaGeoJSON;
};
