import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import voterApi from "../../api/voterApi";

export default function VoterProfile() {
  const { voterId } = useParams();

  const [voter, setVoter] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load voter profile
        const res = await voterApi.getProfile(voterId);
        setVoter(res.data);

        // Load vote history
        const historyRes = await voterApi.getVoteHistory(voterId);
        setHistory(historyRes.data);

      } catch (err) {
        console.error("❌ Failed to load Voter Profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [voterId]);

  if (loading)
    return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;

  if (!voter)
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        Voter profile not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Voter Profile
      </h2>

      {/* PROFILE DETAILS */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-6 border border-gray-200">
        <DetailRow label="Name" value={voter.name} />
        <DetailRow label="Email" value={voter.email} />
        <DetailRow label="Voter ID" value={voter.id} />
      </div>

      {/* VOTE HISTORY */}
      <h3 className="text-xl font-bold mb-3 text-gray-800">Vote History</h3>

      {history.length === 0 ? (
        <div className="text-gray-500 text-center py-4 italic">
          No voting history available.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.electionId}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {item.electionName}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {item.status}
                </p>
              </div>
              <span className="text-green-600 font-bold text-sm">✔ Voted</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// SMALL REUSABLE ROW COMPONENT
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
