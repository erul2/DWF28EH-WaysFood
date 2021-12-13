import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [state, dispatch] = useContext(UserContext);
  return state.isLogin || localStorage.token ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
}
