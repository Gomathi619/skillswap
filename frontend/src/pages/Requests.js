import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Requests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/matches/my-requests',
        { headers: { authorization: token } }
      );
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Failed to fetch requests');
    }
  };

  const respondRequest = async (match_id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/matches/respond/${match_id}`,
        { status },
        { headers: { authorization: token } }
      );
      alert(`Request ${status}! 🎉`);
      fetchRequests();
    } catch (err) {
      alert('Failed to respond!');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h2 style={styles.headerTitle}>📩 Swap Requests</h2>
      </div>

      {/* Requests List */}
      <div style={styles.content}>
        {requests.length === 0 ? (
          <p style={styles.noRequests}>
            No swap requests yet! 😊
          </p>
        ) : (
          requests.map((req, index) => (
            <div key={index} style={styles.requestCard}>
              <div>
                <h3 style={styles.name}>{req.requested_by}</h3>
                <p style={styles.email}>{req.requested_by_email}</p>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      req.status === 'accepted' ? '#10b981' :
                      req.status === 'rejected' ? '#ef4444' : '#f59e0b'
                  }}
                >
                  {req.status.toUpperCase()}
                </span>
              </div>
              {req.status === 'pending' && (
                <div style={styles.buttons}>
                  <button
                    style={styles.acceptBtn}
                    onClick={() => respondRequest(req.id, 'accepted')}
                  >
                    ✅ Accept
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => respondRequest(req.id, 'rejected')}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
              {req.status === 'accepted' && (
                <button
                  style={styles.chatBtn}
                  onClick={() => navigate(`/chat/${req.id}/${req.requested_by}`)}
                >
                  💬 Open Chat
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8'
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  headerTitle: {
    color: 'white',
    margin: 0
  },
  content: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  noRequests: {
    textAlign: 'center',
    color: '#888',
    marginTop: '50px'
  },
  requestCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    margin: '0 0 5px 0',
    color: '#333'
  },
  email: {
    margin: '0 0 8px 0',
    color: '#666'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  buttons: {
    display: 'flex',
    gap: '10px'
  },
  acceptBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  rejectBtn: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  chatBtn: {
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Requests;