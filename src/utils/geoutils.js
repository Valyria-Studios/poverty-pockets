import * as geojsonLookup from 'geojson-geometries-lookup';

export const getBayAreaGeoJSON = (caCounties) => {
  const bayAreaCounties = [
    'Alameda',
    'Contra Costa',
    'Marin',
    'Napa',
    'San Francisco',
    'San Mateo',
    'Santa Clara',
    'Solano',
    'Sonoma'
  ];

  const lookup = geojsonLookup(caCounties); 

  const bayAreaGeoJSON = {
    type: 'FeatureCollection',
    features: caCounties.features.filter(county => {
      const countyName = county.properties.COUNTY_NAME; 
      return bayAreaCounties.includes(countyName);
    })
  };

  return bayAreaGeoJSON;
};