import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

export default function CandidateVoteStats() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getCandidateVoteStats(electionId);
        setStats(res.data);
      } catch (err) {
        console.error("Candidate stats failed:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [electionId]);

  if (loading) return <div className="p-6">Loading candidate stats...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Candidate Vote Stats
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Candidate</th>
              <th className="p-2">Votes</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((c, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{c.candidateName}</td>
                <td className="p-2 font-semibold">{c.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
