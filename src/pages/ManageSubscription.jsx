import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaRegCreditCard, FaTimes } from 'react-icons/fa';

const ManageSubscription = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState('basic'); // This would come from your auth context
  const [nextBillingDate, setNextBillingDate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    // Mock data - In production, fetch from your backend
    const mockNextBilling = new Date();
    mockNextBilling.setDate(mockNextBilling.getDate() + 15); // 15 days from now
    setNextBillingDate(mockNextBilling);
  }, []);

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'cancel') {
        // API call to cancel subscription
        // await cancelSubscription();
        alert('Your subscription will remain active until the end of the billing period.');
      } else if (actionType === 'upgrade') {
        navigate('/checkout/premium');
      } else if (actionType === 'downgrade') {
        navigate('/checkout/basic');
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-purple-600 to-purple-800">
            <h1 className="text-2xl font-bold text-white">Manage Subscription</h1>
            <p className="mt-2 text-purple-200">
              Your next billing date is {nextBillingDate?.toLocaleDateString()}
            </p>
          </div>

          {/* Current Plan Info */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Current Plan: {currentPlan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {currentPlan === 'basic' 
                    ? 'Access to basic features and analytics' 
                    : 'Full access to all premium features'}
                </p>
              </div>
              <FaCrown className={`h-8 w-8 ${currentPlan === 'premium' ? 'text-yellow-400' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-6 space-y-4">
            {currentPlan === 'basic' ? (
              <button
                onClick={() => handleAction('upgrade')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaCrown className="mr-2" />
                Upgrade to Premium
              </button>
            ) : (
              <button
                onClick={() => handleAction('downgrade')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Switch to Basic Plan
              </button>
            )}

            <button
              onClick={() => handleAction('cancel')}
              className="w-full flex items-center justify-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Subscription
            </button>
          </div>

          {/* Payment Info */}
          <div className="px-6 py-6 bg-gray-50">
            <div className="flex items-center text-sm text-gray-600">
              <FaRegCreditCard className="h-5 w-5 mr-2" />
              <span>Next payment: ${currentPlan === 'basic' ? '29.00' : '49.00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {actionType === 'cancel' 
                  ? 'Cancel Subscription' 
                  : actionType === 'upgrade'
                    ? 'Upgrade to Premium'
                    : 'Switch to Basic Plan'}
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              {actionType === 'cancel'
                ? 'Your subscription will remain active until the end of your current billing period. After that, you will lose access to all features.'
                : actionType === 'upgrade'
                  ? 'You will be charged the premium rate at the start of your next billing period. Until then, you will maintain access to your current plan features.'
                  : 'Your plan will be downgraded at the start of your next billing period. Until then, you will maintain access to premium features.'}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmAction}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription; 