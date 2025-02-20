import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// API Route to Fetch Census Data
app.get('/api/census', async (req, res) => {
    try {
        const { state = "06", county = "*" } = req.query;

        const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B17021_002E&for=tract:*&in=state:${state}&in=county:${county}&key=552ea3b92e92139a47a2ce35fe5510f281951e0e`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Census API Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
