import axiosClient from "./axiosClient";

const voterApi = {
  // -----------------------------------------
  // AUTH
  // -----------------------------------------
  register(data) {
    return axiosClient.post("/voter/register", data);
  },

  login(email, password) {
    return axiosClient.post(`/voter/login?email=${email}&password=${password}`);
  },

  // -----------------------------------------
  // ELECTIONS
  // -----------------------------------------
  getAllElections() {
    return axiosClient.get("/election/all");
  },

  getCandidatesByElection(electionId) {
    return axiosClient.get(`/election/${electionId}/candidates`);
  },

  // -----------------------------------------
  // OTP
  // -----------------------------------------
  requestOtp(voterId) {
    return axiosClient.post(`/voter/request-otp?voterId=${voterId}`);
  },

  verifyOtp(voterId, otp, electionId, candidateName) {
    return axiosClient.post(
      `/voter/verify-otp?voterId=${voterId}&otp=${otp}&electionId=${electionId}&candidateName=${candidateName}`
    );
  },

  // -----------------------------------------
  // CAST VOTE (DIRECT — if needed)
  // -----------------------------------------
  castVote(voterId, electionId, candidateName) {
    return axiosClient.post(
      `/voter/cast-vote?voterId=${voterId}&electionId=${electionId}&candidateName=${candidateName}`
    );
  },
};

export default voterApi;
