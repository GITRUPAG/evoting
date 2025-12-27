import React, { useState } from "react";
import voterApi from "../../api/voterApi";
import { useNavigate } from "react-router-dom";

export default function RequestOtp() {
  const [voterId, setVoterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!voterId) {
      setMessage("⚠️ Please enter your Voter ID");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Correct API call
      await voterApi.requestOtp(voterId);

      setMessage("✅ OTP sent! Check your email.");

      setTimeout(() => {
        navigate(`/voter/verify-otp?voterId=${voterId}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Request OTP to Cast Vote</h1>

        {message && (
          <div className="mb-4 p-3 rounded text-center bg-blue-50 text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Voter ID</label>
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            placeholder="Enter your Voter ID"
            className="w-full border p-3 rounded mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Sending OTP..." : "Request OTP"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have OTP?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/voter/verify-otp")}
          >
            Verify Here
          </span>
        </p>
      </div>
    </div>
  );
}
