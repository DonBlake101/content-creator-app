import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const TermsAccepted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brandName, campaignTitle } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
        
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Terms Accepted!
        </h2>
        
        <p className="mt-4 text-lg text-gray-600">
          You have successfully accepted the terms for "{campaignTitle}" by {brandName}.
        </p>
        
        <p className="mt-4 text-gray-600">
          The brand has been notified and will process the payment once you complete all required tasks.
        </p>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/creator-dashboard')}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAccepted; 