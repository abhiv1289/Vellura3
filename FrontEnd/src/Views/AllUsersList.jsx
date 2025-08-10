import "../Styles/FriendsList.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Components/Loader";

// Please add comment when adding or fixing anything in the code.

function AllUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            withCredentials: true,
          }
        );
        setUsers(res.data.data || []);
        console.log(res.data.data);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/friends/pending/${userId}`,
          { withCredentials: true }
        );
        setFriendRequests(res.data.pendingRequests || []);
        console.log(res.data.pendingRequests);
      } catch (err) {
        console.error("Error fetching friend requests:", err);
      }
    };

    if (userId) {
      fetchUsers();
      fetchFriendRequests();
    }
  }, [userId]);

  const sendFriendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/friends/sendrequest`,
        { sender: userId, receiver: receiverId },
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      alert("Friend request already sent.");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/api/friends/acceptrequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      alert("Failed to accept the friend request.");
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/friends/rejectrequest/${requestId}`,
        { withCredentials: true }
      );
      alert(res.data.message);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      alert("Failed to decline the friend request.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-color h-full dark:to-black">
      <h1 className="text-center text-5xl py-5">Find Your Soulmates</h1>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6 h-vh friend-main-container shadow-2xl border-1 rounded-xl p-6">
        {/* Users List */}
        <div className="w-full md:w-1/2 bg-white p-5 rounded-lg shadow-md">
          {/* Responsive Search Bar */}
          <div className="w-full flex items-center gap-2 mb-4">
            {/* Changed fixed width "w-96" to "w-full" so the input fills available space */}
            <input
              type="search"
              className="w-full p-3 border rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="text-2xl sm:text-4xl mt-1">🔍</span>
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
            All Users
          </h2>
          <div className="h-80 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <ul>
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {user.username}
                    </span>
                    <button
                      className="px-3 py-1 btn-color text-white rounded-md !hover:bg-purple-700 transition"
                      onClick={() => sendFriendRequest(user._id)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center">No users found.</p>
            )}
          </div>
        </div>

        {/* Friend Requests List */}
        <div className="w-full md:w-1/2 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
            Friend Requests
          </h2>
          <div className="h-80 overflow-y-auto">
            {friendRequests.length > 0 ? (
              <ul>
                {friendRequests.map((request) => (
                  <li
                    key={request._id}
                    className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">
                      {request.user1.username} sent a request
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        onClick={() => acceptFriendRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={() => declineFriendRequest(request._id)}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center">No pending requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllUsersList;
