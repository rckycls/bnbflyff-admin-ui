import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { PageLoaderProvider } from "./context/PageLoaderContext.tsx";
import { ModalProvider } from "./context/ModalContext.tsx";
import { ItemTooltipProvider } from "./context/ItemTooltipContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PageLoaderProvider>
            <ItemTooltipProvider>
              <ModalProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </ModalProvider>
            </ItemTooltipProvider>
          </PageLoaderProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
