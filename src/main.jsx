import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

const basename = import.meta.env.VITE_BASENAME || "/";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={basename}>
        <App />
    </BrowserRouter>
);
