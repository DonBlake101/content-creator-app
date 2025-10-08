import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const FACEBOOK_APP_ID = '141991111111111';
const REDIRECT_URI = 'http://localhost:5174/facebook';
const SCOPES = 'public_profile,email,pages_show_list,pages_read_engagement';

export const getFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

const getCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};

const FacebookConnect = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [engagementRate, setEngagementRate] = useState('0%');
  const [accessToken, setAccessToken] = useState('');
  const [pages, setPages] = useState([]);
  const [pageFollowers, setPageFollowers] = useState([]);
  const [pageInsights, setPageInsights] = useState([]);

  const fetchFacebookData = async (username) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        followers: Math.floor(Math.random() * 100000) + 1000,
        engagementRate: (Math.random() * 5 + 1).toFixed(2)
      };
      
      setFollowers(mockData.followers);
      setEngagementRate(mockData.engagementRate + '%');
      // Navigate to YouTube Connect after successful connection
      setTimeout(() => navigate('/youtube'), 1000);
    } catch (error) {
      console.error('Error fetching Facebook data:', error);
      setFollowers(0);
      setEngagementRate('0%');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoMonetization = () => {
    localStorage.setItem('facebook_monetization', 'false');
    navigate('/youtube');  // Navigate directly to YouTube Connect
  };

  const handleConnect = async () => {
    if (!username) {
      setError('Please enter your Facebook username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await fetchFacebookData(username);
    } catch (err) {
      setError('Failed to connect to Facebook API. Please try again.');
      console.error('Error connecting to Facebook:', err);
    }
  };

  const handleSkip = () => {
    // Navigate to YouTube connect when skipping
    handleNoMonetization();
  };

  // Handle OAuth redirect
  useEffect(() => {
    const code = getCodeFromUrl();
    if (code && !accessToken) {
      setIsLoading(true);
      setError('');
      // Exchange code for access token
      axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        params: {
          client_id: FACEBOOK_APP_ID,
          redirect_uri: REDIRECT_URI,
          client_secret: 'YOUR_FACEBOOK_APP_SECRET', // TODO: Replace with your app secret (should be done server-side in production)
          code,
        },
      })
        .then(res => {
          setAccessToken(res.data.access_token);
          // Fetch pages
          return axios.get('https://graph.facebook.com/v18.0/me/accounts', {
            params: { access_token: res.data.access_token }
          });
        })
        .then(res => {
          setPages(res.data.data);
          // Fetch followers and insights for each page
          return Promise.all(res.data.data.map(page =>
            Promise.all([
              axios.get(`https://graph.facebook.com/v18.0/${page.id}`, {
                params: { fields: 'followers_count', access_token: page.access_token }
              }),
              axios.get(`https://graph.facebook.com/v18.0/${page.id}/insights/page_engaged_users`, {
                params: { access_token: page.access_token }
              })
            ])
          ));
        })
        .then(results => {
          setPageFollowers(results.map(([followersRes]) => followersRes.data.followers_count));
          setPageInsights(results.map(([, insightsRes]) => insightsRes.data.data));
          setIsLoading(false);
        })
        .catch(err => {
          setError('Failed to connect to Facebook or fetch data.');
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">👥</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Facebook Account</h1>
            <p className="text-gray-600">Connect your Facebook to analyze your content performance</p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => window.location.href = getFacebookAuthUrl()}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Login with Facebook'}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              {/* No Monetization Option */}
              <button
                onClick={handleNoMonetization}
                className="w-full mt-3 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none"
                type="button"
              >
                I don't want to monetize on this platform
              </button>
            </div>

            {pages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Facebook Pages</h3>
                <div className="space-y-4">
                  {pages.map((page, idx) => (
                    <div key={page.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Page Name: <span className="font-semibold text-gray-900">{page.name}</span></p>
                      <p className="text-sm text-gray-500">Followers: <span className="font-semibold text-gray-900">{pageFollowers[idx] ?? 'N/A'}</span></p>
                      <p className="text-sm text-gray-500">Engaged Users: <span className="font-semibold text-gray-900">{pageInsights[idx]?.[0]?.values?.[0]?.value ?? 'N/A'}</span></p>
                    </div>
                  ))}
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

export default FacebookConnect; 