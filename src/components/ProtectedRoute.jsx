import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/authService";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth_user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes cache validity
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ direction: "rtl" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="fw-bold text-muted">جاري التحقق من الصلاحيات...</h5>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated or is not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // Render child routes
  return <Outlet />;
}
