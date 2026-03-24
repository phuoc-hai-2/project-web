import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute() {
  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
  } catch {
    userInfo = null;
  }
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
export default ProtectedRoute;
