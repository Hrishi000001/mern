import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);         
  const [searchTerm, setSearchTerm] = useState('');  
  const [sentRequests, setSentRequests] = useState([]); 
  const [receivedRequests, setReceivedRequests] = useState([]); 
  const [friends, setFriends] = useState([]);        

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/api/users'); 
        setUsers(usersResponse.data);

        const receivedRequestsResponse = await axios.get('/api/friend-requests'); 
        setReceivedRequests(receivedRequestsResponse.data);

        const friendsResponse = await axios.get('/api/friends'); 
        setFriends(friendsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`/api/send-friend-request/${userId}`);
      setSentRequests([...sentRequests, userId]); 
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  
  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post(`/api/accept-friend-request/${userId}`);
      setFriends([...friends, userId]); 
      setReceivedRequests(receivedRequests.filter((id) => id !== userId)); 
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  
  const handleRejectRequest = async (userId) => {
    try {
      await axios.post(`/api/reject-friend-request/${userId}`);
      setReceivedRequests(receivedRequests.filter((id) => id !== userId)); 
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }} className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <h1>Welcome to the Friend Finder</h1>

      <div className="my-3">
        <input
          type="text"
          placeholder="Search users..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-list">
        <h3>All Users</h3>
        <ul className="list-group">
          {users.filter((user) => user.username.includes(searchTerm)).map((user) => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              {user.username}
              <button
                className={`btn ${sentRequests.includes(user._id) ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleSendRequest(user._id)}
                disabled={sentRequests.includes(user._id)}
              >
                {sentRequests.includes(user._id) ? 'Sent' : 'Send Request'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="friend-requests mt-4">
        <h3>Friend Requests</h3>
        {receivedRequests.length > 0 ? (
          <ul className="list-group">
            {receivedRequests.map((request) => (
              <li key={request._id} className="list-group-item d-flex justify-content-between align-items-center">
                {request.username}
                <div>
                  <button className="btn btn-success mx-2" onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                  <button className="btn btn-danger" onClick={() => handleRejectRequest(request._id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friend requests.</p>
        )}
      </div>

      <div className="friends-list mt-4">
        <h3>Friends List</h3>
        {friends.length > 0 ? (
          <ul className="list-group">
            {friends.map((friend) => (
              <li key={friend._id} className="list-group-item">{friend.username}</li>
            ))}
          </ul>
        ) : (
          <p>You have no friends yet.</p>
        )}
      </div>

      <Link to='/login' className="btn btn-light my-5">Logout</Link>
    </div>
  );
};

export default Home;
