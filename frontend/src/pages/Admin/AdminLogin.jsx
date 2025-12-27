// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await adminApi.login(username, password);

      // === Robust token extraction ===
      // Common shapes:
      // 1) { token: "..." }
      // 2) { accessToken: "..." }
      // 3) { admin: { ..., token: "..."}, token: "..." }
      // 4) sometimes backend returns the token string directly (rare)
      const payload = res?.data;
      let token = null;
      let adminObj = null;

      if (!payload) {
        throw new Error("Empty login response");
      }

      // If payload is a string, assume it's the token
      if (typeof payload === "string") {
        token = payload;
      } else {
        token =
          payload.token ||
          payload.accessToken ||
          payload?.admin?.token ||
          (typeof payload === "string" ? payload : null);
        // admin object fallback
        adminObj = payload.admin || payload;
      }

      // Save token and admin info
      if (token) {
        localStorage.setItem("adminToken", token);
      } else {
        // If there's no token, still store admin object (but warn)
        console.warn("Admin login did not return a token:", payload);
      }

      if (adminObj) {
        try {
          localStorage.setItem("admin", JSON.stringify(adminObj));
        } catch (err) {
          localStorage.setItem("admin", JSON.stringify({ username }));
        }
      }

      // also keep a role marker for convenience
      localStorage.setItem("adminRole", "ADMIN");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed:", err);
      // Try to read server message
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      setMessage("❌ " + serverMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md bg-white rounded-lg shadow p-6 w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        {message && <p className="text-red-600 mb-3 text-center">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          New Admin?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/admin/register")}
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
}
