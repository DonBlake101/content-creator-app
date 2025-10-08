import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTiktok } from 'react-icons/fa';
import { exchangeCodeForToken, fetchAllTikTokData } from '../services/tikTokOAuthService';

const TikTokOAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [error, setError] = useState('');
  const [tikTokData, setTikTokData] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        setStatus('error');
        setError(`OAuth error: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        setStatus('processing');
        
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code);
        
        // Fetch TikTok data
        const data = await fetchAllTikTokData(accessToken);
        
        // Store the data in localStorage for use in other components
        localStorage.setItem('tikTokAccessToken', accessToken);
        localStorage.setItem('tikTokData', JSON.stringify(data));
        
        setTikTokData(data);
        setStatus('success');
        
        // Redirect to TikTok connect page after a short delay
        setTimeout(() => {
          navigate('/tiktok/connect', { 
            state: { 
              tikTokData: data,
              accessToken: accessToken 
            } 
          });
        }, 2000);
        
      } catch (err) {
        console.error('TikTok OAuth callback error:', err);
        setStatus('error');
        setError(err.message || 'Failed to complete TikTok authentication');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Connecting to TikTok...</h2>
            <p className="text-gray-600">Please wait while we authenticate your account</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">Successfully Connected!</h2>
            <p className="text-gray-600 mb-4">Your TikTok account has been connected successfully</p>
            {tikTokData?.profile && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Connected Account</p>
                <p className="text-lg font-semibold">{tikTokData.profile.display_name || tikTokData.profile.username}</p>
                {tikTokData.stats?.follower_count && (
                  <p className="text-sm text-gray-600">{tikTokData.stats.follower_count.toLocaleString()} followers</p>
                )}
              </div>
            )}
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Connection Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/tiktok/connect')}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors mr-2"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/facebook')}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Skip TikTok
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 mx-4"
      >
        <div className="text-center mb-6">
          <FaTiktok className="mx-auto text-4xl mb-4 text-black" />
          <h1 className="text-2xl font-bold text-gray-900">TikTok Authentication</h1>
        </div>
        
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default TikTokOAuthCallback; 