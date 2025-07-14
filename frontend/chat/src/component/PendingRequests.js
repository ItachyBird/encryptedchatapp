import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pagescss/Chat.css';

function PendingRequests({ username }) {
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    if (!username) return;

    axios
      .get(`http://localhost:8080/api/auth/friend-requests?username=${username}`)
      .then((res) => setIncomingRequests(res.data))
      .catch((err) => console.error('Error fetching requests', err));
  }, [username]);

  const acceptRequest = (sender) => {
    axios
      .post('http://localhost:8080/api/auth/accept-friend', {
        username,
        friendUsername: sender,
      })
      .then(() => {
        alert('Friend request accepted');
        setIncomingRequests((prev) => prev.filter((r) => r !== sender));
      })
      .catch(() => alert('Failed to accept request'));
  };

  const rejectRequest = (sender) => {
    axios
      .post('http://localhost:8080/api/auth/reject-friend', {
        username,
        friendUsername: sender,
      })
      .then(() => {
        alert('Friend request rejected');
        setIncomingRequests((prev) => prev.filter((r) => r !== sender));
      })
      .catch(() => alert('Failed to reject request'));
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '10px', marginTop: '20px' }}>
      <h3>Pending Friend Requests</h3>
      {incomingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {incomingRequests.map((sender, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <span>{sender}</span>
              <button
                style={{ marginLeft: '10px', padding: '5px 10px' }}
                onClick={() => acceptRequest(sender)}
              >
                Accept
              </button>
              <button
                style={{ marginLeft: '5px', padding: '5px 10px' }}
                onClick={() => rejectRequest(sender)}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingRequests;
