import axiosClient from "./axiosClient";

const candidateApi = {
  // ✅ Get ALL candidates
  getAllCandidates: () => axiosClient.get("/candidates/all"),

  // ✅ Get a single candidate by ID
  getCandidateById: (id) => axiosClient.get(`/candidates/${id}`),

  // (Optional) Admin — Add new candidate
  addCandidate: (candidate) =>
    axiosClient.post("/api/admin/add-candidate", candidate),

  getCandidateProfile: (id) => axiosClient.get(`/candidates/profile/${id}`)

};

export default candidateApi;
