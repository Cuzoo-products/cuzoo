import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "./routes/routes";
import { ThemeProvider } from "./components/utilities/themeProvider";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "./styles/admin-portal.css";
import "./styles/fleet-portal.css";
import "./styles/auth-portal.css";
import "./styles/google-places.css";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import "./firebase";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="cuzoo-ui-theme">
          <RouterProvider router={routes} />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
