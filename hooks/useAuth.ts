// src/hooks/useAuth.js
// In a real app, this hook would handle authentication logic,
// potentially making API calls, managing tokens, etc.
import { useState, useEffect } from "react";

const useAuth = () => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [user, setUser] = useState<{name: string, id: string} | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            setTimeout(() => {
                  const storedToken = localStorage.getItem("authToken");
                  if (storedToken === "valid-token-123") {
                        setIsAuthenticated(true);
                        setUser({ name: "Logged In User", id: "abc" });
                  } else {
                        setIsAuthenticated(false);
                        setUser(null);
                  }
                  setLoading(false);
            }, 100);
      }, []);

      const login = () => {
            localStorage.setItem("authToken", "valid-token-123");
            setIsAuthenticated(true);
            setUser({ name: "Logged In User", id: "abc" });
      };

      const logout = () => {
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
            setUser(null);
      };

      return { isAuthenticated, user, loading, login, logout };
};

export default useAuth;
