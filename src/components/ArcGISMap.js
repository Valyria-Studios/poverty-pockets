import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import Legend from "./Legend"; // Import the Legend component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null); // State to hold the map instance

  useEffect(() => {
    // Create a new map instance
    const newMap = new Map({
      basemap: "topo-vector" // Use the "topo-vector" basemap
    });

    // Create the MapView instance
    const view = new MapView({
      container: viewDivRef.current, // Reference to the map's container div
      map: newMap,
      zoom: 10, // Adjust zoom level for better view
      center: [-121.8863, 37.3382] // Center on San Jose, CA
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

  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_data.geojson`; // GeoJSON URL

  return (
    <div
      style={{
        position: "relative", // Ensure the legend can be positioned within the map
        height: "100vh",
        width: "100vw"
      }}
      ref={viewDivRef}
    >
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}
      <Legend /> {/* Add the Legend component */}
    </div>
  );
};

export default ArcGISMap;
