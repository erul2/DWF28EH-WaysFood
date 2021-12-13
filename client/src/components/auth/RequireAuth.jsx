import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [state, dispatch] = useContext(UserContext);
  console.log("auth");
  console.log(state);
  return state.isLogin || localStorage.token ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
}
