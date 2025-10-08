import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const niches = [
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'beauty', name: 'Beauty & Fashion', icon: '💄' },
  { id: 'tech', name: 'Tech & Gadgets', icon: '💻' },
  { id: 'food', name: 'Food & Cooking', icon: '🍳' },
  { id: 'fitness', name: 'Fitness & Health', icon: '💪' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '✨' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'art', name: 'Art & Design', icon: '🎨' },
  { id: 'business', name: 'Business & Finance', icon: '💼' },
  { id: 'other', name: 'Other', icon: '🌟' },
];

export default function NicheSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What's Your Niche?
          </h1>
          <p className="text-xl text-gray-600">
            Select your primary content category to get personalized recommendations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {niches.map((niche, index) => (
            <motion.button
              key={niche.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tiktok-followers')}
              className="card flex flex-col items-center justify-center p-6 text-center hover:bg-primary-50 transition-colors duration-200"
            >
              <span className="text-4xl mb-3">{niche.icon}</span>
              <span className="font-semibold text-gray-900">{niche.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 