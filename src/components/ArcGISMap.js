import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
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
        : `${process.env.PUBLIC_URL}/zip_codes.geojson`;

    // Renderer for census tracts with adoption status colors
    const renderer = {
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

    // Add the new layer
    const layer = new GeoJSONLayer({
      url: geojsonUrl,
      title: selectedLayer === "censusTracts" ? "Census Tracts" : "Zip Codes",
      renderer: selectedLayer === "censusTracts" ? renderer : undefined,
      popupTemplate: {
        title: "{NAMELSAD}",
        content: `
          <b>ID:</b> {GEOID}<br>
          <b>Land Area:</b> {ALAND} sq. meters<br>
          <b>Water Area:</b> {AWATER} sq. meters<br>
          ${
            selectedLayer === "censusTracts"
              ? `
            <b>Adopted By:</b> {adopted_by}<br>
            <b>Last Updated Date:</b> {last_updated_date}<br>
          `
              : ""
          }
        `,
      },
    });

    map.add(layer);
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
    // Implement search functionality based on searchField and searchValue
    console.log(`Searching for ${searchField}: ${searchValue}`);
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>

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

      {/* Search Bar */}
      <div style={{ position: "absolute", bottom: "100px", left: "20px", zIndex: 1000 }}>
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
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
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

      {/* Admin View Indicator */}
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "16px",
            zIndex: 1000,
          }}
        >
          Admin View Active
        </div>
      )}
    </div>
  );
};

export default ArcGISMap;
