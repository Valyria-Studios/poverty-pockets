import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const SearchBox = ({ searchField, setSearchField, searchValue, setSearchValue, onSearch }) => (
  <div style={{ position: "absolute", bottom: "100px", left: "20px", zIndex: 1000 }}>
    <form
      onSubmit={onSearch}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "250px",
      }}
    >
      <label style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Search By:
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="P1_001N">Total Population</option>
          <option value="DP03_0004PE">Employment Rate</option>
          <option value="DP02_0001E">Total Households</option>
          <option value="S1901_C01_012E">Median Household Income</option>
          <option value="H1_001N">Total Housing Units</option>
          <option value="S1501_C02_015E">Bachelor's Degree or Higher</option>
          <option value="S2701_C03_001E">Without Health Care Coverage</option>
        </select>
      </label>

      <label style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Value:
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter search value"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Search
      </button>
    </form>
  </div>
);

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("censusTracts"); // Toggle state: "censusTracts" or "zipCodes"
  const [searchField, setSearchField] = useState("P1_001N");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const newMap = new Map({
      basemap: "topo-vector",
    });

    const mapView = new MapView({
      container: viewDivRef.current,
      map: newMap,
      zoom: 10,
      center: [-122.0081095, 37.5371513],
    });

    setMap(newMap);
    setView(mapView);

    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !view) return;

    // Remove existing layers
    map.removeAll();

    // Set the GeoJSON URL based on the selected layer
    const geojsonUrl =
      selectedLayer === "censusTracts"
        ? `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`
        : `${process.env.PUBLIC_URL}/BayAreaZipCodes.geojson`;

    // Renderer for the census tract layer
    const censusTractRenderer = {
      type: "unique-value",
      field: "adoption_status",
      defaultSymbol: {
        type: "simple-fill",
        color: "rgba(200, 200, 200, 0.5)", // Default gray for undefined
        outline: {
          color: "black",
          width: 1,
        },
      },
      uniqueValueInfos: [
        {
          value: "adopted",
          symbol: {
            type: "simple-fill",
            color: "rgba(34, 197, 94, 0.6)", // Green
            outline: {
              color: "black",
              width: 1,
            },
          },
        },
        {
          value: "not adopted",
          symbol: {
            type: "simple-fill",
            color: "rgba(255, 69, 58, 0.6)", // Red
            outline: {
              color: "black",
              width: 1,
            },
          },
        },
      ],
    };

    // Renderer for the zip code layer
    const zipCodeRenderer = {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(0, 0, 0, 0)", // Transparent fill
        outline: {
          color: "black",
          width: 1,
        },
      },
    };

    // Add the new layer
    const layer = new GeoJSONLayer({
      url: geojsonUrl,
      title: selectedLayer === "censusTracts" ? "Census Tracts" : "Zip Codes",
      renderer: selectedLayer === "censusTracts" ? censusTractRenderer : zipCodeRenderer,
    });

    layer
      .when(() => {
        view.goTo(layer.fullExtent).catch((error) => {
          console.error("Error zooming to layer extent:", error);
        });
      })
      .catch((error) => {
        console.error(`Error loading layer "${layer.title}":`, error);
      });

    map.add(layer);
  }, [selectedLayer, map, view]);

  const toggleLayer = () => {
    setSelectedLayer((prevLayer) =>
      prevLayer === "censusTracts" ? "zipCodes" : "censusTracts"
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for ${searchField}: ${searchValue}`);
    // Add logic to perform the search and highlight features.
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>

      {/* Visual Indicator for Admin View */}
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          Admin View Active
        </div>
      )}

      {/* Layer Toggle Button */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 1000 }}>
        <button
          onClick={toggleLayer}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {selectedLayer === "censusTracts"
            ? "Switch to Zip Code View"
            : "Switch to Census Tract View"}
        </button>
      </div>

      {/* Search Box Component */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ArcGISMap;
