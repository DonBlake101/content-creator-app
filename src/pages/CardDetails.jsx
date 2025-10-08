import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaypal, FaLock, FaCheck } from 'react-icons/fa';
import mockPaypalApi from '../services/paypalService';

const CardDetails = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState('');

  useEffect(() => {
    // Check if PayPal is already connected
    const connected = mockPaypalApi.isAccountConnected();
    if (connected) {
      setIsConnected(true);
      setConnectedEmail(mockPaypalApi.getPaypalEmail());
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 'login' && email) {
      setStep('password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await mockPaypalApi.connectAccount(email, password);
      setLoading(false);
      setIsConnected(true);
      setConnectedEmail(email);
      navigate('/creator-dashboard', { 
        state: { message: 'PayPal account connected successfully!' }
      });
    } catch (err) {
      setError('Failed to connect PayPal account. Please try again.');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await mockPaypalApi.disconnectAccount();
      setIsConnected(false);
      setConnectedEmail('');
      setStep('login');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to disconnect account');
    }
    setLoading(false);
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <FaCheck className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              PayPal Connected
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {connectedEmail}
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors"
            >
              {loading ? 'Processing...' : 'Disconnect PayPal'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <FaPaypal className="mx-auto h-12 w-12 text-[#003087]" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Connect Your PayPal Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start accepting payments through PayPal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 'login' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                PayPal Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your PayPal email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                PayPal Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your PayPal password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaLock className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">Secure connection</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003087] hover:bg-[#002367] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003087] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Connecting...' : (step === 'login' ? 'Next' : 'Connect PayPal')}
          </button>

          {step === 'password' && (
            <button
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              Back to email
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CardDetails; 