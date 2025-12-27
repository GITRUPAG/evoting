// src/pages/admin/CreateElection.jsx
import React, { useState } from "react";
import adminApi from "../../api/adminApi";

export default function CreateElection() {
  const [data, setData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Upcoming",
  });

  const [message, setMessage] = useState("");

  // Merge date + time into full datetime string
  const makeDateTime = (date, time) => {
    if (!date || !time) return null;
    return `${date}T${time}:00`; // Spring Boot LocalDateTime format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: data.title,
      description: data.description,
      startTime: makeDateTime(data.startDate, data.startTime),
      endTime: makeDateTime(data.endDate, data.endTime),
      status: data.status,
    };

    try {
      await adminApi.createElection(payload);
      setMessage("✅ Election Created Successfully");
    } catch (err) {
      setMessage("❌ Failed to Create Election");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Election</h2>

      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Election Title"
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        {/* Description */}
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        {/* START DATE + TIME */}
        <div>
          <label className="font-semibold block mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            onChange={(e) => setData({ ...data, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Start Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            onChange={(e) => setData({ ...data, startTime: e.target.value })}
          />
        </div>

        {/* END DATE + TIME */}
        <div>
          <label className="font-semibold block mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            onChange={(e) => setData({ ...data, endDate: e.target.value })}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">End Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            onChange={(e) => setData({ ...data, endTime: e.target.value })}
          />
        </div>

        {/* STATUS */}
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setData({ ...data, status: e.target.value })}
        >
          <option>Upcoming</option>
          <option>Active</option>
          <option>Past</option>
        </select>

        {/* BUTTON */}
        <button className="bg-indigo-600 text-white py-2 px-4 rounded">
          Create Election
        </button>
      </form>
    </div>
  );
}
