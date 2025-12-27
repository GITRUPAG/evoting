import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

import electionApi from "../../api/electionApi"; // <-- ✅ USE BACKEND API

export default function ElectionList() {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statusOptions = ["All", "Active", "Upcoming", "Past"];

  useEffect(() => {
    async function loadElections() {
      try {
        const res = await electionApi.getAllElections();

        // 🟢 MAP BACKEND FIELDS to UI EXPECTED FORMAT
        const formatted = res.data.map((e) => ({
          id: e.id,
          title: e.title || e.electionName || "Untitled Election",
          date:
            e.startDate && e.endDate
              ? `${e.startDate} - ${e.endDate}`
              : e.startDate || "Date not available",
          status: e.status || "Upcoming",
          candidatesCount: e.candidates?.length || e.candidatesCount || 0,
        }));

        setElections(formatted);
      } catch (error) {
        console.error("Failed to load elections:", error);
      } finally {
        setLoading(false);
      }
    }

    loadElections();
  }, []);

  // 🔍 FILTER + SEARCH + SORT
  const filteredElections = useMemo(() => {
    return elections
      .filter((election) => {
        const statusMatch =
          selectedStatus === "All" || election.status === selectedStatus;

        const searchMatch = election.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return statusMatch && searchMatch;
      })
      .sort((a, b) => {
        const order = { Active: 3, Upcoming: 2, Past: 1 };
        return order[b.status] - order[a.status];
      });
  }, [elections, searchTerm, selectedStatus]);

  // 🔄 LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-indigo-600 text-xl font-medium">
          Loading Elections...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-b-4 border-indigo-500">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FaCalendarAlt className="mr-3 text-indigo-600" /> Official Election
          Calendar
        </h1>
        <p className="text-gray-600 mt-2">
          View all polls you are eligible to vote in, categorized by status.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search election by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-52">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "Filter by Status" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ELECTION LIST */}
      <div className="space-y-4">
        {filteredElections.length > 0 ? (
          filteredElections.map((election) => (
            <ElectionCard
              key={election.id}
              election={election}
              onClick={() => navigate(`/elections/${election.id}`)}
            />
          ))
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-xl shadow-md">
            <p className="font-bold text-lg">No Elections Found</p>
            <p className="text-sm">Try adjusting your search or status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔁 Election Card Component (unchanged UI)
const ElectionCard = ({ election, onClick }) => {
  const { status, title, date, candidatesCount } = election;

  let statusClass = "text-gray-700 bg-gray-200";
  let statusText = status;

  if (status === "Active") {
    statusClass = "text-white bg-green-600 font-bold";
    statusText = "LIVE | VOTE NOW";
  } else if (status === "Upcoming") {
    statusClass = "text-indigo-800 bg-indigo-100";
  } else if (status === "Past") {
    statusClass = "text-red-700 bg-red-100";
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl hover:ring-2 ring-indigo-500 transition duration-200 cursor-pointer flex justify-between items-center group"
    >
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 space-x-6">
          <p className="flex items-center font-medium">
            <FaCalendarAlt className="mr-2 text-indigo-500" /> {date}
          </p>

          <p className="flex items-center">
            <FaUsers className="mr-2 text-indigo-500" />
            <span className="font-semibold">{candidatesCount}</span> Candidates
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span
          className={`px-4 py-1.5 text-xs rounded-full uppercase tracking-wider ${statusClass} shadow-md`}
        >
          {statusText}
        </span>

        <FaArrowRight className="text-indigo-600 text-xl group-hover:translate-x-1 transition duration-200" />
      </div>
    </div>
  );
};
