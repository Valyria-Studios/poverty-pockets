import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { performSearch } from "../utils/searchUtil";

const SearchBox = ({
    searchField,
    setSearchField,
    searchValue,
    setSearchValue,
    onSearch,
    selectedLayer,
    searchStatus,
}) => (
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
                    {selectedLayer === "censusTracts" ? (
                        <>
                            <option value="P1_001N">Total Population</option>
                            <option value="DP03_0004PE">Employment Rate</option>
                            <option value="DP02_0001E">Total Households</option>
                            <option value="S1901_C01_012E">Median Household Income</option>
                        </>
                    ) : (
                        <>
                            <option value="ZIP_CODE">Zip Code</option>
                            <option value="PO_NAME">Post Office Name</option>
                        </>
                    )}
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

            {searchStatus && (
                <div style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}>
                    {searchStatus}
                </div>
            )}
        </form>
    </div>
);

const ArcGISMap = () => {
    const viewDivRef = useRef(null);
    const [map, setMap] = useState(null);
    const [view, setView] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState("censusTracts");
    const [searchField, setSearchField] = useState("P1_001N");
    const [searchValue, setSearchValue] = useState("");
    const geoJsonLayerRef = useRef(null);
    const [layerLoaded, setLayerLoaded] = useState(false);
    const [searchStatus, setSearchStatus] = useState("");

    useEffect(() => {
        const newMap = new Map({ basemap: "topo-vector" });

        const mapView = new MapView({
            container: viewDivRef.current,
            map: newMap,
            zoom: 10,
            center: [-122.0081095, 37.5371513],
        });

        setMap(newMap);
        setView(mapView);

        return () => {
            if (mapView) mapView.destroy();
        };
    }, []);

    useEffect(() => {
        if (!map || !view) return;

        map.removeAll();

        const geojsonUrl =
            selectedLayer === "censusTracts"
                ? `${process.env.PUBLIC_URL}/bay_area_tracts_geometry.geojson`
                : `${process.env.PUBLIC_URL}/BayAreaZipCodes.geojson`;

        const geoJsonLayer = new GeoJSONLayer({
            url: geojsonUrl,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-fill",
                    color: "rgba(255, 0, 0, 0.3)",
                    outline: {
                        color: "black",
                        width: 1,
                    },
                },
            },
            popupTemplate: {
                title: selectedLayer === "censusTracts" ? "Census Tract: {NAMELSAD}" : "Zip Code: {ZIP_CODE}",
                content: selectedLayer === "censusTracts"
                    ? "<b>Total Population:</b> {P1_001N}<br><b>Employment Rate:</b> {DP03_0004PE}%"
                    : "<b>Post Office Name:</b> {PO_NAME}<br><b>Total Population:</b> {POPULATION}",
            },
        });

        geoJsonLayerRef.current = geoJsonLayer;

        geoJsonLayer.when(() => {
            view.goTo(geoJsonLayer.fullExtent);
            setLayerLoaded(true);
        }).catch((error) => console.error("Error loading GeoJSON layer:", error));

        map.add(geoJsonLayer);

        view.on("click", (event) => {
            view.hitTest(event).then((response) => {
                const result = response.results.find((res) => res.graphic.layer === geoJsonLayer);
                if (result) {
                    view.popup.open({ location: event.mapPoint, features: [result.graphic] });
                } else {
                    console.warn("No feature found on click.");
                }
            });
        });
    }, [selectedLayer, map, view]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchStatus("");

        if (!layerLoaded) {
            setSearchStatus("Layer is still loading. Please wait and try again.");
            return;
        }

        const result = await performSearch({
            view,
            geoJsonLayer: geoJsonLayerRef.current,
            searchField,
            searchValue,
        });

        if (!result.success) {
            console.error("Search error:", result.message);
            setSearchStatus(result.message);
        }
    };

    const toggleLayer = () => {
        setSelectedLayer((prev) => (prev === "censusTracts" ? "zipCodes" : "censusTracts"));
    };

    return (
        <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
            <div ref={viewDivRef} style={{ height: "100%", width: "100%" }}></div>

            <SearchBox
                searchField={searchField}
                setSearchField={setSearchField}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onSearch={handleSearch}
                selectedLayer={selectedLayer}
                searchStatus={searchStatus}
            />

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

export default ArcGISMap;
