import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import Legend from "./Legend"; // Import the Legend component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null); // Reference for the map container
  const [map, setMap] = useState(null); // State for the map instance
  const [view, setView] = useState(null); // State for the MapView instance

  useEffect(() => {
    // Initialize the ArcGIS map
    const newMap = new Map({
      basemap: "topo-vector", // Use the "topo-vector" basemap
    });

    // Initialize the MapView
    const mapView = new MapView({
      container: viewDivRef.current,
      map: newMap,
      zoom: 10,
      center: [-122.0081095, 37.5371513], // Center coordinates (Bay Area)
    });

    // Set the map and view instances in state
    setMap(newMap);
    setView(mapView);

    // Cleanup on component unmount
    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`; // Path to the GeoJSON file

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
