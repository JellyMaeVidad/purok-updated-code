import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoutes({ children }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (currentUser !== null) {
      setLoading(false);
      setAuthenticated(true);
    }
  }, [currentUser]);

  if (loading) {
    return children; // or a loading spinner or message
  }

  if (authenticated) {
    return <Navigate to="/residentdashboard" replace />;
  }

  return children;
}
