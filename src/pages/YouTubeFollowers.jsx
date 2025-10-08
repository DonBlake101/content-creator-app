import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RequirementsModal from '../components/RequirementsModal';
import { isCountryEligible } from '../utils/countryValidation';

const YouTubeFollowers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [views, setViews] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isCountryError, setIsCountryError] = useState(false);
  const [isApiError, setIsApiError] = useState(false);

  const fetchYouTubeData = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsApiError(false);

    try {
      // TODO: Replace with actual API call when API keys are available
      // For now, show API integration message
      setIsApiError(true);
      setError('API integration pending. Please enter your follower count manually.');
      
      // Clear previous data
      setFollowers('');
      setViews('');
      setEarnings(0);

    } catch (err) {
      setError('Unable to fetch YouTube data. Please try again later.');
      console.error('Error fetching YouTube data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const followerCount = parseInt(followers);
    const viewCount = parseInt(views);

    // Check if country is selected
    if (!country) {
      setError('Please select your country');
      return;
    }

    // Check if username is entered
    if (!username) {
      setError('Please enter your YouTube username');
      return;
    }

    // Check if country is eligible
    if (!isCountryEligible(country, 'youtube')) {
      setIsCountryError(true);
      setModalMessage('Unfortunately, your country does not allow for monetization on YouTube.');
      setShowModal(true);
      return;
    }

    // Check if requirements are met
    if (followerCount < 1000) {
      setModalMessage(`You currently have ${followerCount} followers. YouTube requires a minimum of 1,000 followers for monetization.`);
      setShowModal(true);
      return;
    }

    navigate('/snapchat-followers', {
      state: {
        ...location.state,
        youtube: {
          followers: followerCount,
          views: viewCount,
          earnings: parseInt(earnings),
          country,
        },
      },
    });
  };

  const handleSkip = () => {
    navigate('/snapchat-followers', {
      state: {
        ...location.state,
        youtube: {
          followers: 0,
          views: 0,
          earnings: 0,
          skipped: true,
        },
      },
    });
  };

  const handleContinueAnyway = () => {
    const followerCount = parseInt(followers);
    const viewCount = parseInt(views);

    navigate('/snapchat-followers', {
      state: {
        ...location.state,
        youtube: {
          followers: followerCount,
          views: viewCount,
          earnings: parseInt(earnings),
          country,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YouTube Requirements
          </h1>
          <p className="text-xl text-gray-600">
            Enter your YouTube details to check monetization eligibility
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Country Selection */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Your Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Select your country</option>
              <option value="Algeria">Algeria</option>
              <option value="Argentina">Argentina</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Belgium">Belgium</option>
              <option value="Brazil">Brazil</option>
              <option value="Canada">Canada</option>
              <option value="Colombia">Colombia</option>
              <option value="Denmark">Denmark</option>
              <option value="Egypt">Egypt</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Ireland">Ireland</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="South Korea">South Korea</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Libya">Libya</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Mexico">Mexico</option>
              <option value="Morocco">Morocco</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palestine">Palestine</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Qatar">Qatar</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Singapore">Singapore</option>
              <option value="Spain">Spain</option>
              <option value="Sweden">Sweden</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>

          {/* Username Input */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-2">
              YouTube Username
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your YouTube username"
                className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <button
                onClick={fetchYouTubeData}
                disabled={isLoading || !username}
                className={`px-6 py-4 rounded-lg font-medium ${
                  isLoading || !username
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isLoading ? 'Loading...' : 'Fetch Data'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {isApiError && (
              <p className="mt-2 text-sm text-yellow-600">
                Note: API integration is pending. Please enter your follower count manually.
              </p>
            )}
          </div>

          {/* Manual Input Section */}
          {isApiError && (
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-2">
                Manual Subscriber Count
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={followers}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setFollowers(count.toString());
                    // We'll get real views from the API when integrated
                    setViews('0');
                    setEarnings(0);
                  }}
                  placeholder="Enter your subscriber count"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  subscribers
                </div>
              </div>
            </div>
          )}

          {/* Display Fetched Data */}
          {followers && (
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Subscribers
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={followers}
                    readOnly
                    className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    subscribers
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum requirement: 1,000 subscribers
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Monthly Views
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={views}
                    readOnly
                    className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    views
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Will be fetched from YouTube API when integrated
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Estimated Monthly Earnings
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`$${earnings.toFixed(2)}`}
                    readOnly
                    className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    USD
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Based on $0.01 to $0.03 per view
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={!followers || !country || !username}
              className={`btn-primary ${(!followers || !country || !username) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue
            </motion.button>
          </div>
        </div>
      </div>

      <RequirementsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onEdit={() => {
          setShowModal(false);
          setUsername('');
          setFollowers('');
          setViews('');
          setEarnings(0);
        }}
        message={modalMessage}
        isCountryError={isCountryError}
        onContinueAnyway={handleContinueAnyway}
      />
    </div>
  );
};

export default YouTubeFollowers; 