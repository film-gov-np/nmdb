import { Navigate, Outlet } from "react-router-dom";
import * as PropTypes from "prop-types";

const ProtectedRoute = ({ isPublic, isAuthorized }) => {
  return isPublic || isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  isPublic: PropTypes.bool,
  isAuthorized: PropTypes.bool,
};
export default ProtectedRoute;
