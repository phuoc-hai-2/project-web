import {  Outlet } from "react-router-dom";

import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userInfo");
  if (!token) {
    return <Navigate to="/" />;
  }
  // return children;
  return <Outlet />;
}
export default ProtectedRoute;
