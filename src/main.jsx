import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { StyledEngineProvider } from "@mui/material/styles";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import "./index.scss";
// disableReactDevTools();

const queryString = window.location.search;

if (queryString.includes("firstLogin=true")) {
  localStorage.setItem("firstLogin", true);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);
