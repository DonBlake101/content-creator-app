import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-24 pb-16 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Elevate Your Content Creation
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Build, manage, and grow your creator business with our AI-powered platform and expert analytics
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/tiktok/connect"
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Watch Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm font-medium mb-8">
            TRUSTED BY CREATORS FROM
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <img src="/assets/images/youtube-logo.svg" alt="YouTube" className="h-8" />
            <img src="/assets/images/tiktok-logo.svg" alt="TikTok" className="h-8" />
            <img src="/assets/images/instagram-logo.svg" alt="Instagram" className="h-8" />
            <img src="/assets/images/snapchat-logo.svg" alt="Snapchat" className="h-8" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Powerful tools to grow your audience and maximize earnings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analytics",
                description: "Get deep insights into your content performance and audience engagement across all platforms",
                icon: "📊"
              },
              {
                title: "Smart Recommendations",
                description: "Receive personalized content suggestions and optimization tips based on your niche",
                icon: "🎯"
              },
              {
                title: "Brand Connections",
                description: "Connect with brands that match your audience and content style",
                icon: "🤝"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Grow Your Creator Business
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform helps creators increase their earnings by an average of 300% through smart analytics and AI-powered recommendations.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-purple-600">300%</div>
                  <p className="text-gray-600">Average Growth</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <p className="text-gray-600">Active Creators</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-50 rounded-2xl transform rotate-3"></div>
              <img
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                className="relative rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Growing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who are growing their audience and earnings with our platform
          </p>
          <Link
            to="/tiktok/connect"
            className="inline-block px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 