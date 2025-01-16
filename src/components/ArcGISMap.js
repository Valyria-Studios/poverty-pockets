import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import Graphic from "@arcgis/core/Graphic"; // For highlighting search results
import { fetchCensusData } from "../utils/censusAPI"; // Import Census API utility
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null); // Reference for the map container
  const [map, setMap] = useState(null); // State for the map instance
  const [view, setView] = useState(null); // State for the MapView instance
  const [showLogin, setShowLogin] = useState(false); // State to toggle admin login
  const [isAdmin, setIsAdmin] = useState(false); // State to check admin login status
  const [searchField, setSearchField] = useState("tract_id"); // Default search field
  const [searchValue, setSearchValue] = useState(""); // Search input value
  const [searchResults, setSearchResults] = useState(null); // State for search results

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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!view) return;

    try {
      const year = "2023"; // Example: using ACS 2023 data
      const dataset = "acs/acs5/profile"; // Dataset for variables like employment rate
      const variables = ["NAME", "DP03_0004PE"]; // Example variables (Name, Employment Rate)

      // Assuming state and county codes are fixed for now (update as needed)
      const state = "06"; // California state code
      const county = "013"; // Contra Costa county code

      const data = await fetchCensusData(year, dataset, variables, state, county, searchValue);

      if (data && data.length > 0) {
        const [headers, values] = data;
        const resultObject = headers.reduce((acc, header, index) => {
          acc[header] = values[index];
          return acc;
        }, {});

        setSearchResults(resultObject);

        // Highlight the searched tract on the map
        const layer = view.map.layers.find(
          (layer) => layer.title === "Income and Adoption Layer"
        );

        if (layer) {
          const query = layer.createQuery();
          query.where = `${searchField} = '${searchValue}'`; // Search by field and value
          query.returnGeometry = true;
          query.outFields = ["*"];

          const result = await layer.queryFeatures(query);

          if (result.features.length > 0) {
            const feature = result.features[0];
            view.goTo(feature.geometry); // Zoom to the feature
            view.popup.open({
              title: resultObject.NAME || feature.attributes.NAMELSAD,
              content: `
                <b>GEOID:</b> ${feature.attributes.GEOID || searchValue}<br>
                <b>Land Area:</b> ${feature.attributes.ALAND || "N/A"} sq. meters<br>
                <b>Water Area:</b> ${feature.attributes.AWATER || "N/A"} sq. meters<br>
                <b>Employment Rate:</b> ${resultObject.DP03_0004PE || "N/A"}%<br>
              `,
              location: feature.geometry.centroid || feature.geometry.extent.center,
            });
          } else {
            alert("No matching tract found.");
          }
        }
      } else {
        alert("No data found for the entered value.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Map container */}
      <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>
      {/* Add Income Layer */}
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}

      {/* Search Bar */}
      <div style={{ position: "absolute", bottom: "120px", left: "20px", zIndex: 1000 }}>
        <form
          onSubmit={handleSearch}
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
              <option value="tract_id">Tract ID</option>
              <option value="geoid">GEOID</option>
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

      {/* Admin Controls */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        {isAdmin ? (
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#FF4C4C",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(!showLogin)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {showLogin ? "Close Login" : "Admin Login"}
            </button>
            {showLogin && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  width: "300px",
                  zIndex: 1000,
                }}
              >
                <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const username = e.target.username.value;
                    const password = e.target.password.value;
                    handleLogin(username, password);
                  }}
                >
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Admin View Active
        </div>
      )}
    </div>
  );
};

export default ArcGISMap;
