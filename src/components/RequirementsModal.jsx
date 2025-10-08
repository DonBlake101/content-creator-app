import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RequirementsModal = ({ isOpen, onClose, onEdit, message, isCountryError = false, onContinueAnyway }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isCountryError ? 'Country Not Eligible' : 'Requirements Not Met'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="space-y-3">
            {!isCountryError && (
              <button
                onClick={onEdit}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Details
              </button>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </button>

            <button
              onClick={() => {
                onClose();
                if (onContinueAnyway) onContinueAnyway();
              }}
              className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequirementsModal; 