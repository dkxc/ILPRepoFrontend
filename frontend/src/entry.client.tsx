import { hydrateRoot } from "react-dom/client";
import "./index.css";
import { HydratedRouter } from "react-router/dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const prepareAndRender = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    console.log("MSW running...");
    await worker.start();
  }
};

hydrateRoot(
  document,
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydratedRouter />
    </QueryClientProvider>
  </React.StrictMode>,
);

prepareAndRender();
