import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Create a new map instance
    const newMap = new Map({
      basemap: "topo-vector", // Use the "topo-vector" basemap
    });

    // Create the MapView instance
    const view = new MapView({
      container: viewDivRef.current,
      map: newMap,
      zoom: 10,
      center: [-122.0081095, 37.5371513], // Center based on GeoJSON
    });

    // Save the map instance in state
    setMap(newMap);

    // Cleanup on unmount
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`; // Path to GeoJSON file

  return (
    <div style={{ height: "100vh", width: "100vw" }} ref={viewDivRef}>
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}
    </div>
  );
};

export default ArcGISMap;
