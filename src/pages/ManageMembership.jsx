import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const userPlan = localStorage.getItem('userPlan') === 'premium' ? 'Premium' : 'Basic';
const nextBillingDate = '2024-07-31'; // Mocked for now

// Format date to DD/MM/YY
const formatDate = (isoDate) => {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const ManageMembership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [actionMessage, setActionMessage] = useState('');

  // Determine source dashboard
  const fromCreatorDashboard = location.pathname.includes('creator') || location.state?.from === 'creator-dashboard';

  const handleUpgrade = () => {
    if (window.confirm('Are you sure you want to upgrade to the Premium plan? You will keep Basic access until the end of your current term, then be switched to Premium and charged $39.')) {
      setActionMessage('You will keep Basic access until the end of your current term. After that, you will be switched to the Premium plan and charged $39.');
      setTimeout(() => navigate('/basic-dashboard'), 2000);
    }
  };

  const handleDowngrade = () => {
    if (window.confirm('Are you sure you want to downgrade to the Basic plan? You will keep Premium access until the end of your current term, then be switched to Basic.')) {
      setActionMessage('You will keep Premium access until the end of your current term. After that, you will be switched to the Basic plan.');
      setTimeout(() => navigate('/creator-dashboard'), 2000);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your membership? You will keep access until the end of your current term.')) {
      setActionMessage('Your membership will remain active until the end of your current term.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-purple-700 px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-purple-500 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400 opacity-30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-700 opacity-20 rounded-full blur-2xl animate-pulse"></div>
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-wide drop-shadow-lg">Manage Membership</h2>
        <div className="mb-8 bg-white/20 rounded-xl p-6 shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-white/80">Current Plan:</span>
            <span className="text-purple-300 font-bold text-lg">{userPlan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white/80">Next Billing Date:</span>
            <span className="text-white/90">{formatDate(nextBillingDate)}</span>
          </div>
        </div>
        {userPlan === 'Basic' && !fromCreatorDashboard && (
          <button
            className="w-full mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-colors font-bold shadow-lg tracking-wide text-lg"
            onClick={handleUpgrade}
          >
            Upgrade
          </button>
        )}
        {userPlan === 'Premium' && fromCreatorDashboard && (
          <button
            className="w-full mb-4 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-xl hover:from-red-600 hover:to-red-800 transition-colors font-bold shadow-lg tracking-wide text-lg"
            onClick={handleDowngrade}
          >
            Downgrade
          </button>
        )}
        <button
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl hover:from-gray-800 hover:to-black transition-colors font-bold shadow-lg tracking-wide text-lg mb-2"
          onClick={handleCancel}
        >
          Cancel Membership
        </button>
        {actionMessage && (
          <div className="mt-4 text-center text-white bg-purple-800/80 rounded-lg p-4 shadow-inner animate-fade-in">
            {actionMessage}
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full text-purple-200 hover:text-white text-lg font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ManageMembership; 