import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const niches = {
  'Finance & Investing': { min: 6, max: 29.30 },
  'Business': { min: 4, max: 18 },
  'Health & Fitness': { min: 4, max: 10 },
  'Real Estate': { min: 4, max: 84 },
  'Technology Reviews': { min: 2, max: 12 },
  'Auto Reviews': { min: 3, max: 10 },
  'Educational Content': { min: 2, max: 8 },
  'Entertainment': { min: 1, max: 7 },
  'Gaming': { min: 2, max: 12 },
  'Beauty and Fashion': { min: 5, max: 15 },
  'Food and Cooking': { min: 3, max: 15 },
  'Travel and Adventure': { min: 5, max: 20 },
  'DIY and Crafts': { min: 4, max: 18 },
  'Motivational': { min: 6, max: 25 },
  'Parenting': { min: 4, max: 15 },
  'Science': { min: 3, max: 20 },
  'ASMR': { min: 2, max: 10 },
  'Book Reviews': { min: 4, max: 12 }
};

const platformRates = {
  TikTok: {
    min: 0.02,
    max: 0.04,
    description: 'TikTok pays between $0.02 and $0.04 per 1,000 views'
  },
  Instagram: {
    min: 0.01,
    max: 0.05,
    description: 'Instagram pays between $0.01 and $0.05 per 1,000 views'
  },
  YouTube: {
    niches: niches,
    description: 'YouTube earnings vary by niche and RPM'
  },
  Twitch: {
    subscription: {
      tier1: 2.50, // 50% of $4.99
      tier2: 5.00, // 50% of $9.99
      tier3: 12.50, // 50% of $24.99
    },
    description: 'Twitch earnings come from subscriptions, bits, and ad revenue'
  }
};

const MoneySlider = ({ platform, views, onEarningsChange }) => {
  const [selectedNiche, setSelectedNiche] = useState('Entertainment');
  const [monetizedViews, setMonetizedViews] = useState(70); // Default 70% monetized views
  const [earnings, setEarnings] = useState(0);
  const [subscriptionTiers, setSubscriptionTiers] = useState({
    tier1: 0,
    tier2: 0,
    tier3: 0,
  });

  useEffect(() => {
    calculateEarnings();
  }, [selectedNiche, monetizedViews, views, platform, subscriptionTiers]);

  const calculateEarnings = () => {
    if (!views) return;

    let calculatedEarnings = 0;
    const monetizedViewsCount = (views * monetizedViews) / 100;

    if (platform === 'TikTok' || platform === 'Instagram') {
      const rate = platformRates[platform];
      const avgRate = (rate.min + rate.max) / 2;
      calculatedEarnings = (monetizedViewsCount * avgRate) / 1000;
    } else if (platform === 'YouTube') {
      const niche = niches[selectedNiche];
      if (!niche) return;
      const avgRPM = (niche.min + niche.max) / 2;
      calculatedEarnings = (monetizedViewsCount * avgRPM) / 1000;
    } else if (platform === 'Twitch') {
      // Calculate subscription earnings
      const subEarnings = 
        (subscriptionTiers.tier1 * platformRates.Twitch.subscription.tier1) +
        (subscriptionTiers.tier2 * platformRates.Twitch.subscription.tier2) +
        (subscriptionTiers.tier3 * platformRates.Twitch.subscription.tier3);
      
      // Add estimated ad revenue (assuming $2-4 per 1000 views)
      const adRevenue = (monetizedViewsCount * 3) / 1000;
      
      calculatedEarnings = subEarnings + adRevenue;
    }

    setEarnings(calculatedEarnings);
    onEarningsChange(calculatedEarnings);
  };

  const handleSubscriptionChange = (tier, value) => {
    setSubscriptionTiers(prev => ({
      ...prev,
      [tier]: Math.max(0, parseInt(value) || 0)
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {platform === 'YouTube' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Niche
          </label>
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            {Object.keys(niches).map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
        </div>
      )}

      {platform === 'Twitch' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Counts</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier 1 Subscribers ($4.99/month)
              </label>
              <input
                type="number"
                value={subscriptionTiers.tier1}
                onChange={(e) => handleSubscriptionChange('tier1', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier 2 Subscribers ($9.99/month)
              </label>
              <input
                type="number"
                value={subscriptionTiers.tier2}
                onChange={(e) => handleSubscriptionChange('tier2', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier 3 Subscribers ($24.99/month)
              </label>
              <input
                type="number"
                value={subscriptionTiers.tier3}
                onChange={(e) => handleSubscriptionChange('tier3', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monetized Views Percentage: {monetizedViews}%
        </label>
        <input
          type="range"
          min="40"
          max="80"
          value={monetizedViews}
          onChange={(e) => setMonetizedViews(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Estimated Monthly Earnings
        </h3>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold text-purple-600"
        >
          ${earnings.toFixed(2)}
        </motion.div>
        <p className="text-sm text-gray-600 mt-2">
          {platformRates[platform].description}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Based on {views.toLocaleString()} views with {monetizedViews}% monetization
        </p>
      </div>
    </div>
  );
};

export default MoneySlider; 