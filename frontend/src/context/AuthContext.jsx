import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("momentum_token") || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user from token on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("momentum_user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("momentum_token", authToken);
    localStorage.setItem("momentum_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("momentum_token");
    localStorage.removeItem("momentum_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("momentum_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
