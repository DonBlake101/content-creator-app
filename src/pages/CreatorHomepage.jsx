import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const CreatorHomepage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  // If no plan data is available, redirect to homepage
  if (!plan) {
    navigate('/');
    return null;
  }

  const features = {
    basic: [
      'AI generated recommendations',
      'Content Calendar',
      'Detailed earnings analysis',
      'Personalized content strategy',
      'Growth tracking and analytics',
      'Hashtag and SEO optimization'
    ],
    premium: [
      'Match with top brands',
      'Custom Growth & Monetization Reports',
      'Exclusive Brand Partnership Opportunities',
      'Advanced Content Calendar'
    ]
  };

  const availableFeatures = plan.name === 'Premium' 
    ? [...features.basic, ...features.premium]
    : features.basic;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Creator Dashboard</h1>
          <p className="text-xl text-gray-600">
            {plan.name === 'Premium' ? 'Premium Member' : 'Basic Member'}
          </p>
          <p className="text-lg text-purple-600 mt-2">
            {plan.interval === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-purple-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Content Ideas</h3>
            <p className="text-gray-600">Get AI-powered content suggestions based on your niche</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-purple-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600">Track your growth and engagement metrics</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-purple-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Earnings Overview</h3>
            <p className="text-gray-600">Monitor your revenue and monetization</p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Plan Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TikTok</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">YouTube</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600">Subscribers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Snapchat</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHomepage; 