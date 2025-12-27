// src/pages/voting/VotingInterface.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaPaperPlane,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserTie,
} from "react-icons/fa";

import electionApi from "../../api/electionApi";
import voterApi from "../../api/voterApi";

export default function VotingInterface() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  // Step state: 1 = request OTP, 2 = verify OTP & vote, 3 = confirmation
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);

  // Selection & OTP state
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Feedback
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState(null);

  // voterId from localStorage
  const voterId = localStorage.getItem("voterId");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1) Get election details
        const eRes = await electionApi.getElectionById(electionId);
        setElection(eRes.data);

        // 2) Get candidates for this election
        const cRes = await electionApi.getCandidatesByElection(electionId);
        // Map to simple objects (id, name, party)
        const formatted = cRes.data.map((c) => ({
          id: c.id,
          name: c.name,
          party: c.party || "Independent",
        }));
        setCandidates(formatted);
      } catch (err) {
        console.error("Failed to load election or candidates:", err);
        setError("Failed to load ballot. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [electionId]);

  // Request OTP
  const handleRequestOtp = async () => {
    setError("");
    setMessage("");
    if (!voterId) {
      setError("You must be logged in to request an OTP. Please login first.");
      return;
    }

    try {
      setSendingOtp(true);
      await voterApi.requestOtp(voterId);
      setOtpSent(true);
      setMessage("✅ OTP sent to your email. Enter it below to cast your vote.");
    } catch (err) {
      console.error("requestOtp error:", err);
      setError("Failed to send OTP. Try again or contact support.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP & cast vote
  const handleVerifyAndVote = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!voterId) {
      setError("Missing voter identity. Please login again.");
      return;
    }
    if (!selectedCandidateId) {
      setError("Please select a candidate before verifying OTP.");
      return;
    }
    if (!otp || otp.length === 0) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    const chosen = candidates.find((c) => String(c.id) === String(selectedCandidateId));
    if (!chosen) {
      setError("Selected candidate not found. Please reselect.");
      return;
    }

    try {
      setVerifying(true);

      

      const res = await voterApi.verifyOtp(voterId, otp, electionId, selectedCandidateId);


      // Backend returns plain text with success message and TxHash included in that string.
      // Try to extract tx hash if present (simple heuristic)
      const data = res?.data;
      let foundTx = null;
      if (typeof data === "string") {
        const txMatch = data.match(/TxHash:\s*([A-Za-z0-9x\-_.]+)/i);
        if (txMatch) foundTx = txMatch[1];
      }

      setTxHash(foundTx || null);
      setMessage("✅ Vote successfully cast!");
      setStep(3);
    } catch (err) {
      console.error("verifyOtp error:", err);
      // If backend returned 200 with message but axios treats error otherwise, fallback messaging:
      if (err?.response?.data) {
        setError(String(err.response.data));
      } else {
        setError("OTP verification failed or vote not recorded. " + (err?.message || ""));
      }
    } finally {
      setVerifying(false);
    }
  };

  // Helper: simple single-selection UI
  const renderBallot = () => (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {election?.electionName || election?.title || "Election Ballot"}
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Choose ONE candidate below and then request an OTP to confirm your identity.
      </p>

      <div className="space-y-3">
        {candidates.length === 0 && (
          <div className="text-gray-500">No candidates found for this election.</div>
        )}
        {candidates.map((c) => {
          const isSelected = String(c.id) === String(selectedCandidateId);
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCandidateId(c.id)}
              className={`p-4 rounded-lg border-2 flex justify-between items-center cursor-pointer transition ${isSelected ? "border-indigo-600 bg-indigo-50 shadow" : "border-gray-200 hover:border-indigo-300"}`}
            >
              <div>
                <p className="text-lg font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.party}</p>
              </div>
              <div>
                {isSelected ? (
                  <FaCheckCircle className="text-green-600" size={20} />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleRequestOtp}
          disabled={!selectedCandidateId || sendingOtp}
          className={`py-3 rounded-lg font-semibold ${!selectedCandidateId ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
        >
          {sendingOtp ? "Sending OTP..." : "Request OTP"}
        </button>

        <button
          onClick={() => { setStep(2); setError(""); }}
          disabled={!otpSent}
          className={`py-3 rounded-lg font-semibold ${!otpSent ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          {otpSent ? "Enter OTP & Verify" : "Request OTP first"}
        </button>
      </div>

      {message && <div className="mt-4 text-green-700">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );

  const renderVerify = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-3 flex items-center">
        <FaLock className="mr-2 text-indigo-600" /> Verify & Cast Vote
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        We sent an OTP to the email associated with your account. Enter the 6-digit code below to cast your vote.
      </p>

      <form onSubmit={handleVerifyAndVote} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
          className="w-full border px-4 py-3 rounded-lg text-center tracking-widest font-mono"
          required
        />

        <button
          type="submit"
          disabled={verifying}
          className={`w-full py-3 rounded-lg font-semibold ${verifying ? "bg-gray-300 text-gray-600" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          {verifying ? "Verifying..." : "Verify & Cast Vote"}
        </button>
      </form>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Ballot
        </button>
        <button
          onClick={() => { setOtpSent(false); setStep(1); }}
          className="text-sm text-red-600 hover:underline"
        >
          Cancel & Restart
        </button>
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
      <FaCheckCircle className="text-green-600 mx-auto mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-2">Vote Successfully Cast</h2>
      <p className="text-sm text-gray-700 mb-4">
        Thank you for participating in the election.
      </p>

      {txHash ? (
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 mb-4">
          Transaction receipt: <span className="font-mono break-words">{txHash}</span>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 mb-4">
          Secure receipt generated.
        </div>
      )}

      <div className="grid gap-3">
        <button onClick={() => navigate("/home")} className="py-3 bg-indigo-600 text-white rounded-lg font-semibold">Return to Dashboard</button>
        <button onClick={() => navigate("/elections")} className="py-3 border rounded-lg font-semibold">View Other Elections</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-indigo-600 font-medium">Loading ballot...</div>
      </div>
    );
  }

  // If election not found
  if (!election) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          <p className="text-red-600 font-semibold">Ballot not available</p>
          <p className="text-sm text-gray-600 mt-2">We couldn't find the election you requested. Please return to the elections list.</p>
          <div className="mt-4">
            <button onClick={() => navigate("/elections")} className="py-2 px-4 bg-indigo-600 text-white rounded">Back to Elections</button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto mb-6">
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline flex items-center">
          <FaChevronLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {step === 1 && renderBallot()}
        {step === 2 && renderVerify()}
        {step === 3 && renderConfirmation()}
      </div>
    </div>
  );
}
