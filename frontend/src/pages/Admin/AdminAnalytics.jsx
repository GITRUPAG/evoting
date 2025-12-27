// src/pages/Admin/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null); // will hold StatsDto
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [statsRes, summaryRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getElectionVoteSummary(),
        ]);

        // Defensive: ensure .data exists
        setStats(statsRes?.data ?? {});
        setSummary(summaryRes?.data ?? []);
      } catch (err) {
        console.error("Analytics failed:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-indigo-600 text-lg font-medium">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Safe destructure - use 0 / "N/A" defaults when fields are missing
  const {
    totalElections = 0,
    activeElections = 0,
    completedElections = 0,
    totalVoters = 0,
    votesCast = 0,
    turnoutPercentage = 0,
  } = stats || {};

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Election Analytics Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Elections" value={totalElections} />
        <StatCard title="Active Elections" value={activeElections} />
        <StatCard title="Completed Elections" value={completedElections} />
        <StatCard title="Total Voters" value={totalVoters} />
        <StatCard title="Votes Cast" value={votesCast} />
        <StatCard title="Turnout %" value={`${turnoutPercentage}%`} />
      </div>

      {/* ELECTION VOTE SUMMARY TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Votes per Election</h2>

        {summary.length === 0 ? (
          <div className="text-gray-500">No election data available.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Election</th>
                <th className="p-2">Votes</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((e) => (
                <tr key={e.electionId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{e.electionTitle ?? "Untitled"}</td>
                  <td className="p-2 font-semibold">{e.totalVotes ?? 0}</td>
                  <td className="p-2">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() =>
                        navigate(`/admin/analytics/election/${e.electionId}`)
                      }
                    >
                      View Candidate Stats →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 shadow rounded-lg text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-indigo-600">{value}</h2>
    </div>
  );
}
