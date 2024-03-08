import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/residentlogin");
 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const role = storedUser?.role;

    if (role === "resident" || role === "officer" || role === "president" || role === "vicepresident" || role === "secretary" || role === "treasurer") {
      setUserRole(role);
    } else {
      setRedirectPath("/residentlogin");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to={"/residentlogin"} replace />;
  }

  
  if (roles && !roles.includes(userRole)) {
    if (userRole === "resident") {
      return <Navigate to="/residentdashboard" replace />;
    } else if (userRole === "officer") {
      return <Navigate to="/officerdashboard" replace />;
    } else if (userRole === "president"){
      return <Navigate to="/presidentdashboard" replace />;
    } else if (userRole === "vicepresident"){
      return <Navigate to="/vicepresidentdashboard" replace />;
    } else if (userRole === "secretary"){
      return <Navigate to="/secretarydashboard" replace />;
    } else if (userRole === "treasurer"){
      return <Navigate to="/treasurerdashboard" replace />;
    } else if (userRole === ""){
      return <Navigate to="/adminlogin" replace />;
    }
  }

  return children;
}
