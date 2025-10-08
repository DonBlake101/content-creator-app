import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { creator, campaign, transactionId } = location.state || {};

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/brand-dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your campaign with {creator?.name} has been confirmed
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Transaction ID</dt>
                  <dd className="text-sm font-medium text-gray-900">{transactionId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Amount</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${(campaign?.amount * 1.05).toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Campaign</dt>
                  <dd className="text-sm font-medium text-gray-900">{campaign?.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Creator</dt>
                  <dd className="text-sm font-medium text-gray-900">{creator?.name}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/brand-dashboard')}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Go to Dashboard
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          You will be redirected to your dashboard in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 