import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MoneySlider from '../components/MoneySlider';

const TwitchFollowers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRange, setSelectedRange] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [meetsAffiliateRequirements, setMeetsAffiliateRequirements] = useState(false);
  const [meetsPartnerRequirements, setMeetsPartnerRequirements] = useState(false);

  const followerRanges = [
    '0 - 50',
    '50 - 100',
    '100 - 500',
    '500 - 1,000',
    '1,000 - 5,000',
    '5,000 - 10,000',
    '10,000+',
  ];

  const affiliateRequirements = [
    'Have at least 50 followers',
    'Stream for a minimum of 8 hours',
    'Stream on 7 different days',
    'Maintain an average of 3 concurrent viewers',
  ];

  const partnerRequirements = [
    'Stream for 25 hours',
    'Stream on 12 different days',
    'Maintain an average of 75 concurrent viewers',
  ];

  const monetizationFeatures = {
    affiliate: [
      'Subscriptions (Tier 1: $4.99, Tier 2: $9.99, Tier 3: $24.99)',
      'Bits (Viewer donations)',
      'Game Sales Revenue',
    ],
    partner: [
      'All Affiliate features',
      'Ad Revenue',
      'Custom Emotes',
      'Priority Support',
    ],
  };

  const handleContinue = () => {
    if (selectedRange) {
      navigate('/paywall', {
        state: {
          ...location.state,
          twitch: {
            platform: 'Twitch',
            followers: selectedRange,
            earnings: earnings,
            isPartner: meetsPartnerRequirements,
            isAffiliate: meetsAffiliateRequirements,
          },
        },
      });
    }
  };

  const handleSkip = () => {
    navigate('/paywall', {
      state: {
        ...location.state,
        twitch: {
          platform: 'Twitch',
          skipped: true,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-purple-50 py-12 px-4 w-full">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Twitch Channel Stats
          </h1>
          <p className="text-xl text-gray-600">
            Let's calculate your potential earnings based on your Twitch performance
          </p>
        </motion.div>

        {/* Requirements Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Twitch Affiliate Program Requirements</h2>
          <div className="space-y-3">
            {affiliateRequirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={meetsAffiliateRequirements}
                onChange={(e) => setMeetsAffiliateRequirements(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">I meet Affiliate requirements</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Twitch Partner Program Requirements</h2>
          <div className="space-y-3">
            {partnerRequirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={meetsPartnerRequirements}
                onChange={(e) => setMeetsPartnerRequirements(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">I meet Partner requirements</span>
            </label>
          </div>
        </div>

        {/* Monetization Features */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Monetization Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Affiliate Features</h3>
              <ul className="space-y-2">
                {monetizationFeatures.affiliate.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Partner Features</h3>
              <ul className="space-y-2">
                {monetizationFeatures.partner.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Follower Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Select Your Follower Range</h2>
          <div className="space-y-3">
            {followerRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`follower-range ${
                  selectedRange === range ? 'selected' : ''
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Money Slider */}
        {selectedRange && (meetsAffiliateRequirements || meetsPartnerRequirements) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <MoneySlider
              platform="Twitch"
              views={0}
              onEarningsChange={setEarnings}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col space-y-4">
          <motion.button
            onClick={handleContinue}
            disabled={!selectedRange || !subscriptionTiers.tier1}
            className={`btn-primary ${
              (!selectedRange || !subscriptionTiers.tier1) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue
          </motion.button>
          
          <motion.button
            onClick={handleSkip}
            className="skip-button"
          >
            Skip Twitch (I don't plan to monetize here)
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TwitchFollowers; 