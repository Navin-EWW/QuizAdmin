import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function ProtectedRoute(props: { Component: any }) {
  const { token } = useAuthStore();



  const { Component } = props;
  return token ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute;
