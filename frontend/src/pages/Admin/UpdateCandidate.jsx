import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import electionApi from "../../api/electionApi";
import candidateApi from "../../api/candidateApi";

export default function UpdateCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [elections, setElections] = useState([]);

  const [form, setForm] = useState({
    name: "",
    party: "",
    position: "",
    bio: "",
    imageUrl: "",
    election: { id: "" },
  });

  // --------------------------
  // LOAD CANDIDATE + ELECTIONS
  // --------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const candidateRes = await candidateApi.getCandidateProfile(id);
        const candidate = candidateRes.data;

        setForm({
          name: candidate.name,
          party: candidate.party,
          position: candidate.position || "",
          bio: candidate.bio || "",
          imageUrl: candidate.imageUrl || "",
          election: { id: candidate.electionId },
        });

        const electionsRes = await electionApi.getAllElections();
        setElections(electionsRes.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load candidate data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // --------------------------
  // HANDLE UPDATE
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await adminApi.updateCandidate(id, form);
      setMessage("✅ Candidate updated successfully!");

      setTimeout(() => navigate("/admin/manage-candidates"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update candidate");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-600 text-lg">
        Loading candidate data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Edit Candidate</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-indigo-100 text-indigo-700 font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold">Candidate Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Party</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.party}
            onChange={(e) => setForm({ ...form, party: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Position</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold">Biography</label>
          <textarea
            className="w-full p-2 border rounded h-28"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold">Election</label>
          <select
            className="w-full p-2 border rounded"
            value={form.election.id}
            onChange={(e) =>
              setForm({ ...form, election: { id: e.target.value } })
            }
            required
          >
            <option value="">Select Election</option>
            {elections.map((el) => (
              <option key={el.id} value={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Update Candidate
        </button>
      </form>
    </div>
  );
}
