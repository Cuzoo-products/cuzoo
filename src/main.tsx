import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "./routes/routes";
import { ThemeProvider } from "./components/utilities/themeProvider";
import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="cuzoo-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  </StrictMode>
);
