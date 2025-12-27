import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await adminApi.register(form);
      setMessage("✅ Admin registered successfully!");

      setTimeout(() => navigate("/admin/login"), 1200);

    } catch (err) {
      setMessage("❌ Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md bg-white rounded-lg shadow p-6 w-full">

        <h2 className="text-2xl font-bold mb-4 text-center">Admin Registration</h2>

        {message && (
          <p className="text-center mb-3 font-semibold text-indigo-600">
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            name="username"
            placeholder="Enter admin username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter admin password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            Register
          </button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already an admin?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
