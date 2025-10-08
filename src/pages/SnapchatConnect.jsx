import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SnapchatConnect = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [engagementRate, setEngagementRate] = useState('0%');

  const fetchSnapchatData = async (username) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        followers: Math.floor(Math.random() * 100000) + 1000,
        engagementRate: (Math.random() * 5 + 1).toFixed(2)
      };
      
      setFollowers(mockData.followers);
      setEngagementRate(mockData.engagementRate + '%');
      // Navigate to Paywall after successful connection
      setTimeout(() => navigate('/paywall'), 1000);
    } catch (error) {
      console.error('Error fetching Snapchat data:', error);
      setFollowers(0);
      setEngagementRate('0%');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoMonetization = () => {
    localStorage.setItem('snapchat_monetization', 'false');
    navigate('/paywall');  // Navigate directly to Paywall
  };

  const handleConnect = async () => {
    if (!username) {
      setError('Please enter your Snapchat username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await fetchSnapchatData(username);
    } catch (err) {
      setError('Failed to connect to Snapchat API. Please try again.');
      console.error('Error connecting to Snapchat:', err);
    }
  };

  const handleSkip = () => {
    // Navigate to paywall when skipping
    handleNoMonetization();
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
            <span className="text-4xl mb-4 block">👻</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Snapchat Account</h1>
            <p className="text-gray-600">Enter your Snapchat username to analyze your content performance</p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Snapchat Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Enter your Snapchat username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect Account'}
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  I don't want to monetize on this platform
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Snapchat Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="text-2xl font-semibold text-gray-900">{followers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Engagement Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{engagementRate}</p>
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

export default SnapchatConnect; 