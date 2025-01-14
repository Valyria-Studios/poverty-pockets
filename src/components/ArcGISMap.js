import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import IncomeLayer from "./IncomeLayer"; // Import the IncomeLayer component
import AdminPanel from "./AdminPanel"; // Import the AdminPanel component
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const ArcGISMap = () => {
  const viewDivRef = useRef(null); // Reference for the map container
  const [map, setMap] = useState(null); // State for the map instance
  const [isAdmin, setIsAdmin] = useState(false); // Admin login state
  const [showLogin, setShowLogin] = useState(false); // Toggle login form visibility
  const [username, setUsername] = useState(""); // Username input state
  const [password, setPassword] = useState(""); // Password input state

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

    // Set the map instance in state
    setMap(newMap);

    // Cleanup on component unmount
    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  const geojsonUrl = `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`; // Path to the GeoJSON file

  // Function to handle login
  const handleLogin = () => {
    const adminUsername = "admin";
    const adminPassword = "password123";

    if (username === adminUsername && password === adminPassword) {
      setIsAdmin(true);
      setShowLogin(false); // Hide login form after successful login
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Map container */}
      <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>

      {/* Add Income Layer */}
      {map && <IncomeLayer map={map} geojsonUrl={geojsonUrl} />}

      {/* Admin Toggle */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        {!isAdmin && (
          <button onClick={() => setShowLogin(!showLogin)} style={{ padding: "10px", borderRadius: "5px" }}>
            {showLogin ? "Close Login" : "Admin Login"}
          </button>
        )}
      </div>

      {/* Login Form */}
      {showLogin && !isAdmin && (
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            left: "20px",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>Admin Login</h4>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <button onClick={handleLogin} style={{ padding: "10px", width: "100%" }}>
            Login
          </button>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && <AdminPanel map={map} />}
    </div>
  );
};

export default ArcGISMap;
