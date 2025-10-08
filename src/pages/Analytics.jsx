import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('followers');
  const [growthMetrics, setGrowthMetrics] = useState({
    followers: 0,
    views: 0
  });
  const [engagementData, setEngagementData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isCreatorDashboard, setIsCreatorDashboard] = useState(false);
  const [averageCPM, setAverageCPM] = useState(0);

  const fetchPlatformData = async (platform) => {
    try {
      // Mock API call - Replace with real API endpoint later
      const mockApiCall = async (platform) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = {
          youtube: {
            followers: 15000,
            views: 250000,
            engagement: 4.5,
            cpm: 5.2,
            recentVideos: [
              { title: 'How to Grow Your Channel', views: 50000, engagement: 4.8 },
              { title: 'Content Creation Tips', views: 35000, engagement: 4.2 }
            ]
          },
          tiktok: {
            followers: 25000,
            views: 500000,
            engagement: 6.2,
            cpm: 4.8,
            recentVideos: [
              { title: 'Viral Dance Tutorial', views: 150000, engagement: 6.5 },
              { title: 'Trending Challenge', views: 120000, engagement: 6.0 }
            ]
          },
          facebook: {
            followers: 20000,
            views: 300000,
            engagement: 3.8,
            cpm: 3.5,
            recentVideos: [
              { title: 'Facebook Live Session', views: 45000, engagement: 4.0 },
              { title: 'Community Update', views: 30000, engagement: 3.5 }
            ]
          },
          snapchat: {
            followers: 18000,
            views: 200000,
            engagement: 4.1,
            cpm: 4.2,
            recentVideos: [
              { title: 'Daily Story', views: 25000, engagement: 4.3 },
              { title: 'Behind the Scenes', views: 20000, engagement: 4.0 }
            ]
          }
        };

        return mockData[platform] || {
          followers: 0,
          views: 0,
          engagement: 0,
          cpm: 0,
          recentVideos: []
        };
      };

      if (platform === 'all') {
        const platforms = ['youtube', 'tiktok', 'facebook', 'snapchat'];
        const results = await Promise.all(platforms.map(p => mockApiCall(p)));
        const totalCPM = results.reduce((acc, curr) => acc + curr.cpm, 0);
        const averageCPM = totalCPM / results.length;
        setAverageCPM(averageCPM);
        
        return results.reduce((acc, curr) => ({
          followers: acc.followers + curr.followers,
          views: acc.views + curr.views,
          engagement: (acc.engagement + curr.engagement) / results.length,
          cpm: averageCPM,
          recentVideos: [...acc.recentVideos, ...curr.recentVideos].slice(0, 4)
        }), { followers: 0, views: 0, engagement: 0, cpm: 0, recentVideos: [] });
      }

      const platformData = await mockApiCall(platform);
      setAverageCPM(platformData.cpm);
      return platformData;
    } catch (error) {
      console.error(`Error fetching ${platform} data:`, error);
      throw error;
    }
  };

  const fetchEngagementData = async (platform) => {
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const data = [];
      const today = new Date();
      
      // Create array of dates in chronological order (oldest to newest)
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - i));
        
        // Format date based on time range
        let formattedDate;
        if (timeRange === '7d') {
          // For 7-day view, show day of week
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          formattedDate = dayNames[date.getDay()];
        } else {
          // For other ranges, show date in DD/MM/YYYY format
          formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }

        // Generate random growth for followers and views
        const baseFollowers = platform === 'all' ? 78000 : 
          platform === 'youtube' ? 15000 :
          platform === 'tiktok' ? 25000 :
          platform === 'facebook' ? 20000 : 18000;
          
        const baseViews = platform === 'all' ? 1250000 :
          platform === 'youtube' ? 250000 :
          platform === 'tiktok' ? 500000 :
          platform === 'facebook' ? 300000 : 200000;

        data.push({
          date: formattedDate,
          followers: Math.floor(baseFollowers + (Math.random() * 1000)),
          views: Math.floor(baseViews + (Math.random() * 5000))
        });
      }

      return data;
    } catch (error) {
      console.error(`Error fetching engagement data:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const checkUserStatus = () => {
      const premiumStatus = localStorage.getItem('isPremium') === 'true';
      const dashboardType = localStorage.getItem('dashboardType');
      const userPlan = localStorage.getItem('userPlan');
      
      // Set dashboard type based on userPlan
      if (userPlan === 'basic') {
        setIsPremium(false);
        setIsCreatorDashboard(false);
      } else {
        setIsCreatorDashboard(true);
      }
      
      setIsPremium(premiumStatus);
    };

    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch platform-specific data
        const platformData = await fetchPlatformData(selectedPlatform);
        setGrowthMetrics({
          followers: platformData.followers,
          views: platformData.views,
          recentVideos: platformData.recentVideos
        });

        // Fetch engagement data for the graph
        const engagementData = await fetchEngagementData(selectedPlatform);
        setEngagementData(engagementData);

      } catch (err) {
        setError('Failed to load analytics data. Please try again later.');
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
    fetchAnalyticsData();
  }, [timeRange, selectedPlatform]);

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '📊', color: 'bg-gray-500' },
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: 'bg-red-500' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: 'bg-yellow-400' }
  ];

  const timeRanges = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' }
  ];

  const handleUpgradeClick = () => {
    navigate('/paywall', { 
      state: { 
        from: 'analytics',
        selectedPlan: 'premium'
      } 
    });
  };

  const chartData = {
    labels: engagementData.map(d => d.date),
    datasets: [
      {
        label: selectedMetric === 'followers' ? 'Followers' : 'Views',
        data: engagementData.map(d => d[selectedMetric]),
        borderColor: selectedMetric === 'followers' ? 'rgb(59, 130, 246)' : 'rgb(255, 99, 132)',
        backgroundColor: selectedMetric === 'followers' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedMetric === 'followers' ? 'Followers' : 'Views'} Over Time`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeRange === '7d' ? 'Day' : 'Date'
        },
        ticks: {
          maxRotation: timeRange === '7d' ? 0 : 45,
          minRotation: timeRange === '7d' ? 0 : 45
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: selectedMetric === 'followers' ? 'Followers' : 'Views'
        }
      }
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="flex items-center h-16">
            <button 
              onClick={handleBack} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">Growth & Analytics</h1>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Track your growth and engagement across platforms</p>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  selectedPlatform === platform.id
                    ? `${platform.color} text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range and Metric Selection */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="followers">Followers</option>
              <option value="views">Views</option>
            </select>
          </div>
        </div>

        {/* Growth Analysis Graph */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Growth Analysis</h2>
          <div className="relative">
            {!isCreatorDashboard && selectedPlatform !== 'all' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">Upgrade to Creator Dashboard</p>
                  <p className="text-gray-600 mb-4">Get access to platform-specific analytics</p>
                  <button
                    onClick={handleUpgradeClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: selectedMetric === 'followers' ? 'Followers Growth' : 'Views Growth'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: selectedMetric === 'followers' ? 'Followers' : 'Views'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: timeRange === '7d' ? 'Day of Week' : 'Date'
                    },
                    ticks: {
                      maxRotation: timeRange === '7d' ? 0 : 45,
                      minRotation: timeRange === '7d' ? 0 : 45
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 