import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const Paywall = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Paywall mounted');
    console.log('Location state:', location.state);
  }, [location.state]);

  const handleGetStarted = (plan) => {
    // Pass the selected plan name to the checkout page
    navigate('/checkout', { state: { planName: plan.name } });
  };

  const plans = [
    {
      name: 'Basic Plan',
      price: 14,
      yearlyPrice: 149,
      features: [
        'Video Recommendations',
        'Earnings analysis',
        'Personalized content strategy',
        'Growth tracking and analytics',
        'Content Calendar'
      ],
      mainFeatures: [
        { label: 'Video Recommendations', color: 'bg-purple-100 text-purple-700' },
        { label: 'Content Calendar', color: 'bg-purple-100 text-purple-700' },
        { label: 'Earnings analysis', color: 'bg-purple-100 text-purple-700' },
        { label: 'Growth Tracking', color: 'bg-purple-100 text-purple-700' }
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Premium',
      price: 29,
      yearlyPrice: 299,
      features: [
        'Get paid by top brands',
        'Custom Statistics Report',
        'Content Calendar',
        'Video and Title Recommendations',
        'Earnings analysis',
        'Growth tracking and analytics'
      ],
      mainFeatures: [
        { label: 'Brand Database', color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Content Calendar', color: 'bg-yellow-200 text-yellow-800' },
        { label: 'Earnings analysis', color: 'bg-yellow-200 text-yellow-800' }
      ],
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  // All variables set to 0 until API integration
  const currentMonthlyEarnings = 0;
  const potentialMonthlyEarnings = 0; // Will be calculated using the formula once APIs are connected

  const featureIcons = {
    'Video Recommendations': '🎬',
    'Earnings analysis': '📊',
    'Personalized content strategy': '🧠',
    'Growth tracking and analytics': '📈',
    'Growth Tracking': '📈',
    'Content Calendar': '🗓️',
    'Get paid by top brands': '💰',
    'Custom Statistics Report': '📑',
    'Video and Title Recommendations': '🎥',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Select the perfect plan for your content creation journey</p>
        </div>

        {/* Earnings Estimation Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Earnings Potential</h2>
              <p className="text-gray-600">Connect your platforms to see your earnings potential</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Monthly Earnings</h3>
                <div className="text-3xl font-bold text-gray-900">${currentMonthlyEarnings.toLocaleString()}</div>
                <p className="text-gray-600 mt-2">Connect your platforms to see your earnings</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Potential Monthly Earnings</h3>
                <div className="text-3xl font-bold text-yellow-700">${potentialMonthlyEarnings.toLocaleString()}</div>
                <p className="text-yellow-800 mt-2">Connect platforms to calculate potential</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-green-700 font-medium">
                  Connect your platforms to see potential increase
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                plan.name === 'Premium' ? 'border-2 border-yellow-400 relative' : ''
              }`}
            >
              <div className={`p-8 ${plan.name === 'Premium' ? 'bg-gradient-to-b from-yellow-50 to-white' : ''}`}>
                <div className="text-center mb-8">
                  <h2 className={`text-2xl font-bold ${plan.name === 'Premium' ? 'text-yellow-600' : 'text-gray-900'} mb-4`}>
                    {plan.name}
                  </h2>
                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${plan.name === 'Premium' ? 'text-yellow-600' : 'text-purple-600'}`}>
                      ${plan.price}
                    </div>
                    <div className="text-gray-500">per month</div>
                    <div className="text-lg text-gray-600">or ${plan.yearlyPrice}/year (${(plan.yearlyPrice / 12).toFixed(2)}/mo)</div>
                    <div className="text-sm text-green-600">Save 17% with yearly billing</div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {plan.mainFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${feature.color}`}
                      >
                        {feature.label}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => {
                    // Gold highlight for premium-only features
                    const isGoldPremium = plan.name === 'Premium' && (feature === 'Get paid by top brands' || feature === 'Custom Statistics Report');
                    return (
                      <li key={idx} className="flex items-start">
                        <span className={`mr-2 text-xl ${isGoldPremium ? 'text-yellow-500' : plan.name === 'Premium' ? 'text-yellow-600' : 'text-purple-600'}`}>{featureIcons[feature] || '•'}</span>
                        <span className={`flex items-center ${isGoldPremium ? 'text-yellow-700 font-semibold' : 'text-gray-700'}`}>
                          {feature}
                          {isGoldPremium && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">Premium</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    plan.name === 'Premium'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  Start Earning More Today
                </button>
                <div className="mt-4 text-center space-y-1">
                  <div className="text-gray-700 text-sm flex items-center justify-center gap-2">
                    <span role="img" aria-label="lock">🔒</span> Secure payments powered by Apple
                  </div>
                  <div className="text-gray-500 text-xs">No hidden fees — Cancel anytime</div>
                  <div className="flex items-center justify-center mt-2">
                    {/* Apple iOS App Store stars template placeholder */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-gray-900 font-semibold text-sm">5.0</span>
                      </div>
                      <div className="text-xs text-gray-500">1,234 Ratings</div>
                      {/* TODO: Replace with dynamic API data for iOS App Store reviews */}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Paywall; 