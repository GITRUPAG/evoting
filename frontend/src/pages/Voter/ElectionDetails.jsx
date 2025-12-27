import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import electionApi from "../../api/electionApi"; // <-- integrate API

export default function ElectionDetails() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateCount, setCandidateCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    async function loadElection() {
      try {
        const res = await electionApi.getElectionById(electionId);
        setElection(res.data);

        // Fetch candidates for count
        const candRes = await electionApi.getCandidatesByElection(electionId);
        setCandidateCount(candRes.data.length);
      } catch (error) {
        console.error("Failed to load election", error);
        setElection(null);
      } finally {
        setLoading(false);
      }
    }

    loadElection();
  }, [electionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-indigo-600 text-xl font-medium">
          Loading Election Details...
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-lg shadow-md mt-10">
          <h2 className="font-bold text-xl">Election Not Found</h2>
          <p>The requested election does not exist.</p>
        </div>
      </div>
    );
  }

  // Backend fields → UI mapping
  const title = election.title || election.electionName || "Untitled Election";
  const description = election.description || "No description provided.";
  const status = election.status || "Upcoming";
  const startDate = election.startDate || "Not provided";
  const endDate = election.endDate || "Not provided";
  const time = election.time || "8:00 AM - 5:00 PM";
  const location = election.location || "Polling Stations";
  const voterEligibility = election.voterEligibility || "Registered citizens over 18.";

  const isUpcoming = status === "Upcoming";
  const statusColor = isUpcoming ? "bg-blue-600" : "bg-green-600";
  const statusBadgeColor = isUpcoming ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  const isOnline = location.toLowerCase().includes("online");

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/elections")}
          className="text-indigo-600 hover:text-indigo-800 transition flex items-center mb-3 text-sm font-medium"
        >
          <FaChevronLeft className="mr-2" /> Back to Election List
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-xl p-5 shadow-xl mb-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${statusBadgeColor}`}>
                {status}
              </span>

              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mt-1">
                {title}
              </h1>
            </div>
          </div>

          <p className="text-gray-600 mt-2 mb-4 text-sm">{description}</p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">

            {/* Go to vote */}
            <button
              onClick={() => navigate(`/elections/${electionId}/vote`)}
              className={`flex-grow sm:w-1/2 ${statusColor} text-white py-2 rounded-lg font-bold text-base hover:opacity-90 transition shadow-lg flex items-center justify-center`}
              disabled={isUpcoming}
            >
              <FaCheckCircle className="mr-2" />
              {isUpcoming ? "Voting Opens Soon" : "CAST YOUR VOTE NOW"}
            </button>

            {/* View Candidates */}
            <button
              onClick={() => navigate(`/candidates/${electionId}`)}
              className="flex-grow sm:w-1/2 bg-gray-100 text-indigo-700 py-2 rounded-lg font-bold text-base hover:bg-gray-200 transition shadow-sm flex items-center justify-center border border-gray-200"
            >
              <FaUsers className="mr-2" /> View {candidateCount} Candidates
            </button>
          </div>
        </div>

        {/* GRID DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Schedule */}
          <DetailBlock title="Schedule & Logistics" icon={FaCalendarAlt}>
            <DetailItem title="Start Date" value={startDate} icon={FaCalendarAlt} />
            <DetailItem title="End Date" value={endDate} icon={FaCalendarAlt} />
            <DetailItem title="Voting Hours" value={time} icon={FaClock} />
            <DetailItem title="Location" value={location} icon={isOnline ? FaCheckCircle : FaMapMarkerAlt} />
          </DetailBlock>

          {/* Participation */}
          <DetailBlock title="Participation" icon={FaUsers}>
            <DetailItem title="Candidates Running" value={`${candidateCount} individuals`} icon={FaUsers} />
            <div className="py-2 mt-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Eligibility:</p>
              <p className="text-sm font-semibold text-gray-900">{voterEligibility}</p>
            </div>
          </DetailBlock>

          {/* Status */}
          <DetailBlock title="Election Status" icon={FaExclamationCircle}>
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-extrabold text-indigo-700">
                {status === "Active" ? "VOTE OPEN" : "PENDING"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Status as of today</p>
            </div>
          </DetailBlock>

        </div>
      </div>
    </div>
  );
}

// Reusable items
const DetailItem = ({ title, value, icon: Icon }) => (
  <div className="flex items-center py-1 border-b border-gray-100 last:border-b-0">
    <Icon className="mr-3 text-indigo-500" size={14} />
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  </div>
);

const DetailBlock = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 transition duration-300 hover:shadow-lg h-full">
    <h2 className="text-lg font-bold flex items-center mb-2 text-indigo-700">
      <Icon className="mr-2 text-indigo-500" size={20} /> {title}
    </h2>
    <dl className="space-y-0.5">{children}</dl>
  </div>
);
