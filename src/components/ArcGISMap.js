import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import '@arcgis/core/assets/esri/themes/light/main.css'; // Import ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null); // Reference to map container div
  const tableDivRef = useRef(null); // Reference to feature table container div
  const [isTableVisible, setIsTableVisible] = useState(true);

  useEffect(() => {
    // Initialize the map and view
    const map = new Map({
      basemap: 'topo-vector'
    });

    const view = new MapView({
      container: viewDivRef.current,
      map: map,
      zoom: 10,
      center: [-121.8863, 37.3382] // Centered on San Jose
    });

    // Initialize the feature layer (as an example)
    const featureLayer = new FeatureLayer({
      // Example URL - replace with your actual feature layer URL if needed
      url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/LosAngelesNeighborhoods/FeatureServer/0'
    });

    map.add(featureLayer);

    return () => {
      // Cleanup: destroy the view if the component unmounts
      if (view) {
        view.destroy();
      }
    };
  }, []);

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div id="appContainer" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div id="viewDiv" ref={viewDivRef} style={{ flex: 1, width: '100%' }}></div>

      {isTableVisible && (
        <div id="tableContainer" className="container" style={{ display: 'flex', flex: 1, width: '100%' }}>
          <div id="tableDiv" ref={tableDivRef}></div>
        </div>
      )}

      <div id="mainDiv" className="esri-widget" style={{ padding: 8 }}>
        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: 45, height: 22, verticalAlign: 'middle' }}>
          <input
            id="checkboxId"
            type="checkbox"
            checked={isTableVisible}
            onChange={handleToggleTable}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            className="slider round"
            style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isTableVisible ? '#2196f3' : '#ccc',
              transition: '0.4s',
              borderRadius: 20
            }}
          >
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: 20,
                width: 20,
                left: isTableVisible ? '23px' : '3px',
                bottom: 1,
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%'
              }}
            ></span>
          </span>
        </label>
        <label className="labelText" id="labelText" style={{ paddingLeft: 5, fontSize: 15 }}>
          {isTableVisible ? 'Hide feature table' : 'Show feature table'}
        </label>
      </div>
    </div>
  );
};

export default ArcGISMap;
