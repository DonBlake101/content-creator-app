import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandMatching = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);

  useEffect(() => {
    // Load available campaigns from localStorage
    const availableCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    setCampaigns(availableCampaigns.filter(campaign => campaign.status === 'active'));
  }, []);

  const handleAcceptCampaign = (campaign) => {
    // Update campaign in localStorage
    const allCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const updatedCampaigns = allCampaigns.map(c => {
      if (c.id === campaign.id) {
        return {
          ...c,
          acceptedCreators: [...(c.acceptedCreators || []), {
            id: Date.now(),
            name: localStorage.getItem('creatorName') || 'Anonymous Creator',
            status: 'accepted'
          }]
        };
      }
      return c;
    });
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));

    // Update accepted campaigns count
    const acceptedCampaigns = JSON.parse(localStorage.getItem('acceptedCampaigns')) || [];
    localStorage.setItem('acceptedCampaigns', JSON.stringify([...acceptedCampaigns, campaign]));

    // Refresh campaigns list
    setCampaigns(updatedCampaigns.filter(campaign => campaign.status === 'active'));
  };

  const handleViewRequirements = (campaign) => {
    setSelectedCampaign(campaign);
    setShowRequirementsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Brand Campaigns</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h2>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-600 font-semibold">${campaign.budget}</span>
                <span className="text-gray-500">Deadline: {campaign.deadline}</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleViewRequirements(campaign)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  View Requirements
                </button>
                <button
                  onClick={() => handleAcceptCampaign(campaign)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Accept Campaign
                </button>
              </div>
            </div>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No active campaigns available at the moment.</p>
          </div>
        )}

        {/* Requirements Modal */}
        {showRequirementsModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Campaign Requirements</h2>
              <ul className="space-y-2 mb-6">
                {selectedCampaign.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRequirementsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAcceptCampaign(selectedCampaign);
                    setShowRequirementsModal(false);
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Accept Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandMatching; 