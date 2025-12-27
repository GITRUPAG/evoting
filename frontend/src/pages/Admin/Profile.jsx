// src/pages/Admin/Profile.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateAdminPassword } from '../../api/adminApi'; // API helper functions

function AdminProfile() {
  const { user } = useAuth();
  
  // State for profile data
  const [profile, setProfile] = useState(user || { id: 'N/A', name: 'Admin', email: 'admin@evoting.com' });
  
  // State for password update form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      // 1. Call API to update password
      // NOTE: You need to implement updateAdminPassword in src/api/adminApi.js
      await updateAdminPassword(profile.id, currentPassword, newPassword); 
      
      setMessage("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Password update failed. Check current password.";
      setError(errorMessage);
    }
  };

  const fieldStyle = { marginBottom: '15px' };
  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1>👑 Admin Profile</h1>
      
      {/* --- View Personal Details --- */}
      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '6px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
        <h3>Administrative Details</h3>
        <p><strong>Admin ID:</strong> {profile.id}</p>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email/Username:</strong> {profile.email || profile.name}</p>
        <p><strong>Role:</strong> System Administrator</p>
      </div>

      {/* --- Update Password Form --- */}
      <div style={{ padding: '20px', border: '1px solid #ffc107', borderRadius: '6px' }}>
        <h3>Security: Change Password</h3>
        <form onSubmit={handlePasswordUpdate}>
          {/* ... (Password update form structure identical to VoterProfile) ... */}
          <div style={fieldStyle}>
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} required />
          </div>
          <div style={fieldStyle}>
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} required />
          </div>
          <div style={fieldStyle}>
            <label>Confirm New Password</label>
            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} style={inputStyle} required />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          
          <button 
            type="submit" 
            style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProfile;