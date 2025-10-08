import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTiktok } from 'react-icons/fa';
import { generateTikTokAuthUrl, fetchAllTikTokData } from '../services/tikTokOAuthService';

const TikTokConnect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tikTokData, setTikTokData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if we have TikTok data from OAuth callback
    const savedTikTokData = localStorage.getItem('tikTokData');
    const accessToken = localStorage.getItem('tikTokAccessToken');
    
    if (savedTikTokData && accessToken) {
      setTikTokData(JSON.parse(savedTikTokData));
      setIsConnected(true);
    }

    // Check if we received data from OAuth callback
    if (location.state?.tikTokData) {
      setTikTokData(location.state.tikTokData);
      setIsConnected(true);
    }
  }, [location.state]);

  const handleConnectWithTikTok = () => {
    setIsLoading(true);
    setError('');
    
    try {
      const authUrl = generateTikTokAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate TikTok connection. Please try again.');
      setIsLoading(false);
      console.error('Error initiating TikTok OAuth:', err);
    }
  };

  // Development mode: Simulate OAuth flow
  const handleDevModeConnect = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OAuth flow with mock data
      const mockAccessToken = 'dev_mock_token_' + Math.random().toString(36).substring(7);
      const data = await fetchAllTikTokData(mockAccessToken);
      
      // Store the data
      localStorage.setItem('tikTokAccessToken', mockAccessToken);
      localStorage.setItem('tikTokData', JSON.stringify(data));
      
      setTikTokData(data);
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect in development mode. Please try again.');
      console.error('Error in development mode:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('tikTokData');
    localStorage.removeItem('tikTokAccessToken');
    setTikTokData(null);
    setIsConnected(false);
  };

  const handleNoMonetization = () => {
    localStorage.setItem('tiktok_monetization', 'false');
    navigate('/facebook');
  };

  const handleSkip = () => {
    handleNoMonetization();
  };

  const handleContinue = () => {
    navigate('/facebook');
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
            <FaTiktok className="mx-auto text-4xl mb-4 text-black" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your TikTok Account</h1>
            <p className="text-gray-600">
              {isConnected 
                ? 'Your TikTok account is connected! View your stats below.' 
                : 'Connect your TikTok account to analyze your content performance and track your growth.'
              }
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!isConnected ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    We'll securely connect to your TikTok account to access your public profile data, 
                    follower count, and video statistics to help you grow your presence.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleConnectWithTikTok}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <FaTiktok className="mr-2" />
                        Connect with TikTok
                      </>
                    )}
                  </button>

                  {/* Development Mode Button */}
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={handleDevModeConnect}
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition-colors"
                    >
                      🧪 Development Mode (Simulate Connection)
                    </button>
                  )}

                  <button
                    onClick={handleSkip}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    I don't want to monetize on this platform
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connected Account Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-green-500 mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Connected to TikTok</p>
                        <p className="text-sm text-green-600">
                          {tikTokData?.profile?.display_name || tikTokData?.profile?.username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* TikTok Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your TikTok Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Display Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {tikTokData?.profile?.display_name || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-lg font-semibold text-gray-900">
                        @{tikTokData?.profile?.username || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Followers</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {tikTokData?.stats?.follower_count?.toLocaleString() || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Following</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {tikTokData?.stats?.following_count?.toLocaleString() || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Likes</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {tikTokData?.stats?.heart_count?.toLocaleString() || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Video Count</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {tikTokData?.stats?.video_count?.toLocaleString() || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Videos */}
                {tikTokData?.videos && tikTokData.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h3>
                    <div className="space-y-3">
                      {tikTokData.videos.slice(0, 3).map((video, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 truncate">
                                {video.title || `Video ${index + 1}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {video.play_count?.toLocaleString() || 0} views • {video.comment_count?.toLocaleString() || 0} comments
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {video.heart_count?.toLocaleString() || 0}
                              </p>
                              <p className="text-xs text-gray-500">likes</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleContinue}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                  >
                    Continue to Next Platform
                  </button>

                  <button
                    onClick={handleSkip}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Skip Remaining Platforms
                  </button>
                </div>
              </div>
            )}
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

export default TikTokConnect; 