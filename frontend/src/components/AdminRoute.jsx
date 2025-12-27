// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const adminRole = localStorage.getItem("adminRole");
  const adminData = JSON.parse(localStorage.getItem("admin") || "null");

  const isAdmin = adminRole === "ADMIN" && adminData !== null;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
