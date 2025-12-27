// src/pages/Voter/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import voterApi from "../../api/voterApi";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  localStorage.removeItem("token");

  try {
    const res = await voterApi.login(form.email, form.password);

    // Save token & user
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));

    // ⭐ MUST ADD THIS — VOTING INTERFACE RELIES ON voterId
    localStorage.setItem("voterId", res.data.id);

    loginUser(res.data);
    navigate("/home");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setError("Invalid email or password!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-sm">

        <h2 className="text-3xl font-extrabold text-center mb-2 text-indigo-700">
          Welcome Back 👋
        </h2>
        <p className="text-center mb-8 text-gray-500">
          Sign in to access your voter portal.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <div className="mb-6">
            <label>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register Now
          </span>
        </p>

        {/* NEW: Admin Login Button */}
        <p className="text-center mt-4 text-sm text-gray-600">Are you an admin?</p>
        <button
          onClick={() => navigate("/admin/login")}
          className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          I am Admin
        </button>

      </div>
    </div>
  );
}
