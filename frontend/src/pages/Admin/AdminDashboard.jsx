// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">

      {/* 🔹 LOGOUT BUTTON (Top Right) */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center space-x-2 
                   text-red-600 border border-red-600 px-4 py-2 rounded-lg 
                   font-semibold hover:bg-red-50 transition"
      >
        <FaSignOutAlt size={16} />
        <span>Logout</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/admin/create-election")}
        >
          <h3 className="text-xl font-semibold">Create Election</h3>
        </div>

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/admin/manage-elections")}
        >
          <h3 className="text-xl font-semibold">Manage Elections</h3>
        </div>

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/admin/add-candidate")}
        >
          <h3 className="text-xl font-semibold">Add Candidate</h3>
        </div>

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/admin/manage-candidates")}
        >
          <h3 className="text-xl font-semibold">Manage Candidates</h3>
        </div>

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/admin/analytics")}
        >
          <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
        </div>

      </div>
    </div>
  );
}
