// src/utils/helpers.js

/**
 * Calculates the current status of an election based on its start/end times.
 * @param {string} startTime - ISO date string for start time.
 * @param {string} endTime - ISO date string for end time.
 * @param {string} initialStatus - Status set by admin (e.g., 'Upcoming').
 * @returns {string} One of: 'Upcoming', 'Ongoing', 'Completed'.
 */
export const calculateElectionStatus = (startTime, endTime, initialStatus) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) {
    return 'Upcoming';
  } else if (now >= start && now <= end) {
    return 'Ongoing';
  } else if (now > end) {
    return 'Completed';
  }
  
  // Fallback, if admin explicitly marked it completed/upcoming early
  return initialStatus || 'Upcoming'; 
};