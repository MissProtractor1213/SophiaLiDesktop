import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";                         // keep your global styles
import EscapeRoomDesktop from "./components/EscapeRoomDesktop.js"; // <-- your big component file

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <EscapeRoomDesktop />
  </React.StrictMode>
);
