import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CLIENT_ID = '176287385381-njpdr1ftjp4cu808nu76js9nqsm623a2.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:5173/oauth2callback';
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

const YouTubeConnect = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('youtubeAuthenticated')) {
      fetch('http://localhost:5000/api/youtube/analytics')
        .then(res => res.json())
        .then(data => setChannel(data.channel));
      localStorage.removeItem('youtubeAuthenticated');
    }
  }, []);

  const handleConnectWithYouTube = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;
    window.location.href = url;
  };

  const handleSkip = () => {
    navigate('/snapchat/connect');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🎥</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your YouTube Account</h1>
            <p className="text-gray-600">Connect your YouTube account to analyze your content performance</p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={handleConnectWithYouTube}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="mr-2">🎥</span> Connect with YouTube
                </button>
              </div>

              <button
                onClick={handleSkip}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                I don't want to monetize on this platform
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your YouTube Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Channel Name</p>
                  <p className="text-2xl font-semibold text-gray-900">{channel ? channel.title : '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Subscribers</p>
                  <p className="text-2xl font-semibold text-gray-900">{channel ? channel.subscriberCount : 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By connecting your account, you agree to our Terms of Service and{' '}
              <span
                className="underline cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => navigate('/privacy-policy')}
                tabIndex={0}
                role="button"
                aria-label="View Privacy Policy"
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YouTubeConnect; 