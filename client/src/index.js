import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import { CartContextProvider } from "./context/cartContext";

import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

import App from "./App";

render(
  <UserContextProvider>
    <CartContextProvider>
      <Router>
        <App />
      </Router>
    </CartContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);
