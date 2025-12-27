import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Voter Pages (Updated imports)
import Login from "./pages/Voter/Login";
import Register from "./pages/Voter/Register";
import HomePage from "./pages/Home/HomePage";
import ElectionsList from "./pages/Voter/ElectionsList";
import ElectionDetails from "./pages/Voter/ElectionDetails";
// NOTE: You need to create this file
import CandidateList from "./pages/Voter/CandidateList";
// NOTE: You need to create this file
import CandidateDetails from "./pages/Voter/CandidateDetails";
import RequestOtp from "./pages/Voter/RequestOtp";
import VerifyOtp from "./pages/Voter/VerifyOtp";
import VoteSuccess from "./pages/Voter/VoteSuccess";
import Profile from "./pages/Voter/Profile";
import VotingInterface from "./pages/Voter/VotingInterface";
import VoterProfile from "./pages/Voter/VoterProfile";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import Dashboard from "./pages/Admin/AdminDashboard";
import CreateElection from "./pages/Admin/CreateElection";
import AddCandidate from "./pages/Admin/AddCandidate";
import ManageElections from "./pages/Admin/ManageElections";
import ElectionResults from "./pages/Admin/ElectionResults";
import AdminRoute from "./components/AdminRoute";
import AdminRegister from "./pages/Admin/AdminRegister";
import UpdateCandidate from "./pages/Admin/UpdateCandidate";
import ManageCandidates from "./pages/Admin/ManageCandidates";
import CandidateVoteStats from "./pages/Admin/CandidateVoteStats";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";





// Common
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <Routes>
          {/* VOTER AUTH & NAVIGATION */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* VOTING FLOW */}
          <Route path="/elections" element={<ElectionsList />} />
          {/* 1. CORRECTED PATH and PARAMETER NAME to :electionId */}
          <Route path="/elections/:electionId" element={<ElectionDetails />} />
          {/* 2. Candidate List Route (from HomePage) */}
          <Route path="/candidates" element={<CandidateList />} />
          {/* 3. Candidate Details Route (from CandidateCard click) */}
          <Route path="/candidates/:candidateId" element={<CandidateDetails />} />
          <Route path="/candidates/profile/:candidateId" element={<CandidateDetails />} />

          <Route path="/elections/:electionId/vote" element={<VotingInterface />} />          

          {/* OTP/Success */}
          <Route path="/request-otp" element={<RequestOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/vote-success" element={<VoteSuccess />} />
          <Route path="/voter/profile/:voterId" element={<VoterProfile />} />


          {/* ADMIN */}
          /* ADMIN */
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/register" element={<AdminRegister />} />


<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/create-election"
  element={
    <AdminRoute>
      <CreateElection />
    </AdminRoute>
  }
/>

<Route
  path="/admin/add-candidate"
  element={
    <AdminRoute>
      <AddCandidate />
    </AdminRoute>
  }
/>

<Route
  path="/admin/manage-elections"
  element={
    <AdminRoute>
      <ManageElections />
    </AdminRoute>
  }
/>

<Route
  path="/admin/results"
  element={
    <AdminRoute>
      <ElectionResults />
    </AdminRoute>
  }
/>

<Route
  path="/admin/edit-candidate/:id"
  element={
    <AdminRoute>
      <UpdateCandidate />
    </AdminRoute>
  }
/>
<Route
  path="/admin/manage-candidates"
  element={
    <AdminRoute>
      <ManageCandidates />
    </AdminRoute>
  }
/>

<Route
  path="/admin/analytics"
  element={
    <AdminRoute>
      <AdminAnalytics />
    </AdminRoute>
  }
/>

<Route
  path="/admin/analytics/election/:electionId"
  element={
    <AdminRoute>
      <CandidateVoteStats />
    </AdminRoute>
  }
/>




          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;