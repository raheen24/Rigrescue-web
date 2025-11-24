import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GetTokenFromCookie } from "../utils";

const ProtectedRoutes = () => {
  const token = GetTokenFromCookie();

  return <>{token ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default ProtectedRoutes;
