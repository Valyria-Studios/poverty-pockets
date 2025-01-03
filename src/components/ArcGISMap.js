import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import "@arcgis/core/assets/esri/themes/light/main.css";
import IncomeLayer from "./IncomeLayer";
import Legend from "./Legend";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import { getBayAreaGeoJSON } from '../utils/geoUtils';

const ArcGISMap = () => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      basemap: "topo-vector", 
    });

    const view = new MapView({
      container: mapDivRef.current,
      map: map,
      zoom: 11,
      center: [-121.8863, 37.3382], 
    });

    fetch(`${process.env.PUBLIC_URL}/san_jose_tracts.geojson`)
      .then(response => response.json())
      .then(caCounties => { 
        const bayAreaGeoJSON = getBayAreaGeoJSON(caCounties);

        // Add the Bay Area counties GeoJSON Layer
        const bayAreaLayer = new GeoJSONLayer({
          data: bayAreaGeoJSON, 
          renderer: { 
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: [226, 119, 40, 0.75], // Example: Semi-transparent orange fill
              outline: {
                color: "white", 
                width: 1 
              }
            }
          }
        });

        map.add(bayAreaLayer);

        // Add boundary GeoJSON Layer for tract borders 
        const boundaryLayer = new GeoJSONLayer({
          url: `${process.env.PUBLIC_URL}/san_jose_tracts.geojson`, 
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: "rgba(0, 0, 0, 0)", // Transparent fill
              outline: {
                color: "black", 
                width: 1.5, 
              },
            },
          },
        });

        map.add(boundaryLayer); 

        // Zoom to the Bay Area 
        view.goTo({
          target: bayAreaGeoJSON, 
          zoom: 8  
        });
      })
      .catch(error => {
        console.error("Error loading GeoJSON data:", error);
      }); 

    mapRef.current = map;

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div ref={mapDivRef} style={{ height: "100%", width: "100%" }}></div>
      {mapRef.current && <IncomeLayer map={mapRef.current} />}
      <Legend />
    </div>
  );
};

export default ArcGISMap;