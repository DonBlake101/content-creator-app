import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTiktok, FaInstagram, FaYoutube, FaFacebook, FaCheckCircle, FaClock, FaArrowLeft } from 'react-icons/fa';

const Campaigns = () => {
  const navigate = useNavigate();
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch campaigns
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for active campaigns
        const mockActiveCampaigns = [
          {
            id: 1,
            title: 'Summer Collection Promotion',
            creator: {
              name: 'Sarah Johnson',
              profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
              platform: 'instagram'
            },
            startDate: '2024-03-01',
            endDate: '2024-03-31',
            status: 'active',
            budget: 2500,
            progress: 65
          },
          {
            id: 2,
            title: 'Tech Product Review',
            creator: {
              name: 'Mike Chen',
              profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
              platform: 'youtube'
            },
            startDate: '2024-03-15',
            endDate: '2024-04-15',
            status: 'active',
            budget: 5000,
            progress: 30
          }
        ];

        // Mock data for completed campaigns
        const mockCompletedCampaigns = [
          {
            id: 3,
            title: 'Winter Fashion Showcase',
            creator: {
              name: 'Emma Wilson',
              profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
              platform: 'tiktok'
            },
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'completed',
            budget: 3000,
            results: {
              reach: '500K',
              engagement: '4.5%',
              roi: '250%'
            }
          }
        ];

        setActiveCampaigns(mockActiveCampaigns);
        setCompletedCampaigns(mockCompletedCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const renderCampaignCard = (campaign) => (
    <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={campaign.creator.profileImage}
              alt={campaign.creator.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
              <p className="text-sm text-gray-500">with {campaign.creator.name}</p>
            </div>
          </div>
          <div className="flex items-center">
            {campaign.creator.platform === 'tiktok' && <FaTiktok className="text-2xl" />}
            {campaign.creator.platform === 'instagram' && <FaInstagram className="text-2xl" />}
            {campaign.creator.platform === 'youtube' && <FaYoutube className="text-2xl" />}
            {campaign.creator.platform === 'facebook' && <FaFacebook className="text-2xl" />}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Budget</p>
            <p className="text-lg font-medium text-gray-900">${campaign.budget}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {campaign.status === 'active' ? (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{campaign.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full"
                style={{ width: `${campaign.progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Campaign Results</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reach</p>
                <p className="text-lg font-medium text-gray-900">{campaign.results.reach}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement</p>
                <p className="text-lg font-medium text-gray-900">{campaign.results.engagement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ROI</p>
                <p className="text-lg font-medium text-gray-900">{campaign.results.roi}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => {
              setSelectedCampaign(campaign);
              setShowCampaignModal(true);
            }}
            className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/brand-dashboard')}
            className="flex items-center text-gray-700 hover:text-black focus:outline-none mr-4"
          >
            <FaArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">Campaigns</h1>
          <button
            onClick={() => navigate('/find-creators')}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            Start New Campaign
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Campaigns */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Campaigns</h2>
              {activeCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCampaigns.map(renderCampaignCard)}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <FaClock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Campaigns</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a new campaign to promote your brand with creators.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/find-creators')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Find Creators
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Completed Campaigns */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Campaigns</h2>
              {completedCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCampaigns.map(renderCampaignCard)}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Completed Campaigns</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your completed campaigns will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {showCampaignModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCampaign.title}</h2>
              <p className="text-gray-700 mb-2">with {selectedCampaign.creator?.name}</p>
              <p className="text-gray-500 mb-4">{selectedCampaign.description}</p>
              <div className="mb-4">
                <span className="font-semibold">Budget:</span> ${selectedCampaign.budget}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Duration:</span> {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Time Left:</span> {(() => {
                  const now = new Date();
                  const end = new Date(selectedCampaign.endDate);
                  const diffMs = end - now;
                  if (diffMs <= 0) return 'Deadline passed';
                  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
                  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} left`;
                  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
                  return 'Less than 1 hour left';
                })()}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Tasks:</span>
                {selectedCampaign.tasks && selectedCampaign.tasks.length > 0 ? (
                  <ul className="list-disc ml-6 mt-2">
                    {selectedCampaign.tasks.map((task, idx) => (
                      <li key={idx} className="text-gray-700">{task}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-2">No specific tasks listed for this campaign.</p>
                )}
              </div>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns; 