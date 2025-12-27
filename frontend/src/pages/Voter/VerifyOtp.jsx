import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import otpApi from "../../api/otpApi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?voterId=123 from URL
  const queryParams = new URLSearchParams(location.search);
  const voterId = queryParams.get("voterId");

  const [otp, setOtp] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [electionId, setElectionId] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!voterId) {
      setMessage("❌ Missing Voter ID. Go back and request OTP again.");
      return;
    }

    try {
      const res = await otpApi.verifyOtp(
        voterId,
        otp,
        electionId,
        candidateName
      );

      setMessage("✅ Vote Successfully Cast!");

      setTimeout(() => {
        navigate("/vote-success");
      }, 1500);

    } catch (error) {
      setMessage("❌ Invalid or Expired OTP");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>

        <p className="text-sm text-center text-gray-600 mb-4">
          Voting for Election ID: <strong>{electionId || "Enter Below"}</strong>
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Election ID"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Verify & Vote
          </button>

          {message && (
            <p className="text-center text-sm text-red-600 mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
