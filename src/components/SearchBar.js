import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchField, setSearchField] = useState("tract_id"); // Default search field
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchField, searchValue);
  };

  return (
    <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1000 }}>
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
            {/* Add more parameters here in the future */}
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
};

export default SearchBar;
