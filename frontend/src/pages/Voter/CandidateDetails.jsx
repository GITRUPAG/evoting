// src/pages/Voter/CandidateDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaChevronLeft,
  FaUniversity,
  FaBriefcase,
  FaUserTie,
  FaClipboardList,
  FaGlobe,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

import candidateApi from "../../api/candidateApi";

export default function CandidateDetails() {
  const navigate = useNavigate();
  const { candidateId } = useParams(); // works for both routes

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Load FULL candidate profile
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await candidateApi.getCandidateProfile(candidateId);
        const data = res.data;

        setCandidate({
          id: data.id,
          name: data.name,
          party: data.party,
          position: data.position || "Candidate",
          bio: data.bio || "No biography available.",
          imageUrl:
            data.imageUrl ||
            "https://via.placeholder.com/150/d1d5db/4b5563?text=Candidate",

          // Optional profile details
          platformSummary: data.platformSummary || [],
          education: data.education || [],
          experience: data.experience || [],
          social: data.social || {},

          electionTitle: data.electionTitle,
          electionId: data.electionId,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load candidate details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [candidateId]);

  // ------------------------------------------
  // LOADING UI
  // ------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="text-indigo-600 text-lg">
          Loading Candidate Profile...
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // ERROR UI
  // ------------------------------------------
  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-100 p-5">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mt-10">
          <h2 className="font-bold">Candidate Not Found</h2>
          <p>The candidate ID `{candidateId}` does not exist.</p>
          <button
            onClick={() => navigate("/candidates")}
            className="mt-3 text-sm font-semibold text-red-600 hover:text-red-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // MAIN CANDIDATE PROFILE UI
  // ------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-5">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:text-indigo-800 transition flex items-center mb-6 text-base font-medium"
      >
        <FaChevronLeft className="mr-2" /> Back
      </button>

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-8 border-t-4 border-indigo-600">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={candidate.imageUrl}
            alt={candidate.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
          />

          <div>
            <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
              {candidate.party}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
              {candidate.name}
            </h1>
            <p className="text-xl text-gray-700 mt-1">
              Running for <b>{candidate.position}</b>
            </p>

            {candidate.electionTitle && (
              <p className="text-sm text-gray-500 mt-1">
                Election: <b>{candidate.electionTitle}</b>
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-5 flex space-x-4 border-t pt-4 border-gray-100">
          {candidate.social.website && (
            <SocialLink
              Icon={FaGlobe}
              href={candidate.social.website}
              text="Website"
              color="text-indigo-600"
            />
          )}
          {candidate.social.twitter && (
            <SocialLink
              Icon={FaTwitter}
              href={`https://twitter.com/${candidate.social.twitter}`}
              text="Twitter"
              color="text-blue-400"
            />
          )}
          {candidate.social.facebook && (
            <SocialLink
              Icon={FaFacebook}
              href={`https://facebook.com/${candidate.social.facebook}`}
              text="Facebook"
              color="text-blue-600"
            />
          )}
        </div>
      </div>

      {/* 3-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BIO + PLATFORM */}
        <div className="lg:col-span-2 space-y-6">

          <DetailSection title="Biography" icon={FaUserTie}>
            <p className="text-gray-700">{candidate.bio}</p>
          </DetailSection>

          <DetailSection title="Key Platform Points" icon={FaClipboardList}>
            {candidate.platformSummary.length > 0 ? (
              <ul className="space-y-3">
                {candidate.platformSummary.map((point, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-indigo-500 mr-2 mt-1">&bull;</span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No platform details available.</p>
            )}
          </DetailSection>
        </div>

        {/* EXPERIENCE + EDUCATION */}
        <div className="lg:col-span-1 space-y-6">

          <DetailSection title="Professional Experience" icon={FaBriefcase}>
            {candidate.experience.length > 0 ? (
              candidate.experience.map((exp, idx) => (
                <div key={idx} className="border-b pb-2 mb-2 last:border-b-0">
                  <h4 className="font-semibold text-gray-800">{exp.role}</h4>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience listed.</p>
            )}
          </DetailSection>

          <DetailSection title="Education History" icon={FaUniversity}>
            {candidate.education.length > 0 ? (
              candidate.education.map((edu, idx) => (
                <div key={idx} className="border-b pb-2 mb-2 last:border-b-0">
                  <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                  <p className="text-sm text-gray-500">
                    {edu.institution} ({edu.year})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education details available.</p>
            )}
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- COMPONENTS ----------------------------- */

const DetailSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-gray-200">
    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
      <Icon className="mr-2 text-indigo-500" /> {title}
    </h2>
    <div>{children}</div>
  </div>
);

const SocialLink = ({ Icon, href, text, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center space-x-2 text-sm font-medium ${color} hover:opacity-80 transition`}
  >
    <Icon />
    <span>{text}</span>
  </a>
);
