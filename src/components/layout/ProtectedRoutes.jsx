import { Navigate, Outlet, useLocation } from "react-router-dom";
import Proptypes from "prop-types";

export default function ProtectedRoutes({ isAllowed, redirectPath }) {
  const queryString = window.location.search;

  if (queryString.includes("firstLogin=true")) {
    localStorage.setItem("firstLogin", true);
  }
  const Location = useLocation();
  if (!isAllowed)
    return <Navigate to={redirectPath} replace state={{ from: Location }} />;
  return <Outlet />;
}

ProtectedRoutes.proptypes = {
  isAloowed: Proptypes.bool.isRequired,
  redirectPath: Proptypes.string.isRequired,
};
