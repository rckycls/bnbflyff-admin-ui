import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { PageLoaderProvider } from "./context/PageLoaderContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PageLoaderProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PageLoaderProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
