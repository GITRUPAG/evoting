// src/api/adminApi.js
import axiosClient from "./axiosClient";

const adminApi = {
  register: (data) => axiosClient.post("/admin/register", data),

  login: (username, password) =>
    axiosClient.post(`/admin/login?username=${username}&password=${password}`),

  createElection: (data) => axiosClient.post("/admin/create-election", data),

  addCandidate: (data) => axiosClient.post("/admin/add-candidate", data),

  updateStatus: (id, status) =>
    axiosClient.put(`/admin/update-status/${id}?status=${status}`),

  updateCandidate: (id, data) =>
    axiosClient.put(`/candidates/update/${id}`, data),

  deleteCandidate: (id) => axiosClient.delete(`/candidates/delete/${id}`),

  getStats: () => axiosClient.get("/admin/stats"),

  getElectionVoteSummary: () =>
    axiosClient.get("/admin/elections/vote-summary"),

  getCandidateVoteStats: (electionId) =>
    axiosClient.get(`/admin/election/${electionId}/vote-stats`),

};

export default adminApi;
