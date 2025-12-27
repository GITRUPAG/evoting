import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import candidateApi from "../../api/candidateApi";
import adminApi from "../../api/adminApi";

export default function ManageCandidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // -----------------------------
  // LOAD ALL CANDIDATES
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await candidateApi.getAllCandidates();
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load candidates");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // -----------------------------
  // DELETE CANDIDATE
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      await adminApi.deleteCandidate(id);
      setCandidates(candidates.filter((c) => c.id !== id));
      setMessage("✅ Candidate deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-lg text-indigo-600">Loading candidates...</div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Manage Candidates</h1>

      {message && (
        <div className="mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded">
          {message}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Party</th>
              <th className="p-3 border">Election</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 border text-center">
                  <img
                    src={
                      c.imageUrl ||
                      "https://via.placeholder.com/50?text=Candidate"
                    }
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="p-3 border">{c.name}</td>
                <td className="p-3 border">{c.party}</td>
                <td className="p-3 border">
                  {c.election ? c.election.title : "N/A"}
                </td>
                <td className="p-3 border">
                  <div className="flex gap-3 justify-center">

                    <button
                      onClick={() => navigate(`/admin/edit-candidate/${c.id}`)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {candidates.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
