import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function RequiredAuth(props) {
  const { children } = props;
  const { isAuthenticated } = useAuthContext();
  const token = localStorage.getItem("token");

  return isAuthenticated && token ? children : <Navigate to="/login" />;
}
