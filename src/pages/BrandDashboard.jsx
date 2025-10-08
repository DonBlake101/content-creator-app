import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTiktok, FaFacebook, FaYoutube, FaSnapchat, FaSearch, FaFilter, FaPlus, FaCog } from 'react-icons/fa';
import BrandNavbar from '../components/BrandNavbar';

const BrandDashboard = () => {
  const navigate = useNavigate();
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [brandProfile, setBrandProfile] = useState({
    name: '',
    industry: '',
    budgetRange: '',
    ageRange: '',
    socialMedia: {
      tiktok: '',
      facebook: '',
      youtube: '',
      snapchat: ''
    },
    followers: {
      tiktok: 0,
      facebook: 0,
      youtube: 0,
      snapchat: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [creators, setCreators] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    industry: '',
    ageRange: '',
    platform: ''
  });
  const [campaigns, setCampaigns] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    platforms: []
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [connectedCreators, setConnectedCreators] = useState(0);
  const [acceptedCampaigns, setAcceptedCampaigns] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Check if brand profile exists in localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('brandProfile');
    if (savedProfile) {
      setBrandProfile(JSON.parse(savedProfile));
      setOnboardingStep(4); // Skip onboarding if profile exists
    }
  }, []);

  useEffect(() => {
    // Get real-time connected creators count from localStorage or your backend
    const connectedCreatorsCount = localStorage.getItem('connectedCreators') || 0;
    setConnectedCreators(Number(connectedCreatorsCount));

    // Get accepted campaigns
    const campaigns = JSON.parse(localStorage.getItem('acceptedCampaigns')) || [];
    setAcceptedCampaigns(campaigns);
  }, []);

  // Mock API to fetch social media followers
  const fetchSocialMediaFollowers = async (platform, username) => {
    if (!username) return 0;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - replace with actual API call
    return Math.floor(Math.random() * 100000) + 1000;
  };

  // Mock API to fetch creators based on brand criteria
  const fetchCreators = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    const mockCreators = [
      {
        id: 1,
        name: 'Sarah Johnson',
        platform: 'TikTok',
        followers: 25000,
        engagementRate: 4.2,
        ageRange: '18-24',
        industry: brandProfile.industry,
        image: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        id: 2,
        name: 'Mike Chen',
        platform: 'YouTube',
        followers: 50000,
        engagementRate: 3.8,
        ageRange: '25-34',
        industry: brandProfile.industry,
        image: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        id: 3,
        name: 'Emma Davis',
        platform: 'Instagram',
        followers: 35000,
        engagementRate: 5.1,
        ageRange: '18-24',
        industry: brandProfile.industry,
        image: 'https://randomuser.me/api/portraits/women/3.jpg'
      }
    ];
    
    setCreators(mockCreators);
    setIsLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle social media input changes
  const handleSocialMediaChange = (platform, value) => {
    setBrandProfile(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  // Handle filter option changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle campaign input changes
  const handleCampaignChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle platform selection for campaign
  const handlePlatformSelection = (platform) => {
    setNewCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  // Save brand profile and proceed to next step
  const handleNextStep = async () => {
    if (onboardingStep === 2) {
      // Fetch social media followers
      setIsLoading(true);
      
      const tiktokFollowers = await fetchSocialMediaFollowers('tiktok', brandProfile.socialMedia.tiktok);
      const facebookFollowers = await fetchSocialMediaFollowers('facebook', brandProfile.socialMedia.facebook);
      const youtubeFollowers = await fetchSocialMediaFollowers('youtube', brandProfile.socialMedia.youtube);
      const snapchatFollowers = await fetchSocialMediaFollowers('snapchat', brandProfile.socialMedia.snapchat);
      
      setBrandProfile(prev => ({
        ...prev,
        followers: {
          tiktok: tiktokFollowers,
          facebook: facebookFollowers,
          youtube: youtubeFollowers,
          snapchat: snapchatFollowers
        }
      }));
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    }
    
    if (onboardingStep === 3) {
      // Save to localStorage
      localStorage.setItem('brandProfile', JSON.stringify(brandProfile));
    }
    
    setOnboardingStep(prev => prev + 1);
  };

  // Create a new campaign
  const handleCreateCampaign = () => {
    // Add new campaign to the list
    setCampaigns(prev => [...prev, {
      id: prev.length + 1,
      ...newCampaign,
      status: 'pending'
    }]);
    // Reset form
    setNewCampaign({
      title: '',
      description: '',
      budget: '',
      duration: '',
      platforms: []
    });
  };

  // Send a message to a creator
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCreator) return;
    
    const messageObj = {
      id: Date.now(),
      text: newMessage,
      sender: 'brand',
      receiver: selectedCreator.id,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, messageObj]);
    setNewMessage('');
  };

  // Accept campaign terms (creator side)
  const acceptCampaignTerms = (campaignId) => {
    // Update campaign status
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'accepted' } 
          : campaign
      )
    );
    
    // Generate payment link
    const paymentLink = `https://creatorcoin.app/payment/${campaignId}`;
    
    // Send message to brand
    const messageObj = {
      id: Date.now(),
      text: `I've accepted the campaign terms. Here's the payment link: ${paymentLink}`,
      sender: 'creator',
      receiver: 'brand',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, messageObj]);
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handlePaymentDetails = () => {
    navigate('/checkout/brand');
  };

  const handleLogout = () => {
    // Clear any stored data
    localStorage.removeItem('brandProfile');
    localStorage.removeItem('userType');
    // Navigate to home
    navigate('/');
  };

  const handlePayCreator = (creator) => {
    setSelectedCreator(creator);
    setShowPaymentModal(true);
  };

  const handleStartCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleFindCreators = () => {
    navigate('/find-creators');
  };

  const handleViewAcceptedCampaigns = () => {
    navigate('/accepted-campaigns');
  };

  // Render onboarding steps
  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your brand</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={brandProfile.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your brand name"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={brandProfile.industry}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. Fashion, Tech, Food"
                />
              </div>
              
              <div>
                <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700">Budget Range</label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={brandProfile.budgetRange}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select budget range</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="101-500">$101 - $500</option>
                  <option value="501-1000">$501 - $1,000</option>
                  <option value="1001-5000">$1,001 - $5,000</option>
                  <option value="5001-10000">$5,001 - $10,000</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">Target Age Range</label>
                <select
                  id="ageRange"
                  name="ageRange"
                  value={brandProfile.ageRange}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select age range</option>
                  <option value="13-17">13-17</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleNextStep}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
                disabled={!brandProfile.name || !brandProfile.industry || !brandProfile.budgetRange || !brandProfile.ageRange}
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect your social media</h2>
            <p className="text-gray-600 mb-6">Enter your social media usernames (leave blank if you don't use a platform)</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">TikTok Username</label>
                <input
                  type="text"
                  id="tiktok"
                  value={brandProfile.socialMedia.tiktok}
                  onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="@username"
                />
              </div>
              
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook Username</label>
                <input
                  type="text"
                  id="facebook"
                  value={brandProfile.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="@username"
                />
              </div>
              
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">YouTube Username</label>
                <input
                  type="text"
                  id="youtube"
                  value={brandProfile.socialMedia.youtube}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="@username"
                />
              </div>
              
              <div>
                <label htmlFor="snapchat" className="block text-sm font-medium text-gray-700">Snapchat Username</label>
                <input
                  type="text"
                  id="snapchat"
                  value={brandProfile.socialMedia.snapchat}
                  onChange={(e) => handleSocialMediaChange('snapchat', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="@username"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleNextStep}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
              >
                Connect Accounts
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your brand profile</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Brand Name:</span>
                <span className="font-medium">{brandProfile.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Industry:</span>
                <span className="font-medium">{brandProfile.industry}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Budget Range:</span>
                <span className="font-medium">${brandProfile.budgetRange}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Target Age Range:</span>
                <span className="font-medium">{brandProfile.ageRange}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Social Media</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">TikTok:</span>
                    <span className="font-medium">
                      {brandProfile.socialMedia.tiktok ? `@${brandProfile.socialMedia.tiktok} (${brandProfile.followers.tiktok.toLocaleString()} followers)` : 'Not connected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facebook:</span>
                    <span className="font-medium">
                      {brandProfile.socialMedia.facebook ? `@${brandProfile.socialMedia.facebook} (${brandProfile.followers.facebook.toLocaleString()} followers)` : 'Not connected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">YouTube:</span>
                    <span className="font-medium">
                      {brandProfile.socialMedia.youtube ? `@${brandProfile.socialMedia.youtube} (${brandProfile.followers.youtube.toLocaleString()} followers)` : 'Not connected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Snapchat:</span>
                    <span className="font-medium">
                      {brandProfile.socialMedia.snapchat ? `@${brandProfile.socialMedia.snapchat} (${brandProfile.followers.snapchat.toLocaleString()} followers)` : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleNextStep}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
              >
                Complete Setup
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render loading animation
  const renderLoadingAnimation = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-8 h-8 bg-red-500 rounded-tl-lg animate-spin"></div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-tr-lg animate-spin" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-green-500 rounded-bl-lg animate-spin" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-br-lg animate-spin" style={{ animationDelay: '0.6s' }}></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Setting up your brand profile...</p>
      </div>
    );
  };

  // Render dashboard content
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Active Campaigns</h3>
                <p className="text-3xl font-bold text-black mt-2">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Total Budget</h3>
                <p className="text-3xl font-bold text-black mt-2">
                  ${campaigns.reduce((sum, c) => sum + parseInt(c.budget.replace('$', '').replace(',', '')), 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Creators</h3>
                <p className="text-3xl font-bold text-black mt-2">
                  {connectedCreators}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="mt-4 space-y-4">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.title}</p>
                        <p className="text-sm text-gray-500">{campaign.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'find-creators':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Find Creators</h2>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Creators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="filterIndustry" className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    id="filterIndustry"
                    name="industry"
                    value={filterOptions.industry}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Industries</option>
                    <option value={brandProfile.industry}>{brandProfile.industry}</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Tech">Tech</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filterAgeRange" className="block text-sm font-medium text-gray-700">Age Range</label>
                  <select
                    id="filterAgeRange"
                    name="ageRange"
                    value={filterOptions.ageRange}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Ages</option>
                    <option value="13-17">13-17</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filterPlatform" className="block text-sm font-medium text-gray-700">Platform</label>
                  <select
                    id="filterPlatform"
                    name="platform"
                    value={filterOptions.platform}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Platforms</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Snapchat">Snapchat</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map(creator => (
                <div key={creator.id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img src={creator.image} alt={creator.name} className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{creator.name}</h3>
                        <p className="text-sm text-gray-600">{creator.platform}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white p-2 rounded">
                        <p className="text-xs text-gray-600">Followers</p>
                        <p className="font-medium">{creator.followers.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-xs text-gray-600">Engagement</p>
                        <p className="font-medium">{creator.engagementRate}%</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedCreator(creator);
                        setActiveTab('messages');
                      }}
                      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Message Creator
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {creators.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No creators found matching your criteria</p>
                <button
                  onClick={fetchCreators}
                  className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
                >
                  Load Creators
                </button>
              </div>
            )}
          </div>
        );
      
      case 'campaigns':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
              <button
                onClick={() => setActiveTab('create-campaign')}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Campaign
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading campaigns...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget</p>
                        <p className="text-lg font-medium text-gray-900">{campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="text-lg font-medium text-gray-900">{campaign.duration}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Platforms</p>
                      <div className="flex space-x-2 mt-2">
                        {campaign.platforms.map(platform => (
                          <span key={platform} className="text-2xl">
                            {platform === 'tiktok' && <FaTiktok />}
                            {platform === 'facebook' && <FaFacebook />}
                            {platform === 'youtube' && <FaYoutube />}
                            {platform === 'snapchat' && <FaSnapchat />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'messages':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Creators</h3>
                <div className="space-y-2">
                  {creators.map(creator => (
                    <div
                      key={creator.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedCreator?.id === creator.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCreator(creator)}
                    >
                      <div className="flex items-center">
                        <img src={creator.image} alt={creator.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-sm text-gray-600">{creator.platform}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                {selectedCreator ? (
                  <>
                    <div className="flex items-center mb-4">
                      <img src={selectedCreator.image} alt={selectedCreator.name} className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedCreator.name}</h3>
                        <p className="text-sm text-gray-600">{selectedCreator.platform}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 h-80 overflow-y-auto mb-4">
                      {messages.filter(m => 
                        (m.sender === 'brand' && m.receiver === selectedCreator.id) || 
                        (m.sender === 'creator' && m.receiver === 'brand')
                      ).map(message => (
                        <div
                          key={message.id}
                          className={`mb-3 max-w-[80%] ${
                            message.sender === 'brand' ? 'ml-auto' : 'mr-auto'
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === 'brand' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            <p>{message.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Type your message..."
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-900 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-80">
                    <p className="text-gray-600">Select a creator to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'create-campaign':
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('campaigns')}
                className="text-gray-500 hover:text-gray-900"
              >
                ← Back to Campaigns
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget</label>
                  <input
                    type="text"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                  <input
                    type="number"
                    value={newCampaign.duration}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platforms</label>
                  <div className="mt-2 space-y-2">
                    {['tiktok', 'facebook', 'youtube', 'snapchat'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCampaign.platforms.includes(platform)}
                          onChange={(e) => {
                            const platforms = e.target.checked
                              ? [...newCampaign.platforms, platform]
                              : newCampaign.platforms.filter(p => p !== platform);
                            setNewCampaign(prev => ({ ...prev, platforms }));
                          }}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="ml-2 capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BrandNavbar />
      
      {/* Settings Icon */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={handleSettingsClick}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaCog className="w-6 h-6" />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={handlePaymentDetails}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Check Payment Details
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'campaigns'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Campaigns
              </button>
            </nav>
          </div>

          <div className="p-6">
            {onboardingStep < 4 ? (
              isLoading ? renderLoadingAnimation() : renderOnboardingStep()
            ) : (
              renderDashboardContent()
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Pay Creator</h2>
            <p className="mb-4">Send payment to {selectedCreator?.name}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle payment logic here
                  setShowPaymentModal(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard; 