import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const fetchProfile = async () => {
      try {
        const meRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileId = id || meRes.data._id;
        setIsOwnProfile(profileId === meRes.data._id);

        const userRes = await axios.get(`http://localhost:5000/api/users/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const postRes = await axios.get(`http://localhost:5000/api/posts/user/${profileId}`);
        setPosts(postRes.data);

        if (userRes.data.friends?.length > 0) {
          const friendsRes = await axios.post(
            `http://localhost:5000/api/users/friends`,
            { ids: userRes.data.friends },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFriends(friendsRes.data);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        navigate("/");
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-3xl font-bold text-emerald-600 mb-2 flex items-center gap-2">
          {user.name} {isOwnProfile && <span className="text-sm text-gray-500">(You)</span>}
        </h2>
        <p className="text-gray-800 mb-1">{user.email}</p>
        <p className="text-gray-500 text-sm mb-1">
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm mt-2 text-gray-700">
          Total Friends: <span className="font-medium text-emerald-600">{friends.length}</span>
        </p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Friends</h3>
        {friends.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {friends.map((friend) => (
              <button
                key={friend._id}
                onClick={() => navigate(`/profile/${friend._id}`)}
                className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-sm w-full text-center"
              >
                {friend.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No friends yet.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {isOwnProfile ? "My Posts" : `${user.name}'s Posts`}
        </h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="border-b py-4">
              <p className="text-gray-800 text-base mb-1">{post.content}</p>
              <div className="text-sm text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </div>
              {post.tags?.length > 0 && (
                <div className="text-xs text-emerald-600 mt-1">Tags: {post.tags.join(", ")}</div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No posts to display.</p>
        )}
      </div>
    </div>
  );
}
