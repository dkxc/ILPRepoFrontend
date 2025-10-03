import { hydrateRoot } from "react-dom/client";
import "./index.css";
import { HydratedRouter } from "react-router/dom";
import React from "react";

hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
