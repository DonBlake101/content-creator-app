import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import coinIcon from '../assets/Coin.png';

const APP_NAME = 'Content Creator App';
const APP_ICON = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-3bQw1QkQb1Qw1QkQb1Qw1QkQ/user-asset-coin.png'; // Coin image

const PLAN_DATA = {
  'Basic Plan': {
    name: 'Basic Plan',
    monthly: 14,
    yearly: 149,
    description: 'Basic features',
  },
  'Premium': {
    name: 'Premium',
    monthly: 29,
    yearly: 299,
    description: 'Premium features',
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlanName = location.state?.planName || 'Basic Plan';
  const plan = PLAN_DATA[selectedPlanName] || PLAN_DATA['Basic Plan'];
  const [isYearly, setIsYearly] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  // Card details state
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    return value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry as MM/YY
  const formatExpiry = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError('');
    // Simple validation
    if (!name || !cardNumber || !expiry || !cvc) {
      setError('Please fill in all card details.');
      return;
    }
    setPurchaseStatus('processing');
    setTimeout(() => {
      setPurchaseStatus('success');
      if (plan.name === 'Basic Plan') {
        navigate('/basic-dashboard');
      } else if (plan.name === 'Premium') {
        navigate('/creator-dashboard');
      } else {
        navigate('/success');
      }
    }, 2000);
  };

  const handleRestorePurchases = () => {
    setPurchaseStatus('restoring');
    setTimeout(() => {
      setPurchaseStatus('restored');
      alert('Purchases restored successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* App Icon and Name */}
        <img src={coinIcon} alt="App Icon" className="w-16 h-16 rounded-2xl mb-3 shadow" />
        <h1 className="text-xl font-bold text-gray-900 mb-1">{APP_NAME}</h1>
        <p className="text-gray-500 text-sm mb-6">Subscription</p>

        {/* Single Plan Card */}
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center w-full mb-6">
          <div className="text-lg font-semibold text-gray-900">{plan.name}</div>
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="text-2xl font-bold text-blue-600">
              ${isYearly ? plan.yearly : plan.monthly}
              <span className="text-base font-normal text-gray-500">/{isYearly ? 'year' : 'month'}</span>
            </span>
            <label className="flex items-center ml-4 cursor-pointer select-none">
              <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-400'}`}>Monthly</span>
              <span className="mx-2 relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  checked={isYearly}
                  onChange={() => setIsYearly((v) => !v)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  style={{ left: isYearly ? '1.25rem' : '0' }}
                />
                <span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300"></span>
              </span>
              <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-gray-400'}`}>Yearly</span>
            </label>
          </div>
          <div className="text-gray-500 text-sm mb-3">{plan.description}</div>
          {/* Card Details Form */}
          <form className="w-full flex flex-col gap-3 mt-2" onSubmit={handleSubscribe}>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Name on Card"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Card Number"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value).slice(0, 19))}
              maxLength={19}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                className="w-1/2 border rounded px-3 py-2"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value).slice(0, 5))}
                maxLength={5}
                required
              />
              <input
                type="text"
                className="w-1/2 border rounded px-3 py-2"
                placeholder="CVC"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={purchaseStatus === 'processing'}
              className="w-full bg-blue-600 text-white text-base font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-blue-300 mt-2"
            >
              {purchaseStatus === 'processing' ? 'Processing...' : `Subscribe`}
            </button>
          </form>
        </div>

        {/* Restore Purchases */}
        <button
          onClick={handleRestorePurchases}
          disabled={purchaseStatus === 'restoring'}
          className="text-blue-500 hover:text-blue-600 text-sm mt-2 disabled:text-blue-300"
        >
          {purchaseStatus === 'restoring' ? 'Restoring...' : 'Restore Purchases'}
        </button>
      </div>
    </div>
  );
};

export default Checkout; 