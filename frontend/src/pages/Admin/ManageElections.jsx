// src/pages/admin/ManageElections.jsx
import React, { useEffect, useState } from "react";
import electionApi from "../../api/electionApi";
import adminApi from "../../api/adminApi";

export default function ManageElections() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await electionApi.getAllElections();
    setElections(res.data);
  }

  const updateStatus = async (id, status) => {
    await adminApi.updateStatus(id, status);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Elections</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {elections.map((el) => (
            <tr key={el.id}>
              <td className="p-2 border">{el.title}</td>
              <td className="p-2 border">{el.status}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => updateStatus(el.id, "Active")}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Set Active
                </button>
                <button
                  onClick={() => updateStatus(el.id, "Upcoming")}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Upcoming
                </button>
                <button
                  onClick={() => updateStatus(el.id, "Past")}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Past
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
