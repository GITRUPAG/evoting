import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaSearch } from "react-icons/fa";

import electionApi from "../../api/electionApi";
import candidateApi from "../../api/candidateApi"; // ✅ NEW API

export default function CandidateList() {
  const navigate = useNavigate();
  const { electionId } = useParams(); // may be undefined

  const [candidates, setCandidates] = useState([]);
  const [electionTitle, setElectionTitle] = useState("All Candidates");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState("All");

  // 🔥 Load candidates (per-election OR all)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // -----------------------------------
        // CASE 1: Load candidates for an election
        // -----------------------------------
        if (electionId) {
          const electionRes = await electionApi.getElectionById(electionId);
          setElectionTitle(
            electionRes.data.title ||
              electionRes.data.electionName ||
              "Election"
          );

          const candRes =
            await electionApi.getCandidatesByElection(electionId);

          setCandidates(formatCandidates(candRes.data));
        }

        // -----------------------------------
        // CASE 2: Load ALL candidates
        // -----------------------------------
        else {
          const allRes = await candidateApi.getAllCandidates();
          setCandidates(formatCandidates(allRes.data));
          setElectionTitle("All Registered Candidates");
        }
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [electionId]);

  // normalize API → UI fields
  const formatCandidates = (data) =>
    data.map((c) => ({
      id: c.id,
      name: c.name,
      party: c.party || "Independent",
      position: c.position || "Candidate",
      bio: c.bio || "",
      imageUrl:
        c.imageUrl ||
        "https://via.placeholder.com/150/d1d5db/4b5563?text=Candidate",
    }));

  // build unique party filter
  const uniqueParties = useMemo(() => {
    return ["All", ...new Set(candidates.map((c) => c.party))];
  }, [candidates]);

  // search + filter
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const partyMatch =
        selectedParty === "All" || c.party === selectedParty;

      const searchMatch = c.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return partyMatch && searchMatch;
    });
  }, [candidates, searchTerm, selectedParty]);

  // loading page
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="text-indigo-600 text-lg">Loading Candidates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 sticky top-0 z-10 border-b border-indigo-100">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 transition flex items-center mb-3 text-sm font-medium"
        >
          <FaChevronLeft className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          {electionTitle}
        </h1>
        <p className="text-gray-500 mt-1">
          Explore candidate profiles & party information.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        {/* Party Filter */}
        <select
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          className="w-full md:w-52 px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm"
        >
          {uniqueParties.map((party) => (
            <option key={party} value={party}>
              {party === "All" ? "Filter by Party" : party}
            </option>
          ))}
        </select>
      </div>

      {/* CANDIDATE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={() =>
                navigate(
                  electionId
                    ? `/candidates/${electionId}/${candidate.id}`
                    : `/candidates/profile/${candidate.id}`
                )
              }
            />
          ))
        ) : (
          <div className="col-span-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
            <p className="font-bold">No Candidates Found</p>
            <p className="text-sm">
              Please adjust your search or party filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------- CARD COMPONENT ------------------------
const CandidateCard = ({ candidate, onClick }) => {
  const imageUrl =
    candidate.imageUrl ||
    "https://via.placeholder.com/150/d1d5db/4b5563?text=Candidate";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:ring-2 ring-indigo-500 transition cursor-pointer overflow-hidden transform hover:scale-[1.02]"
    >
      <div className="p-5 flex flex-col items-center text-center">
        <img
          src={imageUrl}
          alt={candidate.name}
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-100"
        />

        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {candidate.name}
        </h3>

        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">
          {candidate.position}
        </p>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            candidate.party === "Unity Party"
              ? "bg-indigo-100 text-indigo-700"
              : candidate.party === "Progressive Front"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {candidate.party}
        </span>

        <button
          className="mt-4 w-full text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 py-2 rounded-lg text-sm transition"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};
