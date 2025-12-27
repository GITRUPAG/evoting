// src/api/voterApi.js
import axiosClient from "./axiosClient";

const voterApi = {
  register: (data) => axiosClient.post("/voter/register", data),

  login: (email, password) =>
    axiosClient.post("/voter/login", { email, password }),

  getElections: () => axiosClient.get("/election/all"),

  getCandidates: (id) => axiosClient.get(`/election/${id}/candidates`),

  requestOtp: (voterId) =>
    axiosClient.post(`/voter/request-otp?voterId=${voterId}`),

  verifyOtp: (voterId, otp, electionId, candidateId) =>
  axiosClient.post(`/voter/verify-otp`, {
    voterId,
    otp,
    electionId,
    candidateId
  }),



  castVote: (voterId, electionId, candidateId) =>
  axiosClient.post(`/voter/cast-vote`, {
    voterId,
    electionId,
    candidateId
  }),

  getProfile: (voterId) => axiosClient.get(`/voter/profile/${voterId}`),

  getVoteHistory: (voterId) =>
  axiosClient.post(`/voter/vote-history?voterId=${voterId}`),

  

};

export default voterApi;
