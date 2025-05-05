"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        // Checking if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
          sessionStorage.removeItem("token");
          setToken(null);
          setUserId(null);
        } else {
          setToken(storedToken);
          setUserId(decoded.userId);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        sessionStorage.removeItem("token");
        setToken(null);
        setUserId(null);
      }
    } else {
      setToken(null);
      setUserId(null);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    try {
      setLoading(true);
      sessionStorage.setItem("token", newToken);
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setUserId(decoded.userId);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      setLoading(true);
      sessionStorage.removeItem("token");
      setToken(null);
      setUserId(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
