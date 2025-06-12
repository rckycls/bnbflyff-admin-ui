import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const useAuth = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsPageLoading(true);
        const res = await axiosClient.get("/auth/me"); // or "/api/me"
        setAuthenticated(res.data.success);
      } catch {
        setAuthenticated(false);
      } finally {
        setIsPageLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isPageLoading };
};

export default useAuth;
