// src/pages/Voter/VoteSuccess.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VoteSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve data passed from the navigation state
  const { txHash, electionTitle } = location.state || {};

  const handleGoHome = () => {
    navigate('/elections'); // Navigate back to the main elections list
  };

  const handleViewResults = () => {
    // ⚠️ NOTE: You would need a separate route and component (e.g., /election/results/:id)
    alert("Results feature is under development! Coming soon."); 
    // navigate(`/election/results/${electionId}`); 
  };
  
  // Fallback if the user navigates directly or state is lost
  if (!txHash) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Confirmation Not Found</h2>
        <p>Your vote may have been cast, but we couldn't retrieve the confirmation details.</p>
        <button onClick={handleGoHome} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
          Back to Elections
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '40px', 
      border: '3px solid #28aa46', 
      borderRadius: '10px', 
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#e6ffe6',
      textAlign: 'center'
    }}>
      
      <h1 style={{ color: '#28a745', fontSize: '2.5em' }}>🎉 Vote Successfully Cast!</h1>
      <p style={{ fontSize: '1.2em', margin: '20px 0' }}>
        Your ballot for the **{electionTitle || 'Election'}** has been securely recorded.
      </p>

      <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '5px', border: '1px dashed #28a745', margin: '30px 0' }}>
        <h3 style={{ margin: '0 0 10px', color: '#333' }}>Transaction Receipt</h3>
        <p style={{ wordBreak: 'break-all', fontSize: '0.9em', color: '#555' }}>
          **TxHash**: {txHash}
        </p>
        <p style={{ fontSize: '0.8em', color: '#888' }}>
          *Keep this hash. It is your unique proof of vote on the blockchain/secure ledger.*
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button 
          onClick={handleGoHome} 
          style={{ padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}
        >
          Back to Home (Elections)
        </button>
        <button 
          onClick={handleViewResults} 
          style={{ padding: '12px 25px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}
        >
          View Election Results (Optional)
        </button>
      </div>
    </div>
  );
}

export default VoteSuccess;