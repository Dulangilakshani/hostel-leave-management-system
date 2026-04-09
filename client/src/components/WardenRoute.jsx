import React from "react";
import { Navigate } from "react-router-dom";

function WardenRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "warden") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default WardenRoute;