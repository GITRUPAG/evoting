import axiosClient from "./axiosClient";

const electionApi = {
  // Get all elections
  getAllElections: () => axiosClient.get("/election/all"),

  // Get election by ID
  getElectionById: (id) => axiosClient.get(`/election/${id}`),

  // Get candidates for election
  getCandidatesByElection: (id) =>
    axiosClient.get(`/election/${id}/candidates`),

  // ADMIN — Create a new election
  createElection: (data) => axiosClient.post("/admin/create-election", data),

  // ADMIN — Update status
  updateStatus: (id, status) =>
    axiosClient.put(`/admin/update-status/${id}?status=${status}`),

  // ADMIN — Add candidate
  addCandidate: (candidate) =>
    axiosClient.post("/admin/add-candidate", candidate),
};

export default electionApi;
