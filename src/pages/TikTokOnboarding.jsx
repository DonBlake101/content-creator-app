import React, { useState } from 'react';
import axios from 'axios';

const RAPIDAPI_KEY = '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'; // Replaceable API key

const TikTokOnboarding = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchProfile = async (e) => {
    e.preventDefault();
    setProfile(null);
    setError('');
    setLoading(true);
    try {
      const response = await axios.get('https://tiktok-scraper7.p.rapidapi.com/user/info', {
        params: { unique_id: username },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
        },
      });
      if (response.data && response.data.user) {
        setProfile({
          username: response.data.user.unique_id,
          followers: response.data.user.follower_count,
        });
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('User not found or API error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">TikTok Onboarding</h2>
        <form onSubmit={handleFetchProfile} className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Enter your TikTok username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Profile'}
          </button>
        </form>
        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        {profile && (
          <div className="bg-gray-100 rounded-lg p-4 text-center mt-4">
            <div className="text-lg font-semibold">@{profile.username}</div>
            <div className="text-blue-600 text-2xl font-bold mt-2">{profile.followers.toLocaleString()} Followers</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokOnboarding; 