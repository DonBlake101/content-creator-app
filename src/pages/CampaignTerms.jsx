import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaClipboard } from 'react-icons/fa';

const CampaignTerms = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        // Mock API call to fetch campaign details
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaign data
        const mockCampaign = {
          id: campaignId,
          brandName: 'Sample Brand',
          title: 'Product Promotion Campaign',
          description: 'Create engaging content featuring our product',
          amount: 1000,
          tasks: [
            'Create 1 TikTok video featuring the product',
            'Post on specified date between July 1-7, 2024',
            'Include brand hashtags #SampleBrand #Ad',
            'Maintain video on platform for minimum 30 days'
          ],
          requirements: [
            'Must have over 10k followers',
            'Must be 18+ years old',
            'Content must be family-friendly',
            'No controversial topics'
          ],
          deadline: '2024-07-07',
          paymentTerms: 'Payment will be released after successful completion of all tasks'
        };
        
        setCampaign(mockCampaign);
      } catch (err) {
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const handleAcceptTerms = async () => {
    try {
      setLoading(true);
      
      // Mock API call to accept terms
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate payment link for brand
      const paymentLink = `/checkout/${campaignId}`;
      
      // Mock sending notification to brand
      console.log('Notifying brand of acceptance');
      
      // Navigate to confirmation page
      navigate('/terms-accepted', {
        state: {
          brandName: campaign.brandName,
          campaignTitle: campaign.title
        }
      });
    } catch (err) {
      setError('Failed to accept terms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTerms = () => {
    navigate('/creator-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-purple-50">
          <h2 className="text-3xl font-bold text-gray-900">Campaign Terms</h2>
          <p className="mt-2 text-gray-600">
            Review the terms for "{campaign.title}" by {campaign.brandName}
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900">Campaign Details</h3>
            <p className="mt-2 text-gray-600">{campaign.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">Payment</h3>
            <p className="mt-2 text-gray-600">
              ${campaign.amount.toFixed(2)} upon successful completion of all tasks
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">Required Tasks</h3>
            <ul className="mt-2 space-y-2">
              {campaign.tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <FaClipboard className="mt-1 mr-2 text-purple-600" />
                  <span className="text-gray-600">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">Requirements</h3>
            <ul className="mt-2 space-y-2">
              {campaign.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="mt-1 mr-2 text-green-600" />
                  <span className="text-gray-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">Payment Terms</h3>
            <p className="mt-2 text-gray-600">{campaign.paymentTerms}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleRejectTerms}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaTimes className="inline-block mr-2" />
                Reject Terms
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <FaCheck className="inline-block mr-2" />
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTerms; 