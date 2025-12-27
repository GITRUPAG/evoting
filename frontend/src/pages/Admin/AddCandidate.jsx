// src/pages/admin/AddCandidate.jsx
import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import electionApi from "../../api/electionApi";

export default function AddCandidate() {
  const [elections, setElections] = useState([]);

  const [data, setData] = useState({
    name: "",
    party: "",
    position: "",
    bio: "",
    imageUrl: "",
    election: { id: "" },
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await electionApi.getAllElections();
      setElections(res.data);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await adminApi.addCandidate(data);
      setMessage("✅ Candidate Added Successfully");

      // Clear form
      setData({
        name: "",
        party: "",
        position: "",
        bio: "",
        imageUrl: "",
        election: { id: "" },
      });

    } catch (err) {
      setMessage("❌ Failed to Add Candidate");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
      {message && <p className="mb-4 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Candidate Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        {/* Party */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Party Name"
          value={data.party}
          onChange={(e) => setData({ ...data, party: e.target.value })}
        />

        {/* Position */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Position (e.g., Mayor, MLA, Councillor)"
          value={data.position}
          onChange={(e) => setData({ ...data, position: e.target.value })}
        />

        {/* Image URL */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Image URL (Cloudinary or direct link)"
          value={data.imageUrl}
          onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
        />

        {/* Bio */}
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Candidate Bio / Description"
          rows={4}
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
        ></textarea>

        {/* Election Dropdown */}
        <select
          className="w-full p-2 border rounded"
          value={data.election.id}
          onChange={(e) =>
            setData({ ...data, election: { id: e.target.value } })
          }
        >
          <option value="">Select Election</option>
          {elections.map((el) => (
            <option key={el.id} value={el.id}>
              {el.title}
            </option>
          ))}
        </select>

        <button
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Add Candidate
        </button>

      </form>
    </div>
  );
}
