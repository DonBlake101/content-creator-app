import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const YouTubeSuccess = () => {
  const [channel, setChannel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/youtube/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.channel) setChannel(data.channel);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🎉</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube Connected!</h1>
          <p className="text-gray-600">Here are your channel stats:</p>
        </div>
        {channel ? (
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Channel Name</p>
              <p className="text-2xl font-semibold text-gray-900">{channel.title}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Subscribers</p>
              <p className="text-2xl font-semibold text-gray-900">{Number(channel.subscriberCount).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{Number(channel.viewCount).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mb-8">Loading your channel data...</div>
        )}
        <button
          onClick={() => navigate('/snapchat/connect')}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition"
        >
          Next
        </button>
      </motion.div>
    </div>
  );
};

export default YouTubeSuccess; 