import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
// import GenerateReport from "./components/GenerateReport"; // Import the GenerateReport component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null);
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("censusTracts"); // Toggle state: "censusTracts" or "zipCodes"
  const [searchField, setSearchField] = useState("tract_id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]); // To store selected features for the report

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
      popupTemplate:
        selectedLayer === "censusTracts"
          ? {
              title: "Census Tract: {NAMELSAD}",
              content: `
                <b>Total Population:</b> {P1_001N}<br>
                <b>Employment Rate:</b> {DP03_0004PE}%<br>
                <b>Total Households:</b> {DP02_0001E}<br>
                <b>Median Household Income:</b> $ {S1901_C01_012E}<br>
                <b>Total Housing Units:</b> {H1_001N}<br>
                <b>Bachelor's Degree or Higher:</b> {S1501_C02_015E}%<br>
                <b>Without Health Care Coverage:</b> {S2701_C03_001E}%<br>
                <b>Hispanic or Latino (of any race):</b> {P9_003N}<br>
              `,
            }
          : {
              title: "Zip Code: {popup_zip_code}",
              content: `
                <b>Total Population:</b> {number}<br>
                <b>Employment Rate:</b> {employent_rate} <br>
                <b>Total Households:</b> {households} <br>
                <b>Median Household Income:</b> $ {S1901_C01_012E}<br>
                <b>Total Housing Units:</b> {H1_001N}<br>
                <b>Bachelor's Degree or Higher:</b> {S1501_C02_015E}%<br>
                <b>Without Health Care Coverage:</b> {S2701_C03_001E}%<br>
                <b>Hispanic or Latino (of any race):</b> {P9_003N}<br>
              `,
            },
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

    // Add selection logic for report
    view.on("click", (event) => {
      view.hitTest(event).then((response) => {
        if (response.results.length) {
          const selected = response.results.map((res) => res.graphic.attributes);
          setSelectedFeatures((prev) => [...prev, ...selected]);
        }
      });
    });
  }, [selectedLayer, map, view]);

  const toggleLayer = () => {
    setSelectedLayer((prevLayer) =>
      prevLayer === "censusTracts" ? "zipCodes" : "censusTracts"
    );
  };

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "password123") {
      setIsAdmin(true);
      setShowLogin(false);
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for ${searchField}: ${searchValue}`);
    // Add logic to highlight and zoom to searched area.
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

      
    </div>
  );
};

console.log("Path to GenerateReport:", require.resolve("./GenerateReport"));


export default ArcGISMap;
