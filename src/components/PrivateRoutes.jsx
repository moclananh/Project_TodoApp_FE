import { Navigate } from "react-router-dom";
import { useAuth } from "./forms/AuthContext";

export function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/auth/login" replace />;
}
