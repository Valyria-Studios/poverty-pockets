import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import supabase from "./supabaseClient"; // Import Supabase client

// Log to ensure Supabase is initialized correctly
console.log("Supabase initialized:", supabase);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
