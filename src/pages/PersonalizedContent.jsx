import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTrendingContentIdeas } from '../api/googleInsights';
import { getAIKeywordSuggestions } from '../api/aiKeywordGenerator';
import { getYoutubeContentIdeas } from '../api/youtubeContentIdeas';
import { getBestPostTimes } from '../api/bestPostTimes';
import { getHashtags } from '../api/hashtagGenerator';

const PersonalizedContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [contentPerformance, setContentPerformance] = useState({
    views: 0,
    engagement: 0,
    ctr: 0,
    shares: 0
  });
  const [userProfile, setUserProfile] = useState({
    industry: '',
    region: '',
    contentHistory: [],
    audienceDemographics: {},
    topPerformingContent: []
  });
  const [platformData, setPlatformData] = useState({
    youtube: {
      views: 0,
      engagement: 0,
      watchTime: 0,
      subscribers: 0,
      revenue: 0
    },
    tiktok: {
      views: 0,
      engagement: 0,
      watchTime: 0,
      followers: 0,
      revenue: 0
    },
    facebook: {
      views: 0,
      engagement: 0,
      watchTime: 0,
      followers: 0,
      revenue: 0
    },
    snapchat: {
      views: 0,
      engagement: 0,
      watchTime: 0,
      followers: 0,
      revenue: 0
    }
  });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [seoSuggestions, setSeoSuggestions] = useState({
    keywords: [],
    hashtags: []
  });
  const [audienceInsights, setAudienceInsights] = useState({
    demographics: {},
    bestPostingTimes: [],
    regions: []
  });
  const [platformStrategies, setPlatformStrategies] = useState({});
  const [competitorAnalysis, setCompetitorAnalysis] = useState([]);
  const [aiIdeas, setAiIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState('review');
  const [aiPrompts, setAiPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [stepByStepGuide, setStepByStepGuide] = useState([]);
  const [bestPostTimes, setBestPostTimes] = useState([]);
  const [bestPostTimesLoading, setBestPostTimesLoading] = useState(false);
  const [bestPostTimesError, setBestPostTimesError] = useState('');
  const [tiktokTrends, setTiktokTrends] = useState([]);
  const [googleKeywords, setGoogleKeywords] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [bestTimes, setBestTimes] = useState([]);
  const [youtubeIdeas, setYoutubeIdeas] = useState([]);
  const [hashtagRequestsLeft, setHashtagRequestsLeft] = useState(10);

  const STORAGE_KEY = 'hashtag_requests_today';
  const MAX_REQUESTS_PER_DAY = 10;

  useEffect(() => {
    // Check if user is premium
    const userPlan = localStorage.getItem('userPlan');
    setIsPremium(userPlan === 'premium');
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    if (savedData.date !== today) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      setHashtagRequestsLeft(MAX_REQUESTS_PER_DAY);
    } else {
      setHashtagRequestsLeft(MAX_REQUESTS_PER_DAY - savedData.count);
    }
  }, []);

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' }
  ];

  const contentTypes = [
    { id: 'review', name: 'Review', icon: '🔍' },
    { id: 'tutorial', name: 'Tutorial', icon: '🎓' },
    { id: 'story', name: 'Story', icon: '📖' },
    { id: 'trend', name: 'Trend', icon: '🔥' },
    { id: 'challenge', name: 'Challenge', icon: '🏆' },
    { id: 'news', name: 'News', icon: '📰' },
  ];

  const handleUpgradeClick = () => {
    navigate('/paywall', { 
      state: { 
        from: 'personalized-content',
        selectedPlan: 'premium'
      } 
    });
  };

  const handlePlatformSelect = async (platform) => {
    setSelectedPlatform(platform);
    setIsLoading(true);
    try {
      await fetchPlatformData(platform);
      await fetchTrendingTopics(platform);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading platform data:', error);
      setIsLoading(false);
    }
  };

  // Function to fetch platform-specific data
  const fetchPlatformData = async (platform) => {
    try {
      // Mock data for different platforms
      const platformDataMap = {
        youtube: {
          contentPerformance: {
            views: 150000,
            engagement: 8.5,
            ctr: 12.3,
            shares: 1500
          },
          trendingTopics: [
            {
              title: 'Latest Smartphone Reviews',
              engagement: 95,
              relevance: 98,
              dataPoints: ['Market trends', 'Consumer preferences', 'Tech innovations']
            },
            {
              title: 'AI Gadgets 2024',
              engagement: 92,
              relevance: 95,
              dataPoints: ['AI integration', 'Smart devices', 'Future tech']
            }
          ],
          aiIdeas: [
            {
              title: 'Tech Review Series',
              description: 'In-depth analysis of latest tech products',
              estimatedEngagement: 95,
              difficulty: 'Medium',
              dataPoints: ['Product comparisons', 'User feedback', 'Market analysis']
            }
          ]
        },
        tiktok: {
          contentPerformance: {
            views: 100000,
            engagement: 12.3,
            ctr: 15.6,
            shares: 2500
          },
          trendingTopics: [
            {
              title: 'Tech Tips & Tricks',
              engagement: 98,
              relevance: 95,
              dataPoints: ['Quick tutorials', 'Life hacks', 'Tech shortcuts']
            },
            {
              title: 'Gadget Unboxing',
              engagement: 95,
              relevance: 92,
              dataPoints: ['First impressions', 'Product features', 'User experience']
            }
          ],
          aiIdeas: [
            {
              title: 'Tech Hacks Series',
              description: 'Quick and useful tech tips',
              estimatedEngagement: 98,
              difficulty: 'Easy',
              dataPoints: ['User engagement', 'Trend analysis', 'Content format']
            }
          ]
        },
        facebook: {
          contentPerformance: {
            views: 80000,
            engagement: 6.8,
            ctr: 8.9,
            shares: 1200
          },
          trendingTopics: [
            {
              title: 'Tech Community Updates',
              engagement: 90,
              relevance: 95,
              dataPoints: ['Community feedback', 'Group discussions', 'Tech news']
            }
          ],
          aiIdeas: [
            {
              title: 'Tech Discussion Series',
              description: 'Engaging tech community content',
              estimatedEngagement: 92,
              difficulty: 'Medium',
              dataPoints: ['Community interests', 'Discussion topics', 'Engagement strategies']
            }
          ]
        },
        snapchat: {
          contentPerformance: {
            views: 50000,
            engagement: 9.2,
            ctr: 11.4,
            shares: 800
          },
          trendingTopics: [
            {
              title: 'Daily Tech Updates',
              engagement: 95,
              relevance: 98,
              dataPoints: ['Quick updates', 'Story format', 'Engagement metrics']
            }
          ],
          aiIdeas: [
            {
              title: 'Tech Stories Series',
              description: 'Daily tech news and updates',
              estimatedEngagement: 95,
              difficulty: 'Easy',
              dataPoints: ['Story format', 'Engagement patterns', 'Content timing']
            }
          ]
        }
      };

      // Get data for the selected platform or use 'all' data
      const data = platform === 'all' 
        ? Object.values(platformDataMap).reduce((acc, curr) => ({
            contentPerformance: {
              views: acc.contentPerformance.views + curr.contentPerformance.views,
              engagement: (acc.contentPerformance.engagement + curr.contentPerformance.engagement) / 2,
              ctr: (acc.contentPerformance.ctr + curr.contentPerformance.ctr) / 2,
              shares: acc.contentPerformance.shares + curr.contentPerformance.shares
            },
            trendingTopics: [...acc.trendingTopics, ...curr.trendingTopics],
            aiIdeas: [...acc.aiIdeas, ...curr.aiIdeas]
          }), {
            contentPerformance: { views: 0, engagement: 0, ctr: 0, shares: 0 },
            trendingTopics: [],
            aiIdeas: []
          })
        : platformDataMap[platform];

      // Update state with platform-specific data
      setContentPerformance(data.contentPerformance);
      setTrendingTopics(data.trendingTopics);
      setAiIdeas(data.aiIdeas);
    } catch (error) {
      console.error('Error fetching platform data:', error);
      throw error;
    }
  };

  // Function to fetch trending topics based on platform
  const fetchTrendingTopics = async (platform) => {
    try {
      const [trends, keywordList, postTimes] = await Promise.all([
        getBestPostTimes(platform),
        getTrendingContentIdeas(platform, selectedContentType),
      ]);

      // Combine trending topics and Google keywords into one list for Trending Topics section
      const combinedTrends = trends.concat(keywordList.map(kw => ({ text: kw.keyword || kw.text })));

      setTrendingTopics(combinedTrends);
      setKeywords(keywordList);
      setBestTimes(postTimes);

      // Handle YouTube specific ideas
      if (platform === 'YouTube' && selectedContentType) {
        const youtubeIdeasData = await getYoutubeContentIdeas(platform, selectedContentType);
        setYoutubeIdeas(youtubeIdeasData);
      }

      if (hashtagRequestsLeft > 0) {
        const hashtagList = await getHashtags(platform, selectedContentType);
        setHashtags(hashtagList);

        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        savedData.count += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
        setHashtagRequestsLeft(MAX_REQUESTS_PER_DAY - savedData.count);
      } else {
        console.warn('Daily hashtag request limit reached.');
      }
    } catch (err) {
      console.error('Error fetching trending topics:', err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile from localStorage or API
        const storedProfile = localStorage.getItem('userProfile');
        const profile = storedProfile ? JSON.parse(storedProfile) : {
          industry: 'Technology', // Default industry
          region: 'United States', // Default region
          contentHistory: [],
          audienceDemographics: {},
          topPerformingContent: []
        };
        setUserProfile(profile);

        // Fetch content performance based on user's industry and region
        const industryPerformance = await fetchIndustryPerformance(profile.industry);
        const regionalPerformance = await fetchRegionalPerformance(profile.region);
        
        setContentPerformance({
          views: industryPerformance.views + regionalPerformance.views,
          engagement: (industryPerformance.engagement + regionalPerformance.engagement) / 2,
          ctr: (industryPerformance.ctr + regionalPerformance.ctr) / 2,
          shares: industryPerformance.shares + regionalPerformance.shares
        });

        // Generate AI-powered content ideas based on user's profile
        const aiGeneratedIdeas = await generateContentIdeas(profile);
        setAiIdeas(aiGeneratedIdeas);

        // Fetch trending topics specific to user's industry
        const industryTrends = await fetchIndustryTrends(profile.industry);
        setTrendingTopics(industryTrends);

        // Mock SEO suggestions
        setSeoSuggestions({
          keywords: ['tech review 2024', 'best gadgets', 'tech unboxing'],
          hashtags: ['#techreview', '#gadgets', '#unboxing', '#tech', '#review', '#gadgetreview']
        });

        // Mock audience insights
        setAudienceInsights({
          demographics: {
            age: { '18-24': 35, '25-34': 45, '35-44': 20 },
            gender: { male: 65, female: 35 },
            interests: ['Technology', 'Gaming', 'Innovation']
          },
          bestPostingTimes: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:00 PM'],
          regions: ['United States', 'Canada', 'United Kingdom']
        });

        // Mock platform strategies
        setPlatformStrategies({
          youtube: {
            recommendedLength: '8-12 minutes',
            bestPractices: ['Detailed reviews', 'Comparison videos', 'Tutorial content']
          },
          tiktok: {
            recommendedLength: '30-60 seconds',
            bestPractices: ['Quick tips', 'Product highlights', 'Behind the scenes']
          },
          instagram: {
            recommendedLength: '30-90 seconds',
            bestPractices: ['Product showcases', 'Tech tips', 'Story highlights']
          }
        });

        // Mock competitor analysis
        setCompetitorAnalysis([
          {
            name: 'TechReview Pro',
            followers: 75000,
            engagement: 9.2,
            strengths: ['Detailed analysis', 'Production quality'],
            weaknesses: ['Posting frequency', 'Social engagement']
          },
          {
            name: 'GadgetGuru',
            followers: 65000,
            engagement: 8.8,
            strengths: ['Quick reviews', 'Social presence'],
            weaknesses: ['Content depth', 'Technical accuracy']
          }
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to generate personalized content ideas
  const generateContentIdeas = async (profile) => {
    // This would typically call an AI service
    // For now, using mock data based on industry
    const industryIdeas = {
      'Technology': [
        {
          title: 'Latest Tech Trends in Your Region',
          description: 'Analysis of emerging technologies in your area',
          estimatedEngagement: 95,
          difficulty: 'Medium',
          dataPoints: ['Regional tech adoption', 'Local market needs', 'Competitor analysis']
        },
        {
          title: 'Industry-Specific Tech Solutions',
          description: 'How technology is transforming your specific industry',
          estimatedEngagement: 92,
          difficulty: 'Medium',
          dataPoints: ['Industry trends', 'Success stories', 'Future predictions']
        }
      ],
      'Gaming': [
        {
          title: 'Regional Gaming Trends',
          description: 'Popular games and trends in your region',
          estimatedEngagement: 98,
          difficulty: 'Easy',
          dataPoints: ['Local gaming preferences', 'Popular platforms', 'Community interests']
        }
      ],
      // Add more industries as needed
    };

    return industryIdeas[profile.industry] || industryIdeas['Technology'];
  };

  // Function to fetch industry-specific trends
  const fetchIndustryTrends = async (industry) => {
    // This would typically call an API
    // For now, using mock data based on industry
    const industryTrends = {
      'Technology': [
        {
          title: 'AI Integration in Business',
          engagement: 95,
          relevance: 98,
          dataPoints: ['Market adoption', 'Success stories', 'Implementation guides']
        },
        {
          title: 'Cybersecurity Best Practices',
          engagement: 92,
          relevance: 96,
          dataPoints: ['Threat analysis', 'Protection methods', 'Industry standards']
        }
      ],
      'Gaming': [
        {
          title: 'Next-Gen Gaming Technology',
          engagement: 98,
          relevance: 97,
          dataPoints: ['Hardware trends', 'Software innovations', 'Player preferences']
        }
      ],
      // Add more industries as needed
    };

    return industryTrends[industry] || industryTrends['Technology'];
  };

  // Back navigation logic
  const handleBack = () => {
    const userPlan = localStorage.getItem('userPlan');
    if (userPlan === 'basic') {
      navigate('/basic-dashboard');
    } else if (userPlan === 'premium') {
      navigate('/creator-dashboard');
    } else {
      navigate('/');
    }
  };

  // Generate up to 3 AI prompts based on platform and content type
  const generateAIPrompts = async () => {
    // Generate mock AI ideas based on selected platform and content type
    const platformIdeas = {
      youtube: [
        'Create a "Day in the Life" vlog with trending music',
        'Review the latest tech gadget and compare it to last year\'s model',
        'Host a live Q&A about your creative process',
        'Share your top 5 tips for growing a YouTube channel in 2024'
      ],
      tiktok: [
        'Film a quick tutorial using a trending TikTok sound',
        'Show a behind-the-scenes look at your content creation',
        'Start a challenge and encourage followers to duet',
        'Share a funny or relatable story in under 30 seconds'
      ],
      facebook: [
        'Go live and answer audience questions about your niche',
        'Post a poll to engage your community',
        'Share a throwback post and ask for memories',
        'Create a short video highlighting your best moments this month'
      ],
      snapchat: [
        'Share a daily tip or fact as a Snap story',
        'Show a quick unboxing or product review',
        'Create a mini-series with themed Snaps',
        'Use AR filters to make your content stand out'
      ]
    };
    const ideas = platformIdeas[selectedPlatform] || [];
    setAiPrompts(ideas);
    setCurrentPromptIndex(0);
    setStepByStepGuide([]);
    // Fetch best post times
    setBestPostTimesLoading(true);
    setBestPostTimesError('');
    try {
      const times = await getBestPostTimes(selectedPlatform);
      setBestPostTimes(times);
    } catch (err) {
      setBestPostTimesError('Could not fetch best post times.');
      setBestPostTimes([]);
    }
    setBestPostTimesLoading(false);
    setTrendsLoading(true);
    setTrendsError('');
    setTiktokTrends([]);
    setGoogleKeywords([]);
    try {
      const [tiktok, google] = await Promise.all([
        getTrendingTikTokVideos(5),
        getTrendingContentIdeas(selectedPlatform, selectedContentType)
      ]);
      setTiktokTrends(tiktok);
      setGoogleKeywords(google);
    } catch (err) {
      setTrendsError(err.message || 'Failed to fetch trends.');
    }
    setTrendsLoading(false);
  };

  useEffect(() => {
    generateAIPrompts();
  }, [selectedPlatform, selectedContentType, userProfile]);

  // Add the getBestPostTimes function (mock for now)
  const getBestPostTimes = async (platform) => {
    try {
      let activity = [];
      switch (platform.toLowerCase()) {
        case 'facebook':
        case 'tiktok':
        case 'youtube':
        case 'instagram':
          activity = Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000));
          break;
        default:
          throw new Error('Unsupported platform');
      }
      const topHours = activity
        .map((value, hour) => ({ hour, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map(item => item.hour);
      return topHours;
    } catch (error) {
      console.error('Failed to get best post times:', error);
      return [];
    }
  };

  // TikTok Trends API
  const getTrendingTikTokVideos = async (limit = 5) => {
    // Rate limit: 100/month
    const key = 'tiktok_trends_requests';
    const now = new Date();
    const month = now.getMonth();
    let usage = JSON.parse(localStorage.getItem(key) || '{}');
    if (usage.month !== month) usage = { month, count: 0 };
    if (usage.count >= 100) throw new Error('TikTok Trends API limit reached for this month.');
    usage.count++;
    localStorage.setItem(key, JSON.stringify(usage));
    try {
      const res = await fetch(`https://tiktok-scraper2.p.rapidapi.com/trending?limit=${limit}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'tiktok-scraper2.p.rapidapi.com',
          'x-rapidapi-key': '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'
        }
      });
      const data = await res.json();
      return data?.videos || [];
    } catch (err) {
      throw new Error('Failed to fetch TikTok trending videos.');
    }
  };

  // Google Insights API
  const getTrendingContentIdeas = async (platform, contentType) => {
    // Rate limit: 20/month
    const key = 'google_insights_requests';
    const now = new Date();
    const month = now.getMonth();
    let usage = JSON.parse(localStorage.getItem(key) || '{}');
    if (usage.month !== month) usage = { month, count: 0 };
    if (usage.count >= 20) throw new Error('Google Insights API limit reached for this month.');
    usage.count++;
    localStorage.setItem(key, JSON.stringify(usage));
    try {
      const keyword = `${platform} ${contentType}`;
      const url = `https://google-keyword-insight1.p.rapidapi.com/keysuggest/?keyword=${encodeURIComponent(keyword)}&location=US&lang=en`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'google-keyword-insight1.p.rapidapi.com',
          'x-rapidapi-key': '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'
        }
      });
      const data = await res.json();
      const items = Array.isArray(data) ? data : data?.results || [];
      return items.map(item => ({
        text: item.text,
        volume: item.volume,
        trend: item.trend
      }));
    } catch (err) {
      throw new Error('Failed to fetch Google keyword ideas.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Top Navigation Bar */}
        <div className="flex items-center h-16 mb-8">
          <button 
            onClick={handleBack} 
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="ml-4 text-2xl font-bold text-purple-700">AI-Powered Personalized Content</h1>
        </div>
        {/* Platform & Content Type Selection */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Platform</h3>
            <div className="flex space-x-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                    selectedPlatform === platform.id
                      ? 'bg-purple-100 text-purple-800 border-purple-400 shadow-lg'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-semibold mb-2">Content Type</h3>
            <div className="flex space-x-2">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContentType(type.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                    selectedContentType === type.id
                      ? 'bg-blue-100 text-blue-800 border-blue-400 shadow-lg'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* AI Prompt Generator */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-purple-700">AI Content Assistant</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {platforms.find(p => p.id === selectedPlatform)?.name || 'Select Platform'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {contentTypes.find(t => t.id === selectedContentType)?.name || 'Select Type'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-inner border border-purple-100 mb-6">
              {(!selectedPlatform || !selectedContentType) ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500 text-lg">Select a platform and content type to start generating AI-powered content ideas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiPrompts.length > 0 ? (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-lg text-purple-900 font-mono">{aiPrompts[currentPromptIndex]}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500 text-lg">Click generate to create AI-powered content ideas</p>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                      onClick={() => {
                        generateAIPrompts();
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Ideas</span>
                    </button>
                    {aiPrompts.length > 0 && (
                      <button
                        className="px-6 py-3 bg-white border-2 border-purple-200 text-purple-700 rounded-lg font-bold shadow hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => setCurrentPromptIndex((currentPromptIndex + 1) % aiPrompts.length)}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Try Another</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>AI will analyze your platform, content type, and profile to generate personalized content ideas</p>
              </div>
            </div>
          </div>
        </div>
        {/* Content Performance (remove Shares, engagement to 2 decimals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-purple-100">
            <h4 className="text-sm font-medium text-purple-700">Estimated Total Views (last 30 days) on {platforms.find(p => p.id === selectedPlatform)?.name || ''}</h4>
            <p className="text-2xl font-semibold text-purple-900">{contentPerformance.views.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-purple-100">
            <h4 className="text-sm font-medium text-purple-700">Total Followers (last 30 days)</h4>
            <p className="text-2xl font-semibold text-purple-900">{contentPerformance.followers ? contentPerformance.followers.toLocaleString() : 0}</p>
          </div>
        </div>
        {/* Trending Topics & AI Ideas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-blue-50 p-6 rounded-2xl shadow border border-blue-100">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Trending Topics for You</h3>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-1">{topic.text || topic.title || 'Idea'}</h4>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-green-600">↑ {topic.trend}%</span>
                    <span className="text-purple-600">Relevance: {topic.relevance}%</span>
                  </div>
                  <div className="text-xs text-blue-900">
                    <p className="font-medium mb-1">Data Points:</p>
                    <ul className="list-disc list-inside">
                      {topic.dataPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700 mb-4">AI-Powered Content Ideas</h3>
            <div className="space-y-4">
              {aiPrompts.map((prompt, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-1">{prompt}</h4>
                  <button className="mt-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded text-xs hover:scale-105 transition-transform"
                    onClick={() => { setSelectedIdea(prompt); setShowIdeaModal(true); }}
                  >
                    Use Idea
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* SEO Suggestions */}
        <div className="bg-white p-6 rounded-2xl shadow border border-yellow-100 mb-10">
          <h3 className="text-lg font-bold text-yellow-700 mb-4">SEO Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {seoSuggestions.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {seoSuggestions.hashtags.map((hashtag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Best Post Times Section */}
        <div className="bg-white p-6 rounded-2xl shadow border border-blue-100 mb-10">
          <h3 className="text-lg font-bold text-blue-700 mb-4">Best Times to Post</h3>
          {bestPostTimesLoading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : bestPostTimesError ? (
            <div className="text-red-600">{bestPostTimesError}</div>
          ) : bestPostTimes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {bestPostTimes.map((hour, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                  {hour}:00
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No data available. Click Generate Ideas to see best post times.</div>
          )}
        </div>
        {/* Use Idea Modal */}
        {showIdeaModal && selectedIdea && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => setShowIdeaModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Step-by-Step Guide</h2>
              <ol className="list-decimal list-inside text-gray-800 space-y-2 mb-4">
                {stepByStepGuide.length > 0 ? (
                  stepByStepGuide.map((step, idx) => <li key={idx}>{step}</li>)
                ) : (
                  <li>No detailed step-by-step guide available for this combination yet.</li>
                )}
              </ol>
              <div className="bg-purple-50 p-4 rounded-lg text-purple-800 text-sm">
                <strong>Pro Tip:</strong> Adapt each step to current {platforms.find(p => p.id === selectedPlatform)?.name} algorithm best practices for maximum reach and engagement.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedContent; 