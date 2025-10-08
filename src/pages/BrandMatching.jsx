import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { FaBell, FaEnvelope, FaUser, FaCheckCircle, FaCog } from 'react-icons/fa';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RTOuO2eb5ygwewDs12WiIRZhUmgPRisxyuCMpCgBOdZYoxBbXYz9l62pBvINoFZMroWyv6Jm6kTVzbMg1P8MXN300idP3bpba');

// Mock API for real-time follower updates
const mockPlatformAPI = {
  facebook: {
    getFollowers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.floor(25000 + Math.random() * 1000);
    }
  },
  youtube: {
    getFollowers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.floor(15000 + Math.random() * 800);
    }
  },
  tiktok: {
    getFollowers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.floor(35000 + Math.random() * 1500);
    }
  },
  snapchat: {
    getFollowers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.floor(12000 + Math.random() * 600);
    }
  }
};

const BrandMatching = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    bio: '',
    niche: '',
    rating: 0,
    totalRatings: 0,
    connectedPlatforms: {},
    dailyBrandContacts: 0,
    lastContactReset: new Date().toDateString(),
    profilePicture: null,
    price: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [conversations, setConversations] = useState({});
  const [message, setMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState({
    videoLength: '',
    hashtags: '',
    deadline: '',
    budget: '',
    terms: ''
  });
  const [offerLink, setOfferLink] = useState('');
  const messagesEndRef = useRef(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2); // Mock unread messages count
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);
  const [campaignOffers, setCampaignOffers] = useState([]);
  const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const mockProfile = {
          bio: "Fitness enthusiast and certified personal trainer. Creating content about workouts, nutrition, and healthy lifestyle.",
          niche: "fitness",
          rating: 4.8,
          totalRatings: 12,
          connectedPlatforms: {
            facebook: { followers: 25000, connected: true, username: 'fitnesswithsara', price: 800 },
            youtube: { followers: 15000, connected: true, username: 'sarafitness', price: 1200 },
            tiktok: { followers: 35000, connected: false, price: 0 },
            snapchat: { followers: 12000, connected: false, price: 0 }
          },
          dailyBrandContacts: 1,
          lastContactReset: new Date().toDateString(),
          profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
          price: 1500
        };
        setUserProfile(mockProfile);
        setEditedProfile(mockProfile);

        // Check if payment details are set up
        const stripeAccountId = localStorage.getItem('stripeAccountId');
        setHasPaymentDetails(!!stripeAccountId);
        
        // Initialize all messages
        setAllMessages([
          {
            id: 1,
            brandId: 1,
            brandName: "FitLife Supplements",
            brandLogo: "https://ui-avatars.com/api/?name=FL&background=6D28D9&color=fff",
            text: "Hi there! We'd love to discuss a potential partnership for our new product line that's launching next month. We're looking for fitness creators like you.",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            read: false
          },
          {
            id: 2,
            brandId: 2,
            brandName: "ActiveWear Co",
            brandLogo: "https://ui-avatars.com/api/?name=AW&background=2563EB&color=fff",
            text: "We noticed your fitness content and would like to offer you our spring collection for a sponsored post. Our budget is flexible.",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
            read: false
          },
          {
            id: 3,
            brandId: 3,
            brandName: "HealthFood Market",
            brandLogo: "https://ui-avatars.com/api/?name=HM&background=059669&color=fff",
            text: "Would you be interested in creating content featuring our organic meal prep kits? Let's discuss the details!",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            read: true
          }
        ]);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const mockBrands = [
          {
            id: 1,
            name: "FitLife Supplements",
            description: "Looking for fitness influencers to promote our protein powders and supplements",
            budget: "5000",
            requirements: "fitness",
            rating: 4.5,
            paymentTerms: "Net 30",
            campaignDetails: "3-month campaign with 2 posts per week",
            logo: "https://ui-avatars.com/api/?name=FL&background=6D28D9&color=fff",
            industry: "Health & Fitness"
          },
          {
            id: 2,
            name: "ActiveWear Co",
            description: "Seeking fitness creators to showcase our athletic wear collection",
            budget: "3000",
            requirements: "fitness",
            rating: 4.2,
            paymentTerms: "Net 15",
            campaignDetails: "2-month campaign with 1 post per week",
            logo: "https://ui-avatars.com/api/?name=AW&background=2563EB&color=fff",
            industry: "Fashion & Apparel"
          },
          {
            id: 3,
            name: "HealthFood Market",
            description: "Looking for fitness influencers to promote our organic food products",
            budget: "4000",
            requirements: "nutrition",
            rating: 4.7,
            paymentTerms: "Net 30",
            campaignDetails: "3-month campaign with 3 posts per week",
            logo: "https://ui-avatars.com/api/?name=HM&background=059669&color=fff",
            industry: "Food & Beverage"
          }
        ];
        setBrands(mockBrands);
      } catch (err) {
        setError('Failed to load brand data');
        console.error(err);
      }
    };

    fetchUserProfile();
    fetchBrands();
  }, []);

  // Update follower counts in real-time
  useEffect(() => {
    const updateFollowerCounts = async () => {
      if (!userProfile.connectedPlatforms) return;

      const updatedPlatforms = { ...userProfile.connectedPlatforms };
      for (const platform in updatedPlatforms) {
        if (updatedPlatforms[platform].connected && mockPlatformAPI[platform]) {
          try {
            const followers = await mockPlatformAPI[platform].getFollowers();
            updatedPlatforms[platform].followers = followers;
          } catch (err) {
            console.error(`Failed to update ${platform} followers:`, err);
          }
        }
      }
      setUserProfile(prev => ({ ...prev, connectedPlatforms: updatedPlatforms }));
    };

    const interval = setInterval(updateFollowerCounts, 30000);
    return () => clearInterval(interval);
  }, [userProfile.connectedPlatforms]);

  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  const handleProfileSave = () => {
    if (!editedProfile.price || editedProfile.price <= 0) {
      alert("Please enter a valid price for your services");
      return;
    }
    setUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleProfileCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (value) => {
    setEditedProfile(prev => ({
      ...prev,
      price: parseInt(value)
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSetupPayment = async () => {
    try {
      console.log('Starting Stripe onboarding...');
      const res = await axios.post('http://localhost:5000/api/stripe/create-account-link', { for: 'creator' });
      console.log('Stripe response:', res.data);
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        console.error('Invalid response from Stripe:', res.data);
        alert('Failed to start Stripe onboarding: Invalid response from server.');
      }
    } catch (err) {
      console.error('Stripe onboarding error:', err.response?.data || err.message);
      alert('Failed to start Stripe onboarding. Please check the console for details.');
    }
  };

  const handleContactBrand = (brand) => {
    if (!hasPaymentDetails) {
      alert('Please set up your payment details before contacting brands.');
      return;
    }
    setSelectedBrand(brand);
    setShowMessaging(true);
  };

  const handleSendMessage = () => {
    if (!hasPaymentDetails) {
      alert('Please set up your payment details before sending messages.');
      return;
    }
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'creator',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleCreateCampaign = () => {
    const campaign = {
      ...campaignDetails,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Generate offer link
    const link = `https://yourdomain.com/offer/${campaign.id}`;
    setOfferLink(link);

    // Add campaign message
    const message = {
      id: Date.now(),
      type: 'campaign',
      campaign,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setShowCampaignForm(false);
  };

  const handleAcceptOffer = () => {
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      // Calculate platform fee
      const amount = parseFloat(campaignDetails.budget);
      const platformFee = amount <= 5000 ? amount * 0.095 : amount * 0.08;
      const totalAmount = amount + platformFee;

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update campaign status
      const updatedMessages = messages.map(msg => {
        if (msg.type === 'campaign') {
          return { 
            ...msg, 
            campaign: { 
              ...msg.campaign, 
              status: 'accepted',
              paymentDetails: {
                amount,
                platformFee,
                totalAmount,
                paidAt: new Date().toISOString()
              }
            } 
          };
        }
        return msg;
      });
      
      setMessages(updatedMessages);
      setShowPayment(false);
    } catch (error) {
      console.error('Payment processing failed:', error);
    }
  };

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

  const handleReplyToMessage = (messageId, brandId, brandName, brandLogo) => {
    // Mark the message as read
    markMessageAsRead(messageId);
    
    // Find the brand and set it as selected
    const brand = brands.find(b => b.id === brandId) || {
      id: brandId,
      name: brandName,
      logo: brandLogo
    };
    setSelectedBrand(brand);
    setShowMessaging(true);
    
    // Close all messages panel
    setShowAllMessages(false);
    
    // If no existing messages, create initial welcome message
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: `Hi there! We're interested in working with you. Let's discuss how we can collaborate.`,
        sender: 'brand',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleBrowseCampaigns = () => {
    // Get campaigns created by brands from localStorage
    const brandCampaigns = JSON.parse(localStorage.getItem('brandCampaigns')) || [];
    
    // If there are no campaigns yet, show an empty list
    if (brandCampaigns.length === 0) {
      setCampaigns([]);
      return;
    }
    
    // Filter campaigns by user's niche
    const nicheMatchedCampaigns = brandCampaigns.filter(
      campaign => campaign.targetNiches && campaign.targetNiches.includes(userProfile.niche)
    );
    
    // Sort campaigns by: star rating, budget, deadline
    const sortedCampaigns = nicheMatchedCampaigns.sort((a, b) => {
      // First by star rating (higher first)
      if (a.brandRating !== b.brandRating) {
        return b.brandRating - a.brandRating;
      }
      // Then by budget (higher first)
      if (a.budget !== b.budget) {
        return b.budget - a.budget;
      }
      // Then by deadline (sooner first)
      return new Date(a.deadline) - new Date(b.deadline);
    });
    
    // Limit to 4 campaigns max
    const limitedCampaigns = sortedCampaigns.slice(0, 4);
    
    setCampaigns(limitedCampaigns);
  };

  const handlePlatformPriceChange = (platform, price) => {
    const updatedProfile = { ...editedProfile };
    updatedProfile.connectedPlatforms[platform].price = parseInt(price) || 0;
    setEditedProfile(updatedProfile);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, this would handle push notification permissions
    if (!notificationsEnabled) {
      // Request permission for notifications
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  };

  const handleMessageIconClick = () => {
    setShowAllMessages(true);
  };

  const markMessageAsRead = (messageId) => {
    const updatedMessages = allMessages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setAllMessages(updatedMessages);
    
    // Update unread count
    const unreadCount = updatedMessages.filter(msg => !msg.read).length;
    setUnreadMessages(unreadCount);
  };

  // Load campaign offers for this creator
  useEffect(() => {
    // Replace with actual creator ID logic if available
    const creatorId = localStorage.getItem('creatorId') || '1';
    const allCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    setCampaignOffers(allCampaigns.filter(c => c.creatorId === creatorId && c.status === 'offer'));
  }, []);

  const handleOfferResponse = (campaignId, accepted) => {
    const allCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const offer = allCampaigns.find(c => c.id === campaignId);
    const updatedCampaigns = allCampaigns.map(c =>
      c.id === campaignId ? { ...c, status: accepted ? 'accepted' : 'rejected' } : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaignOffers(updatedCampaigns.filter(c => c.creatorId === (localStorage.getItem('creatorId') || '1') && c.status === 'offer'));
    if (accepted) {
      setAcceptedOffer(offer);
      setShowPaymentBreakdown(true);
    } else {
      alert('You have rejected the campaign offer.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back arrow, notifications, and settings */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/creator-dashboard')}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 mr-4"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-purple-400">Brand Matching</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <FaEnvelope 
                onClick={handleMessageIconClick}
                className="text-2xl text-gray-300 hover:text-purple-400 cursor-pointer transition-colors" 
              />
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </div>
            <FaBell 
              onClick={toggleNotifications}
              className={`text-2xl ${notificationsEnabled ? 'text-purple-400' : 'text-gray-300'} hover:text-purple-400 cursor-pointer transition-colors`} 
            />
            <FaCog
              onClick={handleSettingsClick}
              className="text-2xl text-gray-300 hover:text-purple-400 cursor-pointer transition-colors"
            />
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Payment Details</h3>
                    <p className="text-gray-400 text-sm">Set up your Stripe account to receive payments</p>
                  </div>
                  {hasPaymentDetails ? (
                    <span className="text-green-400 flex items-center">
                      <FaCheckCircle className="mr-2" />
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={handleSetupPayment}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Set Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Messages Panel */}
        {showAllMessages && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Brand Messages</h2>
                <button
                  onClick={() => setShowAllMessages(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow">
                {allMessages.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-700 p-3 rounded-full mb-4">
                      <FaEnvelope className="text-3xl text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Messages</h3>
                    <p className="text-gray-400 max-w-xs">
                      You don't have any messages from brands yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`bg-gray-700 rounded-xl p-4 transition-all ${!message.read ? 'border-l-4 border-purple-500' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <img src={message.brandLogo} alt={message.brandName} className="w-8 h-8 rounded-full mr-2" />
                            <span className="font-medium">{message.brandName}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{message.text}</p>
                        <button 
                          onClick={() => handleReplyToMessage(message.id, message.brandId, message.brandName, message.brandLogo)}
                          className="px-4 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Profile Section - Redesigned */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500">
                  <img
                      src={editedProfile?.profilePicture || "https://randomuser.me/api/portraits/women/44.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfilePictureChange(e)}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Bio</label>
                      <textarea
                        value={editedProfile?.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleProfileSave}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleProfileCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                      <h2 className="text-xl font-semibold text-white">Your Profile</h2>
                      <p className="mt-2 text-gray-300">{userProfile.bio}</p>
                    <button
                      onClick={handleProfileEdit}
                        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">Daily Brand Contacts</p>
                  <p className="text-2xl font-semibold text-purple-400">
                {userProfile.dailyBrandContacts}/3
              </p>
                </div>
            </div>
          </div>

            {/* Connected Platforms - Updated with platform-specific pricing */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Platform Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userProfile.connectedPlatforms).map(([platform, data]) => (
                  <div 
                    key={platform} 
                    className={`${data.connected ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'} rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-300 capitalize">{platform}</p>
                      {data.connected && <FaCheckCircle className="text-green-400" />}
                    </div>
                    
                    {data.connected && data.username ? (
                      <>
                        <p className="text-sm text-gray-400">@{data.username}</p>
                        <p className="text-xl font-semibold text-white">
                          {data.followers.toLocaleString()} <span className="text-sm font-normal text-gray-400">followers</span>
                        </p>
                        
                        {/* Platform-specific price - always editable */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-400">Price:</span>
                          {isEditing ? (
                            <div className="flex items-center bg-gray-600 rounded-md px-3 py-2 border border-purple-500">
                              <span className="text-white font-medium mr-1">$</span>
                              <input
                                type="text"
                                value={editedProfile.connectedPlatforms[platform].price}
                                onChange={(e) => {
                                  // Only allow numeric input
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  handlePlatformPriceChange(platform, value);
                                }}
                                className="w-24 bg-gray-600 border-none text-white text-base font-semibold shadow-none focus:ring-0 focus:outline-none"
                                placeholder="Price"
                              />
                  </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-green-400">
                                ${Number(data.price).toLocaleString()}
                              </span>
                              <button
                                onClick={handleProfileEdit}
                                className="p-1 rounded hover:bg-gray-600 transition-colors"
                                title="Edit price"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {data.connected ? "Add username in settings" : "Not connected"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message Box - Updated to allow replies */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Brand Messages</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadMessages} New</span>
          </div>
          
          {allMessages.slice(0, 2).map(message => (
            <div key={message.id} className="bg-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                  <img src={message.brandLogo} alt={message.brandName} className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-medium">{message.brandName}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-300">{message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text}</p>
              <button 
                onClick={() => handleReplyToMessage(message.id, message.brandId, message.brandName, message.brandLogo)}
                className="mt-3 px-4 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors"
              >
                Reply
              </button>
            </div>
          ))}
          
          {allMessages.length > 2 && (
            <div className="text-center">
              <button 
                onClick={handleMessageIconClick}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                View All Messages ({allMessages.length})
              </button>
            </div>
          )}
        </div>

        {/* Brand Recommendations - Updated */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Recommended Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands.filter(brand => brand.requirements.includes(userProfile.niche)).map(brand => (
              <div key={brand.id} className="bg-gray-700 rounded-xl overflow-hidden transition-transform hover:scale-105">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{brand.name}</h3>
                      <p className="text-purple-400 text-sm">{brand.industry}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">{brand.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="text-lg font-bold text-green-400">${brand.budget}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-white">{brand.rating}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleContactBrand(brand)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Contact Brand
                  </button>
                </div>
              </div>
            ))}
                </div>
                
          {brands.filter(brand => brand.requirements.includes(userProfile.niche)).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No brand matches found for your niche.</p>
              <p className="text-gray-500 mt-2">Try updating your profile to match more brands.</p>
            </div>
          )}
                </div>
                
        {/* Current Campaigns - Updated with Browse Available Campaigns functionality */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Current Brand Campaigns</h2>
          
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <img 
                      src={campaign.brandLogo} 
                      alt={campaign.brand} 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{campaign.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-purple-400 font-semibold">${campaign.budget}</span>
                    <span className="text-gray-400">Deadline: {campaign.deadline}</span>
                  </div>
                  <div className="w-full bg-gray-600 h-2 rounded-full mb-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    ></div>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">From: {campaign.brand}</span>
                  <button
                      onClick={() => handleViewRequirements(campaign)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View Details
                  </button>
                  </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="bg-gray-700 rounded-xl p-8 text-center">
              <FaUser className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Active Campaigns</h3>
              <p className="text-gray-400 mb-6">There are currently no campaigns available in your niche. Check back later as brands create new campaigns.</p>
              <button 
                onClick={handleBrowseCampaigns}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Check for Available Campaigns
              </button>
            </div>
          )}
        </div>

        {/* Messaging Interface - Enhanced */}
        {showMessaging && selectedBrand && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img
                    src={selectedBrand.logo}
                    alt={selectedBrand.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <h2 className="text-xl font-semibold text-white">Chat with {selectedBrand.name}</h2>
                </div>
                <button
                  onClick={() => setShowMessaging(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-900 rounded-xl">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-700 p-3 rounded-full mb-4">
                      <FaEnvelope className="text-3xl text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Start Conversation</h3>
                    <p className="text-gray-400 max-w-xs">
                      Send a message to start collaborating with {selectedBrand.name}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.sender === 'brand' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                        className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                        message.sender === 'brand'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-700 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Requirements Modal - Enhanced */}
        {showRequirementsModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedCampaign.brandLogo} 
                  alt={selectedCampaign.brand} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="text-xl font-bold text-white">{selectedCampaign.title}</h2>
                </div>
              
              <p className="text-gray-300 mb-4">{selectedCampaign.description}</p>
              
              <div className="bg-gray-700 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-white mb-2">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Budget</p>
                    <p className="text-green-400 font-semibold">${selectedCampaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Deadline</p>
                    <p className="text-white">{selectedCampaign.deadline}</p>
                    {/* Time left until deadline */}
                    {selectedCampaign.deadline && (
                      <p className="text-xs text-yellow-300 mt-1">
                        {(() => {
                          const now = new Date();
                          const deadline = new Date(selectedCampaign.deadline);
                          const diffMs = deadline - now;
                          if (diffMs <= 0) return 'Deadline passed';
                          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
                          if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} left`;
                          if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
                          return 'Less than 1 hour left';
                        })()}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 mt-2">Brand</p>
                    <p className="text-white">{selectedCampaign.brand}</p>
                  </div>
                </div>
              </div>
              {/* Tasks Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-2">Tasks</h3>
                {selectedCampaign.tasks && selectedCampaign.tasks.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedCampaign.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span className="text-gray-300">{task}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No specific tasks listed for this campaign.</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRequirementsModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
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
        
        {/* Campaign Offers for Creator */}
        {campaignOffers.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">Campaign Offers</h2>
            {campaignOffers.map(offer => (
              <div key={offer.id} className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-700 mb-2">{offer.description}</p>
                <div className="mb-2"><span className="font-semibold">Payment:</span> ${offer.payment}</div>
                <div className="mb-2"><span className="font-semibold">Deadline:</span> {offer.deadline}</div>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => handleOfferResponse(offer.id, true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Accept</button>
                  <button onClick={() => handleOfferResponse(offer.id, false)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Payment Breakdown Modal */}
        {showPaymentBreakdown && acceptedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Payment Breakdown</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Total Payment:</span>
                  <span>${Number(acceptedOffer.payment).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Platform Fee (8%):</span>
                  <span>-${(Number(acceptedOffer.payment) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-700 text-lg">
                  <span>You Receive:</span>
                  <span>${(Number(acceptedOffer.payment) * 0.92).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setShowPaymentBreakdown(false)} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandMatching; 