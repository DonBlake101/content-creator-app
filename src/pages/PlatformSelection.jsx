import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PlatformSelection = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      description: 'Connect your TikTok account to track your growth',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      description: 'Connect your Facebook account to track your growth',
      color: 'from-[#1877F2] to-[#166FE5]'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '🎥',
      description: 'Connect your YouTube account to track your growth',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      description: 'Connect your Snapchat account to track your growth',
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  const handlePlatformSelect = (platform) => {
    const route = platform.id === 'facebook' ? '/facebook/connect' : `/${platform.id}/connect`;
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect Your Platforms</h1>
          <p className="text-xl text-gray-600">Select the platforms you want to analyze</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={() => handlePlatformSelect(platform)}
            >
              <div className={`h-2 bg-gradient-to-r ${platform.color}`}></div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{platform.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{platform.name}</h2>
                </div>
                <p className="text-gray-600">{platform.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformSelection; 