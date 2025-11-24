import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GetTokenFromCookie, GetRoleFromCookie } from "../utils";

const PublicRoutes = () => {
  const token = GetTokenFromCookie();
  const role = GetRoleFromCookie();

  if (token) {
    if (role === 'fleet_manager') {
      return <Navigate to="/fleet/dashboard" />;
    } else if (role === 'shop_owner') {
      return <Navigate to="/shop-owner/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return <Outlet />;
};

export default PublicRoutes;
