import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import {
  FaUserCircle,
  FaVoteYea,
  FaHistory,
  FaUserTie,
  FaChevronRight,
  FaInfoCircle,
  FaSignOutAlt
} from "react-icons/fa";

import ElectionAnimation from "../../assets/Election.json";
import BallotingAnimation from "../../assets/Balloting.json";
import voterApi from "../../api/voterApi";

export default function HomePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [upcomingElection, setUpcomingElection] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/");

    setUser(JSON.parse(storedUser));

    // Load elections from backend
    loadUpcomingElection();
  }, [navigate]);

  async function loadUpcomingElection() {
    try {
      const res = await voterApi.getElections();
      const elections = res.data;

      const nextUpcoming = elections.find((e) => e.status === "Upcoming");

      setUpcomingElection(nextUpcoming || null);
    } catch (err) {
      console.error("Failed to load elections", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased p-0">
      {/* TOP NAVBAR */}
      <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="text-2xl font-extrabold text-indigo-700 tracking-wider">
          EasyVote
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/voter/profile/${user?.id}`)}
            className="flex items-center space-x-2 text-indigo-600 border border-indigo-600 rounded-lg px-3 py-1.5 font-semibold text-sm hover:bg-indigo-50 transition"
          >
            <FaUserCircle size={18} />
            <span>Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-red-600 border border-red-600 rounded-lg px-3 py-1.5 font-semibold text-sm hover:bg-red-50 transition"
          >
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="p-6 sm:p-10">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Secure Voting <span className="text-indigo-600">made Simple</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              Welcome,{" "}
              <span className="font-bold">{user?.name || "Voter"}</span>.  
              EasyVote will help you participate securely and easily.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/elections")}
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition text-lg"
              >
                Start Now
              </button>

              <button
                onClick={() => navigate("/candidates")}
                className="text-indigo-600 font-semibold px-6 py-3 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition text-lg"
              >
                Here to Vote?
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Lottie
              animationData={ElectionAnimation}
              loop
              style={{ height: 350, width: "100%" }}
              className="max-w-md"
            />
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Voting made simple while still being fully{" "}
            <span className="text-indigo-600">Secure and Reliable</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Election Calendar card */}
            <QuickFeatureCard
              icon={<FaVoteYea size={32} className="text-indigo-600" />}
              title="Elections Calendar"
              description="View the comprehensive list of all active, upcoming, and past elections you are eligible for."
              linkText="View All Polls"
              onClick={() => navigate("/elections")}
            >
              <Lottie
                animationData={BallotingAnimation}
                loop
                style={{ height: 100 }}
                className="my-4 max-w-[150px] mx-auto"
              />
            </QuickFeatureCard>

            <QuickFeatureCard
              icon={<FaUserTie size={32} className="text-green-600" />}
              title="Candidate Research"
              description="See candidate profiles before voting."
              linkText="Explore Candidates"
              onClick={() => navigate("/candidates")}
            />

            <QuickFeatureCard
              icon={<FaHistory size={32} className="text-red-600" />}
              title="Participation History"
              description="View your past voting participation."
              linkText="Check Records"
              onClick={() => navigate(`/voter/profile/${user?.id}`)}
            />
          </div>
        </div>

        {/* UPCOMING ELECTION */}
        {upcomingElection && (
          <div className="mt-16 bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center">
              <FaInfoCircle className="mr-3 text-indigo-600" /> Next Election:{" "}
              {upcomingElection.title}
            </h3>

            <div
              className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center hover:shadow-inner"
              onClick={() => navigate(`/elections/${upcomingElection.id}`)}
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Date: {upcomingElection.startTime?.split("T")[0]}
                </p>

                <p className="text-sm text-green-700 font-medium">
                  Status: {upcomingElection.status}
                </p>
              </div>

              <FaChevronRight className="text-indigo-600 ml-3" size={20} />
            </div>

            <div className="text-right mt-4">
              <button
                onClick={() => navigate("/elections")}
                className="text-indigo-600 font-semibold text-sm hover:underline"
              >
                View All Elections →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------
   REUSABLE CARD COMPONENT
--------------------------- */
const QuickFeatureCard = ({
  icon,
  title,
  description,
  linkText,
  onClick,
  children,
}) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
    <div className="mb-4 p-3 rounded-full bg-indigo-50 w-fit">{icon}</div>

    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

    {children}

    <p className="text-gray-500 text-base mb-4">{description}</p>

    <button
      onClick={onClick}
      className="text-indigo-600 font-semibold text-sm flex items-center hover:underline"
    >
      {linkText} <FaChevronRight className="ml-2 text-xs" />
    </button>
  </div>
);
