import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is stored in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/auth/login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const logout = () => {
    // Clear user data from local storage and update state
    localStorage.removeItem("token");
    setToken(null);
    navigate("/auth/login");
  };

  return <AuthContext.Provider value={{ token, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
