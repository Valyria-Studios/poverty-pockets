import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import Legend from "./Legend"; // Import the Legend component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    // Create a new map instance
    const newMap = new Map({
      basemap: "topo-vector", // Use the "topo-vector" basemap
    });

    // Create the MapView instance
    const mapView = new MapView({
      container: viewDivRef.current,
      map: newMap,
      zoom: 10,
      center: [-122.0081095, 37.5371513], // Center based on GeoJSON
    });

    // Save the map and view instances in state
    setMap(newMap);
    setView(mapView);

    // Cleanup on unmount
    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`; // Path to GeoJSON file

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Map container */}
      <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>
      {/* Add Income Layer */}
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}
      {/* Add Legend */}
      {view && <Legend />}
    </div>
  );
};

export default ArcGISMap;
