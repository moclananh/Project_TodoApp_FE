import { Navigate } from "react-router-dom";
import { useAuth } from "./forms/AuthContext";

export function PrivateRoute({ children }) {
  const storedToken = localStorage.getItem("token");

  return storedToken ? children : <Navigate to="/auth/login" replace />;
}
