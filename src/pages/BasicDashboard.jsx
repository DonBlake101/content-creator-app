import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContentCalendar from './ContentCalendar';
import Analytics from './Analytics';
import PersonalizedContent from './PersonalizedContent';
import EarningsAnalysis from './EarningsAnalysis';

const BasicDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  // Handle plan state from localStorage and location state
  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan');
    const locationPlan = location.state?.plan;
    
    if (locationPlan) {
      if (locationPlan.name === 'Basic') {
        localStorage.setItem('userPlan', 'basic');
      }
    } else if (savedPlan) {
      // Ensure we're on basic plan
      localStorage.setItem('userPlan', 'basic');
    }
    
    // Clear the location state to prevent re-triggering on refresh
    if (locationPlan) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('userPlan', 'basic');
  }, []);

  const handleFeatureClick = (featureId) => {
    navigate(`/${featureId}`);
  };

  const handleUpgradeClick = () => {
    navigate('/paywall', { 
      state: { 
        from: 'dashboard',
        selectedPlan: 'premium'
      } 
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userPlan');
    navigate('/');
  };

  const features = [
    {
      id: 'content-calendar',
      title: 'Content Calendar',
      description: 'Plan and schedule your content',
      icon: '📅',
      color: 'bg-blue-500',
      component: ContentCalendar
    },
    {
      id: 'analytics',
      title: 'Growth & Analytics',
      description: 'Track your growth and engagement',
      icon: '📊',
      color: 'bg-green-500',
      component: Analytics
    },
    {
      id: 'personalized-content',
      title: 'Personalized Content',
      description: 'Get content suggestions and ideas',
      icon: '💡',
      color: 'bg-purple-500',
      component: PersonalizedContent
    },
    {
      id: 'earnings-analysis',
      title: 'Earnings Analysis',
      description: 'Monitor your revenue and performance',
      icon: '💰',
      color: 'bg-yellow-500',
      component: EarningsAnalysis
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Basic Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Basic Plan
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  {showSettings && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <button
                        onClick={() => {
                          navigate('/rpm-settings');
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Change RPM ($)
                      </button>
                      <button
                        onClick={() => {
                          navigate('/platform-settings');
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Manage Platforms
                      </button>
                      <button
                        onClick={() => {
                          navigate('/manage-membership');
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Manage Membership
                      </button>
                      <button
                        onClick={() => {
                          navigate('/faq');
                          setShowSettings(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <span role="img" aria-label="book" className="mr-2">📘</span>
                        FAQ
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-2xl mr-4`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{feature.title}</h2>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {location.pathname === '/analytics' && (
            <Analytics key="analytics-component" />
          )}
          {location.pathname === '/content-calendar' && (
            <ContentCalendar />
          )}
          {location.pathname === '/personalized-content' && (
            <PersonalizedContent />
          )}
          {location.pathname === '/earnings-analysis' && (
            <EarningsAnalysis />
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard; 