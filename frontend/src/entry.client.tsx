import { hydrateRoot } from "react-dom/client";
import "./index.css";
import { HydratedRouter } from "react-router/dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import apiClient from "@lib/api/apiClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const endpoint = queryKey[0];
        if (typeof endpoint !== "string") {
          throw new Error("Query key must be a string");
        }
        return apiClient(endpoint);
      },
    },
  },
});

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
