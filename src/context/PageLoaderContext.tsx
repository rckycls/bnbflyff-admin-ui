import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type PageLoaderContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const PageLoaderContext = createContext<PageLoaderContextType | undefined>(
  undefined
);

export const PageLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Loading...");

  return (
    <PageLoaderContext.Provider
      value={{ loading, setLoading, message, setMessage }}
    >
      {children}
    </PageLoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(PageLoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within an PageLoaderProvider");
  }
  return context;
};
