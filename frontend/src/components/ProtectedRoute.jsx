import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userInfo");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}
export default ProtectedRoute;
