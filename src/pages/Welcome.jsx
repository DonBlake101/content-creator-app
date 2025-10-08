import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTiktok, FaFacebook, FaYoutube, FaSnapchat, FaRocket, FaUsers, FaChartLine, FaHandshake, FaDatabase, FaComments, FaMoneyBillWave, FaGlobe } from 'react-icons/fa';

const Welcome = () => {
  const navigate = useNavigate();

  const handleCreatorStart = () => {
    navigate('/tiktok');
  };

  const handleBrandStart = () => {
    navigate('/brand-onboarding');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[500px] bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2674&q=80"
          alt="Content creators recording themselves with an iPhone"
          className="absolute inset-0 w-full h-full object-cover opacity-85 z-0"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 mb-6 leading-tight drop-shadow-lg text-center" style={{ fontFamily: 'Gaglin, sans-serif' }}>
            Turn your side hustle into a full time income
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl text-center">
            Track, Manage & Grow your Social Media.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={handleCreatorStart}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-purple-700 transition"
            >
              I'm a Creator
            </button>
            <button 
              onClick={handleBrandStart}
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition"
            >
              I'm a Brand
            </button>
          </div>
        </div>
      </section>

      {/* Build Section - Similar to Tribe */}
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              All your Social Media Data In One Place
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The creator economy is here. Start building your empire today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-purple-600 p-3 rounded-full mr-4">
                  <FaChartLine className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Grow your social media</h3>
                  <p className="text-gray-300">Detailed insights and AI recommendations to help you grow your following.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-600 p-3 rounded-full mr-4">
                  <FaRocket className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Plan and Schedule Content</h3>
                  <p className="text-gray-300">Stay organized with a smart content calendar built for creators. Plan posts, set goals, and stay consistent.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-600 p-3 rounded-full mr-4">
                  <FaMoneyBillWave className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Understand Your Earnings</h3>
                  <p className="text-gray-300">Track every dollar earned across your platforms with clear, easy-to-read reports.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-600 p-3 rounded-full mr-4">
                  <FaHandshake className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Match with Top Brands</h3>
                  <p className="text-gray-300">Connect with brands that fit your niche — accept, negotiate, and secure paid collaborations directly inside the app.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Creator Community" 
                className="rounded-2xl shadow-2xl shadow-purple-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to connect, collaborate, and grow with creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 transform hover:scale-105">
            <div className="text-purple-400 text-4xl mb-4">
              <FaRocket />
            </div>
            <h3 className="text-xl font-bold mb-2">Launch Your Brand</h3>
            <p className="text-gray-300">Connect with creators who align with your brand values and reach your target audience.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 transform hover:scale-105">
            <div className="text-purple-400 text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold mb-2">Grow Your Audience</h3>
            <p className="text-gray-300">Expand your reach and engage with new audiences through authentic creator partnerships.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 transform hover:scale-105">
            <div className="text-purple-400 text-4xl mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Performance</h3>
            <p className="text-gray-300">Measure the impact of your campaigns with detailed analytics and insights.</p>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Get Started Today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={handleCreatorStart}
            >
              <div className="text-purple-400 text-5xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-2xl font-bold mb-4">I'm a Creator</h3>
              <p className="text-gray-300 mb-6">Connect with brands, create content, and monetize your influence.</p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors">
                Start Creating
              </button>
            </div>
            <div 
              className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={handleBrandStart}
            >
              <div className="text-purple-400 text-5xl mb-4">
                <FaHandshake />
              </div>
              <h3 className="text-2xl font-bold mb-4">I'm a Brand</h3>
              <p className="text-gray-300 mb-6">Find the perfect creators to promote your products and services.</p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors">
                Start as Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 